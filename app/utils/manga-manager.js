import _ from 'lodash';
import Promise from 'bluebird';
import EventEmitter from 'events';

import CatalogManager from './catalog-manager';
import Parser from './site-parser';
import db from './db';
import Chapter from '../models/chapter';
import Manga from '../models/manga';

Promise.config({cancellation: true});

export default class MangaManager {
    /**
     * @param {string} catalogName - The name of the catalog to use
     * @param {boolean} fetchNextPage - Optional URL to fetch, used for pagination
     * @return {Promise}
     */
    static getPopularManga (catalogName, fetchNextPage = false) {
        let catalog = CatalogManager.getCatalog(catalogName);

        return new Promise((resolve, reject) => {
            if (fetchNextPage) {
                return Parser.getPopularMangaList(catalog, fetchNextPage).then(paginator => {
                    MangaManager.handleMangaList(catalog, paginator, resolve, reject);
                });
            }

            db
                .findAll(Manga)
                .where({catalog: catalog.file})
                .order(Manga.attributes.catalogId.ascending())
                .limit(20)
                .then(mangas => {
                    if (mangas.length) {
                        resolve({
                            mangas,
                            hasNext: true,
                            mangasEvents: new EventEmitter()
                        });

                        return Parser.getPopularMangaList(catalog);
                    }

                    return Parser.getPopularMangaList(catalog).then(paginator => {
                        MangaManager.handleMangaList(catalog, paginator, resolve, reject);
                    });
                })
            ;
        });
    }

    /**
     * @param {string} catalogName - The name of the catalog to use
     * @param {string} query - the manga title to search
     */
    static searchManga (catalogName, query) {
        let catalog = CatalogManager.getCatalog(catalogName);

        return new Promise((resolve, reject) => {
            Parser.searchManga(catalog, query).then(paginator => {
                MangaManager.handleMangaList(catalog, paginator, resolve, reject);
            });
        });
    }

    /**
     * @private
     * @param {object} catalog
     * @param {object} paginator
     * @param {function} resolve
     * @param {function} reject
     */
    static handleMangaList (catalog, paginator, resolve, reject) {
        // Check if Manga objects are in database
        db.modelify(Manga, _.map(paginator.mangas, 'id')).then(mangas => {
            // let promises = [];
            const mangasEvents = new EventEmitter();
            let before = (new Date()).getTime();

            // Generate Events that resolve with full details
            Promise.mapSeries(mangas, (manga, index) => {
                if (!_.isNil(manga)) {
                    // Fix to prevent loss of data from database
                    manga.catalogId = paginator.mangas[index].catalogId;
                    mangasEvents.emit('details-fetched', manga);
                    return Promise.resolve(manga);
                } else {
                    if (!paginator.mangas[index].detailsFetched) {
                        const promise = Parser.getMangaDetail(catalog, paginator.mangas[index]);
                        promise.then(manga => {
                            mangasEvents.emit('details-fetched', manga);
                        });
                        return promise;
                    } else {
                        mangasEvents.emit('details-fetched', paginator.mangas[index]);
                        return Promise.resolve(paginator.mangas[index]);
                    }
                }
            }).then(values => {
                console.log('handleMangaList took %d ms', (new Date()).getTime() - before);
                let toPersist = [];
                _.forEach(mangas, (manga, index) => {
                    if (_.isNil(manga)) {
                        toPersist.push(values[index]);
                    }
                });

                console.log('%d/%d mangas to persist', toPersist.length, mangas.length);
                console.log(toPersist);

                if (toPersist.length) {
                    db.inTransaction((t) => {
                        return t.persistModels(toPersist);
                    });
                }
            });

            resolve({
                mangas: paginator.mangas,
                hasNext: paginator.hasNext,
                mangasEvents
            });
        });
    }

    /**
     * @param {string} mangaId
     * @return {Promise}
     */
    static getMangaById (mangaId) {
        return new Promise((resolve, reject) => {
            let before = (new Date()).getTime();

            db.find(Manga, mangaId).then(manga => {
                console.log('getMangaById took %d ms', (new Date()).getTime() - before);
                if (manga !== null) {
                    resolve({
                        manga: manga,
                        chapters: (manga.chapters ? manga.chapters : [])
                    });
                } else {
                    reject(new Error('No manga found'));
                }
            });
        });
    }

