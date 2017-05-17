import { Model, Attributes } from 'electron-rxdb';
import crypto from 'crypto';
import _ from 'lodash';

export default class Chapter extends Model {
    static attributes = Object.assign(Model.attributes, {
        name: Attributes.String({
            modelKey: 'name',
            queryable: true
        }),
        url: Attributes.String({
            modelKey: 'url'
        }),
        number: Attributes.Number({
            modelKey: 'number'
        }),
        publishedAt: Attributes.DateTime({
            modelKey: 'publishedAt'
        }),
        updatedAt: Attributes.DateTime({
            modelKey: 'updatedAt'
        }),
        read: Attributes.Boolean({
            modelKey: 'read'
        })
    });

    static searchIndexes = {};

    constructor (values = {}) {
        super(values);
        this.generateId();
        this.updatedAt = new Date();
        this.read = _.isNil(this.read) ? false : this.detailsFetched;
    }

    generateId () {
        this.id = this.url ? crypto.createHash('md5').update(this.url).digest('hex') : this.id;
    }
}
