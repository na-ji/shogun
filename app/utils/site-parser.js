import _ from 'lodash';
import Promise from 'promise';
import crypto from 'crypto';
var request = require('request');
import cheerio from 'cheerio';

import { trimSpaces } from './data-parsers';
import chapterRecognition from './chapter-recognition';

// if (process.env.NODE_ENV === 'development') {
//     request.debug = true;
// }

request = request.defaults({
    timeout: 10000
});

// TODO : Manage manga status

var Parser = {};

function getSelector ($, selector) {
    if (_.isString(selector)) {
        return $(selector);
    } else if (_.isFunction(selector)) {
        return selector($);
    }

    throw Error('bad selector : ' + selector);
}

Parser.getPopularMangaList = function (catalog, url) {
    if (undefined === url) {
        url = catalog.base_url + catalog.popular.url;
    }

    return new Promise(function (resolve, reject) {
        request(url, function (error, response, page) {
            if (error) {
                return reject(error);
            }
            let mangas = [];
            let $ = cheerio.load(page);
            getSelector($, catalog.popular.manga.element_selector).each(function () {
                let manga = {
                    in_library: false
                };

                let self = this;
                _.forEach(catalog.popular.manga.fields, function (selector, field) {
                    manga[field] = trimSpaces(selector($(self)));
                });

                manga.id = crypto.createHash('md5').update(manga.url).digest('hex');
                manga.catalog = catalog.file;
                manga.detail_fetched = false;
                manga.chapters = [];
                mangas.push(manga);
            });

            return resolve({
                'mangas': mangas,
                'has_next': Boolean($(catalog.popular.next_url_selector).length),
                'next_url': $(catalog.popular.next_url_selector).attr('href')
            });
        });
    });
};

Parser.getMangaDetail = function (catalog, manga) {
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
            manga.detail_fetched = true;

            resolve(manga);
        });
    });
};

Parser.getChapterList = function (catalog, manga) {
    return new Promise(function (resolve, reject) {
        request(manga.url, function (error, response, page) {
            if (error) {
                return reject(error);
            }
            let chapters = [];
            let $ = cheerio.load(page);

            getSelector($, catalog.chapter_list.element_selector).each(function () {
                var chapter = {
                    manga: manga.id,
                    read: false
                };
                var self = this;

                _.forEach(catalog.chapter_list.fields, function (selector, field) {
                    chapter[field] = trimSpaces(selector($(self)));
                });

                chapter.id = crypto.createHash('md5').update(chapter.url).digest('hex');

                chapterRecognition.parseChapterNumber(chapter, manga);

                chapters.push(chapter);
            });

            resolve(chapters);
        });
    });
};

Parser.getPageList = function (catalog, chapter) {
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
};

Parser.getImageURL = function (catalog, pageURL) {
    return new Promise((resolve, reject) => {
        request(pageURL, (error, response, page) => {
            if (error) {
                return reject(error);
            }

            let imageURL = catalog.image_url.value(cheerio.load(page));

            resolve(imageURL);
        });
    });
};

module.exports = Parser;
