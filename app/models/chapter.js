import { Model, Attributes } from 'electron-rxdb';
import crypto from 'crypto';

export default class Chapter extends Model {
    static attributes = Object.assign(Model.attributes, {
        name: Attributes.String({
            modelKey: 'name',
            jsonKey: 'name',
            queryable: true
        }),
        url: Attributes.String({
            modelKey: 'url',
            jsonKey: 'url'
        }),
        publishedAt: Attributes.DateTime({
            modelKey: 'publishedAt',
            jsonKey: 'publishedAt',
            queryable: true
        }),
        updatedAt: Attributes.DateTime({
            modelKey: 'updatedAt',
            jsonKey: 'updatedAt',
            queryable: true
        })
    });

    static searchIndexes = {};

    constructor (values = {}) {
        super(values);
        this.id = this.url ? crypto.createHash('md5').update(this.url).digest('hex') : this.id;
        this.updatedAt = new Date();
    }
}
