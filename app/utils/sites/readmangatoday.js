import { parseDateAgo, trimSpaces } from '../data-parsers';

let ReadMangaToday = {
    name: 'ReadMangaToday',
    base_url: 'http://www.readmanga.today',
    lang: 'en',

    popular: {
        url: '/hot-manga/',
        manga: {
            element_selector: 'div.hot-manga > div.style-list > div.box',
            fields: {
                url: ($container) => {
                    return $container.find('div.title > h2 > a').attr('href');
                },
                title: ($container) => {
                    return $container.find('div.title > h2 > a').attr('title');
                },
                thumbnail_url: ($container) => {
                    return $container.find('img').attr('src');
                }
            }
        },
        next_url_selector: 'div.hot-manga > ul.pagination > li > a:contains(»)'
    },

    manga_detail: {
        container_selector: ($) => {
            return $('div.content-list').first();
        },
        fields: {
            author: ($container) => {
                return $container.find('ul.cast-list li.director > ul a').text();
            },
            artist: ($container) => {
                return $container.find('ul.cast-list li:not(.director) > ul a').text();
            },
            genre: ($container) => {
                return $container.find('dl.dl-horizontal > dd').eq(2).text();
            },
            description: ($container) => {
                return $container.find('li.movie-detail').text();
            },
            status: ($container) => {
                return $container.find('dl.dl-horizontal > dd').eq(1).text();
            },
            thumbnail_url: ($container) => {
                return $container.find('img.img-responsive').attr('src');
            }
        }
    },

    chapter_list: {
        element_selector: 'ul.chp_lst > li',
        fields: {
            url: ($container) => {
                return $container.find('a').first().attr('href');
            },
            name: ($container) => {
                return $container.find('a').first().find('span.val').text();
            },
            date: ($container) => {
                return parseDateAgo(trimSpaces($container.find('span.dte').first().text()));
            }
        }
    },

    page_list: {
        element_selector: ($) => {
            return $('ul.list-switcher-2 > li > select.jump-menu').first().find('option');
        },
        element_parser: ($item) => {
            return $item.attr('value');
        }
    },

    image_url: {
        value: ($) => {
            return $('img.img-responsive-2').first().attr('src');
        }
    }
};

module.exports = ReadMangaToday;
