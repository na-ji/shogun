var yaml = require('js-yaml');
var _ = require('lodash');
var Promise = require('promise');
var crypto = require('crypto');
var chapterRecognition = require('./chapter-recognition');


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
                var manga = {};
                var self = this;
                _.forEach(catalog.popular.manga.fields, function (options, field) {
                    let selector = jQuery(self).find(options.selector);
                    manga[field] = selector[options.method].apply(selector, options.arguments);
                });
                manga._id = crypto.createHash('md5').update(manga.url).digest("hex");
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
                    manga_id: manga._id,
                    read: false

                };
                var self = this;

                _.forEach(catalog.chapter_list.fields, function (options, field) {
                    let selector = jQuery(self).find(options.selector);
                    chapter[field] = selector[options.method].apply(selector, options.arguments).trim();
                });

                chapter._id = crypto.createHash('md5').update(chapter.url).digest("hex");

                chapterRecognition.parseChapterNumber(chapter, manga);

                chapters.push(chapter);
            });

            fulfill(chapters);
        });
    });
};

module.exports = Parser;
