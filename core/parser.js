var yaml = require('js-yaml');
var _ = require('lodash');
var Promise = require('promise');


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

module.exports = Parser;
