var yaml = require('js-yaml');
var _ = require('lodash');
var Promise = require('promise');
var crypto = require('crypto');
var chapterRecognition = require('./chapter-recognition');
var moment = require('moment');


function trimSpaces(str) {
    return str.trim().replace(/ +(?= )/g,'');
}


// TODO : Manage manga status

var Parser = {};

Parser.getPopularMangaList = function(catalog, url) {
    if (undefined === url) {
        url = catalog.base_url + catalog.popular.url;
    }

    return new Promise(function (fulfill, reject) {
        jQuery.get(url, function (page) {
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
                manga.id = crypto.createHash('md5').update(manga.url).digest("hex");
                manga.catalog = catalog.file;
                mangas.push(manga);
            });

            fulfill({
                'mangas': mangas,
                'has_next': Boolean(jQuery(catalog.popular.next_url_selector, page).length),
                'next_url': jQuery(catalog.popular.next_url_selector, page).attr('href')
            });
        });
    });
};

Parser.getMangaDetail = function(catalog, manga) {
    return new Promise(function (fulfill, reject) {
        jQuery.get(manga.url, function (page) {
            var container = jQuery(catalog.manga_detail.selector, page);

            _.forEach(catalog.manga_detail.fields, function (options, field) {
                let selector = jQuery(container).find(options.selector);
                manga[field] = trimSpaces(selector[options.method].apply(selector, options.arguments));
            });

            fulfill(manga);
        });
    });
};

Parser.getChapterList = function(catalog, manga) {
    return new Promise(function (fulfill, reject) {
        jQuery.get(manga.url, function (page) {
            let chapters = [];

            jQuery(catalog.chapter_list.selector, page).each(function() {
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

                chapter.id = crypto.createHash('md5').update(chapter.url).digest("hex");

                chapterRecognition.parseChapterNumber(chapter, manga);

                chapters.push(chapter);
            });

            fulfill(chapters);
        });
    });
};

Parser.getPageList = function(catalog, chapter) {
    return new Promise((fulfill, reject) => {
        jQuery.get(chapter.url, (page) => {
            let pages = [];

            jQuery(catalog.page_list.selector, page).each(function() {
                let selector = jQuery(this);
                pages.push(selector[catalog.page_list.method].apply(selector, catalog.page_list.arguments));
            });
            // console.log(selector);
            // pages = selector[catalog.page_list.method].apply(selector, catalog.page_list.arguments);

            fulfill(pages);
        });
    });
};


/**
 * Parse string '8 months ago' to Date object
 * @param date string in the format of '8 months ago'
 * @return Date object corresponding
 */
Parser.parseDateAgo = function(date) {
    let dateWords = date.toLowerCase().split(' ');

    if (dateWords.length == 3) {
        if (dateWords[1].substr(dateWords[1].length - 1) != "s") {
            dateWords[1] = dateWords[1] + 's';
        }

        return moment().subtract(parseInt(dateWords[0]), dateWords[1]).toDate();
    }

    return new Date(1970, 0, 1);
};

module.exports = Parser;
