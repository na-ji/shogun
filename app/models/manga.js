import { Model, Attributes } from 'electron-rxdb';

import Chapter from './chapter';

export default class Manga extends Model {
    static attributes = Object.assign(Model.attributes, {
        id: Attributes.String({
            modelKey: 'id',
            queryable: true
        }),
        title: Attributes.String({
            modelKey: 'title',
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
            modelKey: 'updatedAt',
            queryable: true
        })
    });
}
