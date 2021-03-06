import _ from 'lodash';

import MangaManager from '../utils/manga-manager';
import { TOGGLE_MANGA_TO_LIBRARY } from './library';

export const LOAD_MANGA = 'LOAD_MANGA';
export const REFRESH_CHAPTERS = 'REFRESH_CHAPTERS';
export const RECEIVE_CHAPTERS = 'RECEIVE_CHAPTERS';
// export const REQUEST_DETAILS = 'REQUEST_DETAILS';
export const RECEIVE_DETAILS = 'RECEIVE_DETAILS';
export const MANGA_TOGGLE_LIBRARY = 'MANGA_TOGGLE_LIBRARY';
export const MARK_CHAPTERS_READ = 'MARK_CHAPTERS_READ';

function loadManga (manga) {
    return {
        type: LOAD_MANGA,
        manga
    };
}

function receiveChapters (chapters) {
    return {
        type: RECEIVE_CHAPTERS,
        chapters
    };
}

function receiveDetails (manga) {
    return {
        type: RECEIVE_DETAILS,
        manga
    };
}

export function markChaptersRead (manga, chapters, read = true) {
    return (dispatch) => {
        _.forEach(chapters, (chapter) => {
            chapter.read = read;
        });

        MangaManager.persistChapters(chapters);
        MangaManager.persistManga(manga);

        dispatch({
            type: MARK_CHAPTERS_READ
        });
    };
}

export function toggleLibrary () {
    return (dispatch, getState) => {
        dispatch({
            type: MANGA_TOGGLE_LIBRARY
        });

        const { manga } = getState().manga;
        MangaManager.persistManga(manga);

        dispatch({
            type: TOGGLE_MANGA_TO_LIBRARY,
            manga
        });
    };
}

function fetchInfos (manga) {
    return (dispatch) => {
        dispatch(loadManga(manga));

        if (_.isNil(manga.chapters) || !manga.chapters.length) {
            MangaManager.getChapterList(manga).then(function (chapters) {
                dispatch(receiveChapters(chapters));
            });
        }

        if (!manga.detailsFetched) {
            MangaManager.getMangaDetail(manga).then(function (manga) {
                dispatch(receiveDetails(manga));
            });
        }
    };
}

export function fetchInfosIfNeeded (manga) {
    return (dispatch, getState) => {
        const oldManga = getState().manga.manga;

        if (oldManga.id !== manga.id) {
            dispatch(fetchInfos(manga));
        }
    };
}

export function updateChapters () {
    return (dispatch, getState) => {
        dispatch({
            type: REFRESH_CHAPTERS
        });

        const manga = getState().manga.manga;
        MangaManager.getChapterList(manga).then(function (chapters) {
            dispatch(receiveChapters(chapters));
        });
    };
}
