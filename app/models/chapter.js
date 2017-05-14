import { Model, Attributes } from 'electron-rxdb';

export default class Chapter extends Model {
    static attributes = Object.assign(Model.attributes, {
        id: Attributes.String({
            modelKey: 'id',
            jsonKey: 'id',
            queryable: true
        }),
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
}
