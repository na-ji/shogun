import _ from 'lodash';
import Promise from 'promise';
let request = require('request');
import cheerio from 'cheerio';

import { trimSpaces } from './data-parsers';
import chapterRecognition from './chapter-recognition';
import Chapter from '../models/chapter';
import Manga from '../models/manga';

// if (process.env.NODE_ENV === 'development') {
//     request.debug = true;
// }

request = request.defaults({
    timeout: 10000
});

// TODO : Manage manga status

function getSelector ($, selector) {
    if (_.isString(selector)) {
        return $(selector);
    } else if (_.isFunction(selector)) {
        return selector($);
    }

    throw Error('bad selector : ' + selector);
}

export default class Parser {
    /**
     * Next indexes to return by catalog
     * @type {object}
     */
    static indexes = {};

    /**
     * Paginator by catalog
     * @type {object}
     */
    static popularPaginator = {};

    /**
     * @param {object} catalog
     * @param {boolean} fetchNextPage
     * @return {Promise}
     */
    static getPopularMangaList (catalog, fetchNextPage = false) {
        let url = catalog.base_url + catalog.popular.url;
        if (fetchNextPage && catalog.file in Parser.popularPaginator) {
            url = Parser.popularPaginator[catalog.file].nextUrl;
        }

        return new Promise(function (resolve, reject) {
            request(url, function (error, response, page) {
                if (error) {
                    return reject(error);
                }
                let mangas = [];
                let $ = cheerio.load(page);
                getSelector($, catalog.popular.manga.element_selector).each(function () {
                    let manga = new Manga({
                        catalog: catalog.file
                    });

                    let self = this;
                    _.forEach(catalog.popular.manga.fields, function (selector, field) {
                        manga[field] = trimSpaces(selector($(self)));
                    });

                    manga.generateId();
                    manga.catalogId = Parser.getNextIndex(catalog);
                    mangas.push(manga);
                });

                Parser.popularPaginator[catalog.file] = {
                    hasNext: Boolean($(catalog.popular.next_url_selector).length),
                    nextUrl: $(catalog.popular.next_url_selector).attr('href')
                };

                return resolve({
                    mangas,
                    ...Parser.popularPaginator[catalog.file]
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
                let $container = getSelector($, catalog.manga_detail.container_selector);

                _.forEach(catalog.manga_detail.fields, function (selector, field) {
                    manga[field] = trimSpaces(selector($container));
                });
                manga.detailsFetched = true;

                resolve(manga);
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
                let chapters = [];
                let $ = cheerio.load(page);

                getSelector($, catalog.chapter_list.element_selector).each(function () {
                    let chapter = new Chapter();
                    let self = this;

                    _.forEach(catalog.chapter_list.fields, function (selector, field) {
                        chapter[field] = trimSpaces(selector($(self)));
                    });

                    chapter.generateId('hex');

                    chapterRecognition.parseChapterNumber(chapter, manga);

                    chapters.push(chapter);
                });

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
                let pages = [];
                let $ = cheerio.load(page);

                getSelector($, catalog.page_list.element_selector).each(function () {
                    let page = catalog.page_list.element_parser($(this));
                    pages.push(page);
                });

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

                let imageURL = catalog.image_url.value(cheerio.load(page));

                resolve(imageURL);
            });
        });
    }

    /**
     * @param {catalog} catalog
     * @param {string} query
     */
    static searchManga (catalog, query) {
        let options = {
            url: catalog.base_url + catalog.search.url(query),
            headers: 'headers' in catalog.search ? catalog.search.headers : {},
            method: 'method' in catalog.search ? catalog.search.method : 'POST',
            form: 'form' in catalog.search ? catalog.search.form(query) : {}
        };

        return new Promise(function (resolve, reject) {
            request(options, function (error, response, page) {
                if (error) {
                    return reject(error);
                }
                let mangas = [];
                let $ = cheerio.load(page);

                getSelector($, catalog.search.manga.element_selector).each(function () {
                    let manga = new Manga({
                        catalog: catalog.file
                    });

                    let self = this;
                    _.forEach(catalog.search.manga.fields, function (selector, field) {
                        manga[field] = trimSpaces(selector($(self)));
                    });

                    manga.generateId();
                    manga.catalogId = Infinity;
                    mangas.push(manga);
                });

                return resolve({
                    mangas,
                    hasNext: false,
                    nextUrl: null
                });
            });
        });
    }

    /**
     * @private
     * @param {object} catalog
     * @return {number}
     */
    static getNextIndex (catalog) {
        if (!(catalog.file in Parser.indexes)) {
            Parser.indexes[catalog.file] = 0;
        }

        return Parser.indexes[catalog.file]++;
    }
}
