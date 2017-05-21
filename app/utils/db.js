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

Database._query('SELECT stat FROM sqlite_stat1 WHERE idx = "Manga_id";').then(response => {
    console.log('%s mangas in DB', response[0].stat.split(' ')[0]);
});

Database._query('SELECT stat FROM sqlite_stat1 WHERE idx = "MangaChapter_id";').then(response => {
    console.log('%s chapters in DB', response[0].stat.split(' ')[0]);
});

export default Database;
