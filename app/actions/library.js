export const REQUEST_LIBRARY = 'REQUEST_LIBRARY';
export const RECEIVE_LIBRARY = 'RECEIVE_LIBRARY';
export const TOGGLE_MANGA_TO_LIBRARY = 'TOGGLE_MANGA_TO_LIBRARY';

let mangaManager = require('../utils/manga-manager');

function requestLibrary () {
    return {
        type: REQUEST_LIBRARY
    };
}

function receiveLibrary (mangas) {
    return {
        type: RECEIVE_LIBRARY,
        mangas
    };
}

export function toggleMangaToLibrary (manga) {
    return (dispatch) => {
        dispatch({
            type: TOGGLE_MANGA_TO_LIBRARY,
            manga
        });

        mangaManager.toggleInLibrary(manga);
    };
}

export function fetchLibrary () {
    return (dispatch, getState) => {
        const state = getState().library;

        if (!state.loaded) {
            dispatch(requestLibrary());
            mangaManager.getLibrary().then(function (mangas) {
                dispatch(receiveLibrary(mangas));
            });
        }
    };
}
