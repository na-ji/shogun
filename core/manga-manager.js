var Promise = require('promise');
var CatalogManager = require('./catalog-manager');
var Parser = require('./parser');


var MangaManager = {};

MangaManager.getPopularManga = function (catalogName) {
    var catalog = CatalogManager.getCatalog(catalogName);

    return new Promise(function (fulfill, reject) {
        Parser.getPopularMangaList(catalog).then(function (mangas) {
            var promises = [];

            _.forEach(mangas.mangas, function(manga) {
                promises.push(new Promise(function (resolve, reject) {
                    db.rel.find('manga', manga.id).then(function (doc) {
                        if (doc.mangas.length) {
                            resolve(doc.mangas[0]);
                        } else {
                            Parser.getMangaDetail(catalog, manga).then(function (manga) {
                                db.rel.save('manga', manga);
                                resolve(manga);
                            });
                        }
                    });
                }));
            });

            fulfill({
                mangas: mangas.mangas,
                promises: promises
            });
        });
    });
};

MangaManager.getMangaById = function (mangaId) {
    return new Promise(function (fulfill, reject) {
        db.rel.find('manga', mangaId).then(function (doc) {
            if (doc.mangas.length) {
                fulfill({
                    manga: doc.mangas[0],
                    chapters: (doc.chapters ? doc.chapters : [])
                });
            } else {
                reject({error: 'No manga found'});
            }
        });
    });
};

MangaManager.getChapterList = function(manga) {
    var catalog = CatalogManager.getCatalog(manga.catalog);

    return new Promise(function (fulfill, reject) {
        Parser.getChapterList(catalog, manga).then(function(chapters) {
            if (manga.in_library) {
                // save chapter to DB

                _.forEach(chapters, function(chapter) {
                    db.rel.find('chapter', chapter.id).then(function (doc) {
                        if (!doc.chapters.length) {
                            db.rel.save('chapter', chapter);
                        }
                    });
                });
            }

            fulfill(chapters);
        });
    });
};

module.exports = MangaManager;
