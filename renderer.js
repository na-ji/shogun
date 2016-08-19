// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var db = new PouchDB('http://localhost:5984/open-manga');
// db.info().then(function (info) {
//     console.log(info);
// });

var catalogManager = require('./core/catalog-manager');
var parser = require('./core/parser');

// catalogManager.getCatalogList().forEach(function(catalog) {
//     parser.getPopularMangaList(catalog).done(function(mangas) {
//         parser.getMangaDetail(catalog, mangas.mangas[0]).done(function(manga) {
//             console.log(manga);
//         });
//         parser.getChapterList(catalog, mangas.mangas[0]).done(function(chapters) {
//             console.log(chapters);
//         });
//     });
// });

// TODO : Transfer to test class
var chapterRecognition = require('./core/chapter-recognition');
// console.log(chapterRecognition.parseChapterNumber({name: "Mokushiroku Alice Vol.1 Ch.4: Misrepresentation"}, {}));
// console.log(chapterRecognition.parseChapterNumber({name: "Mokushiroku Alice Vol.1 Ch.4.1: Misrepresentation"}, {}));
// console.log(chapterRecognition.parseChapterNumber({name: "Mokushiroku Alice Vol.1 Ch.4.4: Misrepresentation"}, {}));
// console.log(chapterRecognition.parseChapterNumber({name: "Mokushiroku Alice Vol.1 Ch.4.a: Misrepresentation"}, {}));
// console.log(chapterRecognition.parseChapterNumber({name: "Mokushiroku Alice Vol.1 Ch.4.b: Misrepresentation"}, {}));
// console.log(chapterRecognition.parseChapterNumber({name: "Mokushiroku Alice Vol.1 Ch.4.extra: Misrepresentation"}, {}));
// console.log(chapterRecognition.parseChapterNumber({name: "Bleach 567: Down With Snowwhite"}, {}));
// console.log(chapterRecognition.parseChapterNumber({name: "Bleach 567.1: Down With Snowwhite"}, {}));
// console.log(chapterRecognition.parseChapterNumber({name: "Bleach 567.4: Down With Snowwhite"}, {}));
// console.log(chapterRecognition.parseChapterNumber({name: "Bleach 567.a: Down With Snowwhite"}, {}));
// console.log(chapterRecognition.parseChapterNumber({name: "Bleach 567.b: Down With Snowwhite"}, {}));
// console.log(chapterRecognition.parseChapterNumber({name: "Bleach 567.extra: Down With Snowwhite"}, {}));
// console.log(chapterRecognition.parseChapterNumber({name: "Solanin 028 Vol. 2"}, {title: "Solanin"}));
// console.log(chapterRecognition.parseChapterNumber({name: "Solanin 028.1 Vol. 2"}, {title: "Solanin"}));
// console.log(chapterRecognition.parseChapterNumber({name: "Solanin 028.b Vol. 2"}, {title: "Solanin"}));
// console.log(chapterRecognition.parseChapterNumber({name: "Onepunch-Man Punch Ver002 028"}, {title: "Onepunch-Man"}));
