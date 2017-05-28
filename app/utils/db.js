import { RxDatabase } from 'electron-rxdb';
import { remote } from 'electron';
import path from 'path';

import Chapter from '../models/chapter';
import Manga from '../models/manga';

const Database = new RxDatabase({
    primary: true,
    databasePath: path.join(remote.getGlobal('dataDirectory'), 'sqlite.db'),
    databaseVersion: '1',
    logQueries: true,
    logQueryPlans: true
});

Database.on('will-rebuild-database', ({error}) => {
    console.log('A critical database error has occurred.', error.stack);
});

Database.models.registerDeferred({name: 'Manga', resolver: () => Manga});
Database.models.registerDeferred({name: 'Chapter', resolver: () => Chapter});

let countItemsInDb = function (table, name) {
    Database._query(`SELECT COUNT(*) AS count FROM ${table};`).then(response => {
        let count = 0;
        if (response.length) {
            count = response[0].count;
        }
        console.log('%s %s in DB', count, name);
    });
};

countItemsInDb('Manga', 'mangas');
countItemsInDb('Chapter', 'chapters');

export default Database;
