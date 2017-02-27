var PouchDB = require('pouchdb-browser');
PouchDB.plugin(require('relational-pouch'));

//var DB = new PouchDB('http://localhost:5984/open-manga');
var DB = new PouchDB('open-manga');

DB.setSchema([
    {singular: 'manga', plural: 'mangas', relations: { chapters: {hasMany: 'chapter'}}},
    {singular: 'chapter', plural: 'chapters', relations: {manga: {belongsTo: 'manga'}}}
]);

// DB.info().then(function (info) {
//     console.log(info);
// });

// manga.in_library index
var ddoc = {
    _id: '_design/manga_index',
    views: {
        by_in_library: {
            map: function (doc) { emit(doc.data.in_library); }.toString()
        }
    }
};

DB.put(ddoc).then(function () {
    // success!
}).catch(function (err) {
    // some error (maybe a 409, because it already exists?)
});

// Initial query to build index and have faster queries after
// DB.query('manga_index/by_in_library', {
//     limit: 0 // don't return any results
// }).then(function (res) {
// }).catch(function (err) {
// });

module.exports = DB;
