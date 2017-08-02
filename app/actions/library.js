import Promise from 'bluebird';
import { ipcRenderer } from 'electron';

import MangaManager from '../utils/manga-manager';

export const REQUEST_LIBRARY = 'REQUEST_LIBRARY';
export const RECEIVE_LIBRARY = 'RECEIVE_LIBRARY';
export const REFRESH_LIBRARY = 'REFRESH_LIBRARY';
export const REFRESH_PROGRESS = 'REFRESH_PROGRESS';
export const TOGGLE_MANGA_TO_LIBRARY = 'TOGGLE_MANGA_TO_LIBRARY';

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

export function refreshLibrary () {
    return (dispatch, getState) => {
        const state = getState().library;

        if (state.loaded && state.mangas.length > 0) {
            dispatch({
                type: REFRESH_LIBRARY
            });

            Promise.mapSeries(state.mangas, (manga) => {
                const promise = MangaManager.getChapterList(manga);

                promise.then(() => {
                    const state = getState().library;

                    ipcRenderer.send('progress-bar', state.progressPercent / 100);

                    dispatch({
                        type: REFRESH_PROGRESS
                    });
                });

                return promise;
            }).then(values => {
                new Notification('Library refreshed', {// eslint-disable-line
                    body: 'X new chapters found'
                });

                ipcRenderer.send('progress-bar', -1);
            });
        }
    };
}
