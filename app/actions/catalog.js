export const GET_POPULAR_MANGAS = 'GET_POPULAR_MANGAS';
export const LOAD_MORE = 'LOAD_MORE';
// export const SEARCH = 'SEARCH';
export const RECEIVE_MANGAS_LIST = 'RECEIVE_MANGAS_LIST';
export const RECEIVE_MANGA_DETAILS = 'RECEIVE_MANGA_DETAILS';
// export const CANCEL_REQUEST = 'CANCEL_REQUEST';
// export const REQUEST_CANCELED = 'REQUEST_CANCELED';

import mangaManager from '../utils/manga-manager';
import catalogManager from '../utils/catalog-manager';
import _ from 'lodash';

function receiveMangasList (response, override) {
    return {
        type: RECEIVE_MANGAS_LIST,
        response,
        override
    };
}

function receiveMangaDetails (manga) {
    return {
        type: RECEIVE_MANGA_DETAILS,
        manga
    };
}

function getPopularMangas (catalogName) {
    let catalog = catalogManager.getCatalog(catalogName);

    return {
        type: GET_POPULAR_MANGAS,
        catalogName,
        catalog
    };
}

function loadMore () {
    return {
        type: LOAD_MORE
    };
}

function fetchMangasList (promise, override) {
    return (dispatch) => {
        promise.then(function (response) {
            dispatch(receiveMangasList(response, override));

            _.forEach(response.promises, function (promise) {
                promise.then(function (manga) {
                    dispatch(receiveMangaDetails(manga));
                });
            });
        });
    };
}

export function fetchPopularMangas (catalogName) {
    return (dispatch, getState) => {
        const oldCatalogName = getState().catalog.catalogName;
        if (catalogName !== oldCatalogName) {
            dispatch(getPopularMangas(catalogName));
            dispatch(fetchMangasList(mangaManager.getPopularManga(catalogName), true));
        }
    };
}

export function fetchMore () {
    return (dispatch, getState) => {
        const state = getState().catalog;
        if (state.hasNext) {
            dispatch(loadMore());
            dispatch(fetchMangasList(mangaManager.getPopularManga(state.catalogName, state.nextUrl), false));
        }
    };
}
