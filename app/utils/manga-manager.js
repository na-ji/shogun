import _ from 'lodash';
import Promise from 'promise';

import CatalogManager from './catalog-manager';
import Parser from './site-parser';
import db from './db';
import Chapter from '../models/chapter';
import Manga from '../models/manga';

export default class MangaManager {
    /**
     * @param {string} catalogName - The name of the catalog to use
     * @param {string} url - Optional URL to fetch, used for pagination
     * @return {Promise}
     */
    static getPopularManga (catalogName, url) {
        let catalog = CatalogManager.getCatalog(catalogName);

        return new Promise((resolve, reject) => {
            Parser.getPopularMangaList(catalog, url).then(paginator => {
                // Check if Manga objects are in database
                db.modelify(Manga, _.map(paginator.mangas, 'id')).then(mangas => {
                    let promises = [];

                    // Generate Promise that resolve with full details
                    _.forEach(mangas, (manga, index) => {
                        promises.push(new Promise((resolve, reject) => {
                            if (!_.isNil(manga)) {
                                resolve(manga);
                            } else {
                                if (!paginator.mangas[index].thumbnailUrl) {
                                    Parser.getMangaDetail(catalog, manga).then(manga => {
                                        resolve(manga);
                                    });
                                } else {
                                    resolve(paginator.mangas[index]);
                                }
                            }
                        }));
                    });

                    resolve({
                        ...paginator,
                        promises
                    });

                    // TODO : Use bluebird mapSeries
                    Promise.all(promises).then(values => {
                        let toPersist = [];
                        _.forEach(mangas, (manga, index) => {
                            if (_.isNil(manga)) {
                                toPersist.push(values[index]);
                            }
                        });

                        console.log('%d mangas to persist', toPersist.length);
                        console.log(toPersist);

                        if (toPersist.length) {
                            db.inTransaction((t) => {
                                return t.persistModels(toPersist);
                            });
                        }
                    });
                });
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
        console.log(manga);
        return db.inTransaction((t) => {
            return t.persistModel(manga);
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
                resolve(chapters);

                if (manga.inLibrary) {
                    // save chapters to DB
                    db.modelify(Chapter, _.map(chapters, 'id')).then(chaptersInDb => {
                        let toPersist = [];
                        _.forEach(chaptersInDb, function (chapter) {
                            if (_.isNull(chapter)) {
                                toPersist.push(chapter);
                            }
                        });

                        console.log('%d chapters to persist', toPersist.length);
                        console.log(toPersist);

                        if (toPersist.length) {
                            db.inTransaction((t) => {
                                return t.persistModels(toPersist);
                            });
                        }

                        db.inTransaction((t) => {
                            return t.persistModels(toPersist);
                        }).then(() => {
                            manga.chapters = chapters;

                            db.inTransaction((t) => {
                                return t.persistModel(manga);
                            });
                        });
                    });
                }
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
