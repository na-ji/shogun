export const REQUEST_LIBRARY = 'REQUEST_LIBRARY';
export const RECEIVE_LIBRARY = 'RECEIVE_LIBRARY';
export const TOGGLE_MANGA_TO_LIBRARY = 'TOGGLE_MANGA_TO_LIBRARY';

import MangaManager from '../utils/manga-manager';

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

        MangaManager.toggleInLibrary(manga);
    };
}

export function fetchLibrary () {
    return (dispatch, getState) => {
        const state = getState().library;

        if (!state.loaded) {
            dispatch(requestLibrary());
            MangaManager.getLibrary().observe().subscribe(mangas => {
                dispatch(receiveLibrary(mangas));
            });
        }
    };
}