    /**
     * @param {Manga} manga
     * @return {Promise}
     */
    static getMangaDetail (manga) {
        let catalog = CatalogManager.getCatalog(manga.catalog);

        return new Promise((resolve, reject) => {
            Parser.getMangaDetail(catalog, manga).then(manga => {
                resolve(manga);
                db.inTransaction((t) => {
                    return t.persistModel(manga);
                });
            }).catch(error => {
                return reject(error);
            });
        });
    }

    /**
     * @param {Manga} manga
     * @return {Promise}
     */
    static toggleInLibrary (manga) {
        manga.inLibrary = !manga.inLibrary;

        return MangaManager.persistManga(manga);
    }

    /**
     * @param {Manga} manga
     * @return {Promise}
     */
    static persistManga (manga) {
        if (!(manga instanceof Manga)) {
            if (_.isObject(manga)) {
                manga = new Manga(manga);
            } else {
                return console.error(manga, 'is not an object');
            }
        }

        return db.inTransaction(t => {
            return t.persistModel(manga);
        });
    }

    /**
     * @param {array} chapters
     * @return {Promise}
     */
    static persistChapters (chapters) {
        return db.inTransaction((t) => {
            return t.persistModels(chapters);
        });
    }

    /**
     * @param {Manga} manga
     * @return {Promise}
     */
    static getChapterList (manga) {
        let catalog = CatalogManager.getCatalog(manga.catalog);

        return new Promise((resolve, reject) => {
            Parser.getChapterList(catalog, manga).then(chapters => {
                chapters = _.uniqBy(chapters, 'id');
                manga.chapters = _.unionBy(manga.chapters, chapters, 'id');

                resolve(chapters);

                // save chapters to DB
                db.modelify(Chapter, _.map(chapters, 'id')).then(chaptersInDb => {
                    let toPersist = [];
                    _.forEach(chaptersInDb, function (chapter, index) {
                        if (_.isNil(chapter)) {
                            toPersist.push(chapters[index]);
                        }
                    });

                    console.log('%d/%d chapters to persist', toPersist.length, chapters.length);
                    console.log(toPersist);

                    if (toPersist.length) {
                        db.inTransaction((t) => {
                            return t.persistModels(toPersist);
                        }).then(() => {
                            db.inTransaction((t) => {
                                return t.persistModel(manga);
                            });
                        });
                    }
                });
            });
        });
    }

    /**
     * Return a Query to be observed by Redux
     * @return {Query}
     */
    static getLibrary () {
        return db.findAll(Manga).where({inLibrary: true}).order(Manga.attributes.title.ascending());
    }

    /**
     * @param {Manga} manga
     * @param {Chapter} chapter
     * @return {Promise}
     */
    static getChapterPages (manga, chapter) {
        let catalog = CatalogManager.getCatalog(manga.catalog);

        return new Promise(function (resolve, reject) {
            let before = (new Date()).getTime();
            Parser.getPageList(catalog, chapter).then(function (pages) {
                console.log('getChapterPages took %d ms', (new Date()).getTime() - before);
                resolve(pages);
            }).catch(function (error) {
                console.error('getChapterPages failed after %d ms', (new Date()).getTime() - before);
                reject(error);
            });
        });
    }

    /**
     * @param {Manga} manga
     * @param {string} pageURL
     * @return {Promise}
     */
    static getImageURL (manga, pageURL) {
        let catalog = CatalogManager.getCatalog(manga.catalog);

        return new Promise(function (resolve, reject) {
            let before = (new Date()).getTime();
            Parser.getImageURL(catalog, pageURL).then(function (imageURL) {
                console.log('getImageURL took %d ms', (new Date()).getTime() - before);
                resolve(imageURL);
            }).catch(function (error) {
                console.error('getImageURL failed after %d ms', (new Date()).getTime() - before);
                reject(error);
            });
        });
    }
}
