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

Database.count(Manga).then((count) => {
    console.log('%d mangas in DB', count);
});

Database.count(Chapter).then((count) => {
    console.log('%d chapters in DB', count);
});

export default Database;
