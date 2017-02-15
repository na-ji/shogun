var _ = require('lodash');
var Promise = require('promise');
var crypto = require('crypto');
var chapterRecognition = require('./chapter-recognition');
var moment = require('moment');
var jQuery = require('../bower_components/jquery/dist/jquery.min.js');
var request = require('request');

// if (process.env.NODE_ENV === 'development') {
//     request.debug = true;
// }

request = request.defaults({
    timeout: 10000
});

function trimSpaces (str) {
    return str.trim().replace(/ +(?= )/g, '');
}

// TODO : Manage manga status

var Parser = {};

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
            jQuery(catalog.popular.manga.element_selector, page).each(function () {
                // console.log($(this).html());
                var manga = {
                    in_library: false
                };
                var self = this;
                _.forEach(catalog.popular.manga.fields, function (options, field) {
                    let selector = jQuery(self).find(options.selector);
                    manga[field] = selector[options.method].apply(selector, options.arguments);
                });
                manga.id = crypto.createHash('md5').update(manga.url).digest('hex');
                manga.catalog = catalog.file;
                manga.chapters = [];
                mangas.push(manga);
            });

            return resolve({
                'mangas': mangas,
                'has_next': Boolean(jQuery(catalog.popular.next_url_selector, page).length),
                'next_url': jQuery(catalog.popular.next_url_selector, page).attr('href')
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
            var container = jQuery(catalog.manga_detail.selector, page);

            _.forEach(catalog.manga_detail.fields, function (options, field) {
                let selector = jQuery(container).find(options.selector);
                manga[field] = trimSpaces(selector[options.method].apply(selector, options.arguments));
            });

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

            jQuery(catalog.chapter_list.selector, page).each(function () {
                var chapter = {
                    manga: manga.id,
                    read: false

                };
                var self = this;

                _.forEach(catalog.chapter_list.fields, function (options, field) {
                    let selector = jQuery(self).find(options.selector);
                    chapter[field] = selector[options.method].apply(selector, options.arguments).trim();
                    if (options.parser) {
                        chapter[field] = Parser[options.parser](chapter[field]);
                    }
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

            jQuery(catalog.page_list.selector, page).each(function () {
                let selector = jQuery(this);
                let page = selector[catalog.page_list.method].apply(selector, catalog.page_list.arguments);
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
            let selector = jQuery(catalog.image_url.selector, page);
            let imageURL = selector[catalog.image_url.method].apply(selector, catalog.image_url.arguments);

            resolve(imageURL);
        });
    });
};

/**
 * Parse string '8 months ago' to Date object
 * @param date string in the format of '8 months ago'
 * @return Date object corresponding
 */
Parser.parseDateAgo = function (date) {
    let dateWords = date.toLowerCase().split(' ');

    if (dateWords.length === 3) {
        if (dateWords[1].substr(dateWords[1].length - 1) !== 's') {
            dateWords[1] = dateWords[1] + 's';
        }

        let date = moment().subtract(parseInt(dateWords[0]), dateWords[1]);
        date.millisecond(0).second(0).minute(0).hour(0);

        return date.toDate();
    }

    return new Date(1970, 0, 1);
};

module.exports = Parser;
