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
                    db.get(manga._id).then(function (doc) {
                        resolve(doc);
                    }).catch(function (err) {
                        Parser.getMangaDetail(catalog, manga).then(function (manga) {
                            db.put(manga);
                            resolve(manga);
                        });
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

module.exports = MangaManager;
