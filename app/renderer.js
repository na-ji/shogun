// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var db = require('./core/db');

// var catalogManager = require('./core/catalog-manager');
// var parser = require('./core/parser');
//
// catalogManager.getCatalogList().forEach(function(catalog) {
//     parser.getPopularMangaList(catalog).done(function(mangas) {
//         // parser.getMangaDetail(catalog, mangas.mangas[0]).done(function(manga) {
//         //     console.log(manga);
//         // });
//         parser.getChapterList(catalog, mangas.mangas[0]).done(function(chapters) {
//             // console.log(chapters);
//             parser.getPageList(catalog, chapters[0]).done(function(pages) {
//                 console.log(chapters[0]);
//                 console.log(pages);
//                 parser.getImageURL(catalog, pages[0]).done(function(imageURL) {
//                     console.log(imageURL);
//                 });
//             });
//         });
//     });
// });

// var mangaManager = require('./core/manga-manager');
// mangaManager.getLibrary().then(function (mangas) {
//     console.log(mangas);
// });
