import { Model, Attributes } from 'electron-rxdb';
import crypto from 'crypto';
import _ from 'lodash';

import Chapter from './chapter';

export default class Manga extends Model {
    static attributes = {
        id: Attributes.String({
            modelKey: 'id',
            queryable: true
        }),
        title: Attributes.String({
            modelKey: 'title',
            queryable: true
        }),
        catalog: Attributes.String({
            modelKey: 'catalog',
            queryable: true
        }),
        inLibrary: Attributes.Boolean({
            modelKey: 'inLibrary',
            queryable: true
        }),
        detailsFetched: Attributes.Boolean({
            modelKey: 'detailsFetched'
        }),
        url: Attributes.String({
            modelKey: 'url'
        }),
        chapters: Attributes.Collection({
            modelKey: 'chapters',
            itemClass: Chapter,
            queryable: true,
            joinOnField: 'id'
        }),
        thumbnailUrl: Attributes.String({
            modelKey: 'thumbnailUrl'
        }),
        author: Attributes.String({
            modelKey: 'author'
        }),
        artist: Attributes.String({
            modelKey: 'artist'
        }),
        genre: Attributes.String({
            modelKey: 'genre'
        }),
        description: Attributes.String({
            modelKey: 'description'
        }),
        status: Attributes.String({
            modelKey: 'status'
        }),
        updatedAt: Attributes.DateTime({
            modelKey: 'updatedAt'
        })
    };

    static searchIndexes = {};

    constructor (values = {}) {
        super(values);
        this.updatedAt = new Date();
        this.inLibrary = _.isNil(this.inLibrary) ? false : this.inLibrary;
        this.detailsFetched = _.isNil(this.detailsFetched) ? false : this.detailsFetched;
        this.generateId();
        // this.generateId = this.generateId.bind(this);
    }

    generateId () {
        this.id = this.url ? crypto.createHash('md5').update(this.url).digest('hex') : this.id;
    }
}
