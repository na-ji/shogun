import _ from 'lodash';
import Promise from 'bluebird';
let request = require('request');
import cheerio from 'cheerio';

// if (process.env.NODE_ENV === 'development') {
//     request.debug = true;
// }

request = request.defaults({
    timeout: 10000
});

// TODO : Manage manga status

export default class Parser {
    /**
     * @param {object} catalog
     * @param {boolean} fetchNextPage
     * @return {Promise}
     */
    static getPopularMangaList (catalog, fetchNextPage = false) {
        let url = catalog.popularMangaUrl();
        if (fetchNextPage && catalog.popularPaginator.hasNext) {
            url = catalog.popularPaginator.nextUrl;
        } else if (fetchNextPage) {
            // TODO : Manage the case when we reach the end of the list
        }

        return new Promise(function (resolve, reject) {
            request(url, function (error, response, page) {
                if (error) {
                    return reject(error);
                }
                let $ = cheerio.load(page);

                let mangas = catalog.popularMangaList($);

                catalog.popularMangaPaginator($);

                return resolve({
                    mangas,
                    ...catalog.popularPaginator
                });
            });
        });
    }

    /**
     * @param {object} catalog
     * @param {Manga} manga
     * @return {Promise}
     */
    static getMangaDetail (catalog, manga) {
        return new Promise(function (resolve, reject) {
            request(manga.url, function (error, response, page) {
                if (error) {
                    return reject(error);
                }

                let $ = cheerio.load(page);
                manga = catalog.mangaDetail($, manga);

                if (!_.isNil(manga.thumbnailUrl) &&
                    !(navigator.userAgent.includes('Node.js') || navigator.userAgent.includes('jsdom'))) {
                    // The check before prevents running canvas inside JSDOM provoking segfaults
                    let img = new Image();

                    img.onload = function () {
                        let canvas = document.createElement('canvas');
                        canvas.width = this.width;
                        canvas.height = this.height;

                        canvas.getContext('2d').drawImage(this, 0, 0);

                        manga.thumbnailUrl = canvas.toDataURL('image/png');

                        resolve(manga);
                    };

                    img.src = manga.thumbnailUrl;
                } else {
                    resolve(manga);
                }
            });
        });
    }

    /**
     * @param {object} catalog
     * @param {Manga} manga
     * @return {Promise}
     */
    static getChapterList (catalog, manga) {
        return new Promise(function (resolve, reject) {
            request(manga.url, function (error, response, page) {
                if (error) {
                    return reject(error);
                }

                let $ = cheerio.load(page);
                let chapters = catalog.chapterList($, manga);

                chapters = _.orderBy(chapters, ['number', 'publishedAt'], ['asc', 'asc']);

                resolve(chapters);
            });
        });
    }

    /**
     * @param {object} catalog
     * @param {Chapter} chapter
     * @return {Promise}
     */
    static getPageList (catalog, chapter) {
        return new Promise((resolve, reject) => {
            request(chapter.url, (error, response, page) => {
                if (error) {
                    return reject(error);
                }

                let $ = cheerio.load(page);
                let pages = catalog.pageList($);

                resolve(pages);
            });
        });
    }

    /**
     * @param {object} catalog
     * @param {string} pageURL
     * @return {Promise}
     */
    static getImageURL (catalog, pageURL) {
        return new Promise((resolve, reject) => {
            request(pageURL, (error, response, page) => {
                if (error) {
                    return reject(error);
                }

                let $ = cheerio.load(page);
                let imageURL = catalog.imageUrl($);

                resolve(imageURL);
            });
        });
    }

    /**
     * @param {catalog} catalog
     * @param {string} query
     */
    static searchManga (catalog, query) {
        let options = catalog.searchOptions(query);

        return new Promise(function (resolve, reject) {
            request(options, function (error, response, page) {
                if (error) {
                    return reject(error);
                }

                let $ = cheerio.load(page);
                let mangas = catalog.search($);

                return resolve({
                    mangas,
                    hasNext: false,
                    nextUrl: null
                });
            });
        });
    }
}
