// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var db = new PouchDB('http://localhost:5984/open-manga');
// db.info().then(function (info) {
//     console.log(info);
// });

// var catalogManager = require('./core/catalog-manager');
// var parser = require('./core/parser');

// catalogManager.getCatalogList().forEach(function(catalog) {
//     parser.getPopularMangaList(catalog).done(function(mangas) {
//         console.log(mangas);
//     });
// });
