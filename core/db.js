var DB = new PouchDB('http://localhost:5984/open-manga');

DB.setSchema([
    {singular: 'manga', plural: 'mangas', relations: { chapters: {hasMany: 'chapter'}}},
    {singular: 'chapter', plural: 'chapters', relations: {manga: {belongsTo: 'manga'}}}
]);

// DB.info().then(function (info) {
//     console.log(info);
// });

module.exports = DB;
