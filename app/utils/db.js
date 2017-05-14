import { RxDatabase } from 'electron-rxdb';
import { remote } from 'electron';
import path from 'path';

import Chapter from '../models/chapter';
// import Manga from '../models/manga';

var PouchDB = require('pouchdb-browser');
PouchDB.plugin(require('relational-pouch'));

// var DB = new PouchDB('http://localhost:5984/shogun');
var DB = new PouchDB('shogun');

DB.setSchema([
    {singular: 'manga', plural: 'mangas', relations: {chapters: {hasMany: 'chapter'}}},
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
            map: function (doc) {
                /* global emit */
                emit(doc.data.in_library);
            }.toString()
        }
    }
};

DB.put(ddoc).then(function () {
    // success!
}).catch(function (err) {
    // some error (maybe a 409, because it already exists?)
    if (err.status !== 409) {
        console.error(err);
    }
});

const Database = new RxDatabase({
    primary: true,
    databasePath: path.join(remote.getGlobal('dataDirectory'), 'sqlite.db'),
    databaseVersion: '1',
    logQueries: false,
    logQueryPlans: false
});

Database.on('will-rebuild-database', ({error}) => {
    console.log('A critical database error has occurred.', error.stack);
});

window.Database = Database;
window.Chapter = Chapter;

// Database.models.register(Chapter);
// Database.models.register(Manga);

module.exports = DB;
