import Promise from 'bluebird';
import EventEmitter from 'events';

const MangaManager = jest.genMockFromModule('../manga-manager');

MangaManager.getPopularManga = jest.fn(() => {
    return Promise.resolve({
        mangas: [],
        hasNext: true,
        mangasEvents: new EventEmitter()
    });
});

MangaManager.searchManga = jest.fn(() => {
    return Promise.reject(new Error(''));
});

module.exports = MangaManager;
