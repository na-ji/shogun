export const REQUEST_PAGES_URL = 'REQUEST_PAGES_URL';
export const RECEIVE_PAGES_URL = 'RECEIVE_PAGES_URL';
export const CHANGE_PAGE = 'CHANGE_PAGE';
export const REQUEST_IMAGE_URL = 'REQUEST_IMAGE_URL';
export const RECEIVE_IMAGE_URL = 'RECEIVE_IMAGE_URL';
export const RECEIVE_IMAGE = 'RECEIVE_IMAGE';
export const REQUEST_IMAGE = 'REQUEST_IMAGE';
export const INIT_IMAGES = 'INIT_IMAGES';
export const CANCEL_REQUEST = 'CANCEL_REQUEST';

import mangaManager from '../core/manga-manager';

function requestPagesUrl (chapterId) {
    return {
        type: REQUEST_PAGES_URL,
        chapterId
    };
}

function receivePagesUrl (pagesUrl) {
    return {
        type: RECEIVE_PAGES_URL,
        pagesUrl
    };
}

export function changePage (currentPage) {
    return {
        type: CHANGE_PAGE,
        currentPage
    };
}

function requestImageUrl (pageUrl) {
    return {
        type: REQUEST_IMAGE_URL,
        pageUrl
    };
}

function receiveImageUrl (pageUrl, imageUrl) {
    return {
        type: RECEIVE_IMAGE_URL,
        pageUrl,
        imageUrl
    };
}

function requestImage (image) {
    return {
        type: REQUEST_IMAGE,
        image
    };
}

function receiveImage (image, htmlImage) {
    return {
        type: RECEIVE_IMAGE,
        image,
        htmlImage
    };
}

function initImages (images) {
    return {
        type: INIT_IMAGES,
        images
    };
}

export function cancelRequest () {
    return {
        type: CANCEL_REQUEST
    };
}

function fetchImage (manga) {
    return (dispatch, getState) => {
        let downloadingImage = new Image();
        const { pages, images } = getState().reader;

        downloadingImage.onload = function () {
            const { images } = getState().reader;
            dispatch(receiveImage(images.imageFetching, downloadingImage));
            if (!images.cancelRequest && images.imageFetching + 1 < images.images.length) {
                dispatch(fetchImage(manga));
            }
        };

        let pageUrl = pages.pagesUrl[images.imageFetching];
        dispatch(requestImageUrl(pageUrl));

        mangaManager.getImageURL(manga, pageUrl).then(function (imageURL) {
            dispatch(receiveImageUrl(pageUrl, imageURL));

            dispatch(requestImage(imageURL));

            downloadingImage.src = imageURL;
        });
    };
}

function fetchPages (manga, chapter) {
    return dispatch => {
        dispatch(requestPagesUrl());
        dispatch(initImages([]));

        mangaManager.getChapterPages(manga, chapter).then(function (pagesUrl) {
            dispatch(receivePagesUrl(pagesUrl));

            if (pagesUrl.length) {
                dispatch(initImages(new Array(pagesUrl.length)));
                dispatch(fetchImage(manga));
            }
        });
    };
}

export function fetchPagesIfNeeded (manga, chapter) {
    return (dispatch, getState) => {
        const { pages } = getState().reader;

        if (pages.chapterId !== chapter.id) {
            dispatch(fetchPages(manga, chapter));
        }
    };
}
