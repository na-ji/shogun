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
        let before = (new Date()).getTime();
        db.rel.find('manga', mangaId).then(function (doc) {
            console.log('getMangaById took %d ms', (new Date()).getTime() - before);
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

MangaManager.toggleInLibrary = function(manga) {
    manga.in_library = !manga.in_library;
    db.rel.save('manga', manga);
};

MangaManager.getChapterList = function(manga) {
    var catalog = CatalogManager.getCatalog(manga.catalog);

    return new Promise(function (fulfill, reject) {
        Parser.getChapterList(catalog, manga).then(function(chapters) {
            if (manga.in_library) {
                // save chapter to DB
                var chapterIds = [];
                let done = _.after(chapters.length, function() {
                    manga.chapters = _.union(manga.chapters, chapterIds);
                    db.rel.save('manga', manga).catch(function(err) {
                        console.log(err);
                    });
                });

                _.forEach(chapters, function(chapter) {
                    db.rel.find('chapter', chapter.id).then(function (doc) {
                        if (!doc.chapters.length) {
                            db.rel.save('chapter', chapter).catch(function(err) {
                                console.log(err);
                            });
                        }
                        chapterIds.push(chapter.id);
                        done();
                    });
                });
            }

            fulfill(chapters);
        });
    });
};

MangaManager.getLibrary = function() {
    return new Promise(function (fulfill, reject) {
        let before = (new Date()).getTime();
        db.query('manga_index/by_in_library', {
            key: true,
            include_docs : true
        }).then(function (response) {
            console.log('getLibrary took %d ms', (new Date()).getTime() - before);
            let mangas = [];

            _.forEach(response.rows, function(row) {
                let manga = row.doc.data;
                manga.id = row.id.replace('manga', '').replace(/^_\d+_/, '');
                mangas.push(manga);
            });

            fulfill(mangas);
        });
    });
};

module.exports = MangaManager;
