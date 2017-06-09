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

MangaManager.getChapterList = jest.fn(() => {
    return Promise.resolve([]);
});

MangaManager.getChapterPages = jest.fn(() => {
    return Promise.resolve(new Array(5));
});

MangaManager.getImageURL = jest.fn(() => {
    return Promise.resolve('https://swag.army/');
});

MangaManager.getMangaDetail = jest.fn(() => {
    return Promise.resolve({});
});

MangaManager.searchManga = jest.fn(() => {
    return Promise.reject(new Error(''));
});

MangaManager.getLibrary = jest.fn(() => {
    return {
        observe: jest.fn(() => {
            return {
                subscribe: jest.fn((fn) => {
                    fn([]);
                })
            };
        })
    };
});

module.exports = MangaManager;
