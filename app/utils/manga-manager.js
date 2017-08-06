import _ from 'lodash';
import Promise from 'bluebird';
import EventEmitter from 'events';
import { Parser } from 'manga-parser';

import db from './db';
import Chapter from '../models/chapter';
import Manga from '../models/manga';

Promise.config({cancellation: true});

export default class MangaManager {
    static pages = {};

    /**
     * @param {string} catalogName - The name of the catalog to use
     * @param {boolean} fetchNextPage - Optional URL to fetch, used for pagination
     * @return {Promise}
     */
    static getPopularManga (catalogName, fetchNextPage = false) {
        return new Promise((resolve, reject) => {
            if (fetchNextPage) {
                return Parser.getPopularMangaList(catalogName, MangaManager.pages[catalogName]).then(paginator => {
                    MangaManager.handleMangaList(catalogName, paginator, resolve, reject);
                });
            }

            db
                .findAll(Manga)
                .where({catalog: catalogName})
                .order(Manga.attributes.catalogId.ascending())
                .limit(20)
                .then(mangas => {
                    if (mangas.length) {
                        resolve({
                            mangas,
                            hasNext: true,
                            mangasEvents: new EventEmitter()
                        });

                        return Parser.getPopularMangaList(catalogName).then(paginator => {
                            MangaManager.pages[catalogName] = paginator.nextPage;
                        });
                    }

                    return Parser.getPopularMangaList(catalogName).then(paginator => {
                        MangaManager.handleMangaList(catalogName, paginator, resolve, reject);
                    });
                }).catch(error => {
                    console.log(error);
                    return Parser.getPopularMangaList(catalogName).then(paginator => {
                        MangaManager.handleMangaList(catalogName, paginator, resolve, reject);
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
        return new Promise((resolve, reject) => {
            Parser.searchManga(catalogName, query).then(paginator => {
                MangaManager.handleMangaList(catalogName, paginator, resolve, reject);
            });
        });
    }

    /**
     * @private
     * @param {string} catalogName
     * @param {object} paginator
     * @param {function} resolve
     * @param {function} reject
     */
    static handleMangaList (catalogName, paginator, resolve, reject) {
        _.forEach(paginator.mangas, (manga, key) => {
            paginator.mangas[key] = new Manga(manga);
        });

        // Check if Manga objects are in database
        db.modelify(Manga, _.map(paginator.mangas, 'id')).then(mangas => {
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
                        const promise = Parser.getMangaDetail(catalogName, paginator.mangas[index]);
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

            MangaManager.pages[catalogName] = paginator.nextPage;

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
        return new Promise((resolve, reject) => {
            Parser.getMangaDetail(manga.catalog, manga).then(manga => {
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
        return new Promise((resolve, reject) => {
            Parser.getChapterList(manga.catalog, manga).then(chapters => {
                _.forEach(chapters, (chapter, key) => {
                    chapters[key] = new Chapter(chapter);
                });
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
        return new Promise(function (resolve, reject) {
            let before = (new Date()).getTime();
            Parser.getPageList(manga.catalog, chapter).then(function (pages) {
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
        return new Promise(function (resolve, reject) {
            let before = (new Date()).getTime();
            Parser.getImageURL(manga.catalog, pageURL).then(function (imageURL) {
                console.log('getImageURL took %d ms', (new Date()).getTime() - before);
                resolve(imageURL);
            }).catch(function (error) {
                console.error('getImageURL failed after %d ms', (new Date()).getTime() - before);
                reject(error);
            });
        });
    }
}
