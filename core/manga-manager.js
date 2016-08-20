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
                fulfill(doc.mangas[0]);
            } else {
                reject({error: 'No manga found'});
            }
        });
    });
};

module.exports = MangaManager;
