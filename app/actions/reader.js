export const REQUEST_PAGES_URL = 'REQUEST_PAGES_URL';
export const RECEIVE_PAGES_URL = 'RECEIVE_PAGES_URL';
export const CHANGE_PAGE = 'CHANGE_PAGE';
export const REQUEST_IMAGE_URL = 'REQUEST_IMAGE_URL';
export const RECEIVE_IMAGE_URL = 'RECEIVE_IMAGE_URL';
export const RECEIVE_IMAGE = 'RECEIVE_IMAGE';
export const REQUEST_IMAGE = 'REQUEST_IMAGE';
export const INIT_IMAGES = 'INIT_IMAGES';
export const CANCEL_REQUEST = 'CANCEL_REQUEST';
export const REQUEST_CANCELED = 'REQUEST_CANCELED';

import mangaManager from '../core/manga-manager';
import _ from 'lodash';

function requestPagesUrl () {
    return {
        type: REQUEST_PAGES_URL
    };
}

function receivePagesUrl (pagesUrl, chapterId) {
    return {
        type: RECEIVE_PAGES_URL,
        pagesUrl,
        chapterId
    };
}

export function changePage (nextPage) {
    return {
        type: CHANGE_PAGE,
        nextPage
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

function requestCanceled () {
    return {
        type: REQUEST_CANCELED
    };
}

function fetchImage (manga) {
    return (dispatch, getState) => {
        const { pages, images } = getState().reader;

        if (_.findIndex(images.images, _.isUndefined) === -1) {
            // if we already loaded all the images, we stop here
            return;
        }

        let downloadingImage = new Image();
        downloadingImage.onload = function () {
            // When the image has been downloaded by the browser
            const { images } = getState().reader;
            dispatch(receiveImage(images.imageFetching, downloadingImage));

            if (!images.cancelRequest && _.findIndex(images.images, _.isUndefined) > -1) {
                // if there is still image to load
                dispatch(fetchImage(manga));
            } else if (images.cancelRequest) {
                dispatch(requestCanceled());
            }
        };

        let pageUrl = pages.pagesUrl[images.imageFetching];
        dispatch(requestImageUrl(pageUrl));

        mangaManager.getImageURL(manga, pageUrl).then(function (imageURL) {
            dispatch(receiveImageUrl(pageUrl, imageURL));

            const { images } = getState().reader;
            if (!images.cancelRequest) {
                dispatch(requestImage(imageURL));

                // we start the downloading of the image by adding it to the Image object
                downloadingImage.src = imageURL;
            } else {
                dispatch(requestCanceled());
            }
        }).catch(function (error) {
            console.log(error);
            // Todo: manage timeouts
        });
    };
}

function fetchPages (manga, chapter) {
    return (dispatch, getState) => {
        dispatch(requestPagesUrl());
        dispatch(initImages([]));

        mangaManager.getChapterPages(manga, chapter).then(function (pagesUrl) {
            dispatch(receivePagesUrl(pagesUrl, chapter.id));
            const { pages } = getState().reader;

            if (pagesUrl.length) {
                if (pages.cancelRequest) {
                    dispatch(requestCanceled());
                } else {
                    dispatch(initImages(new Array(pagesUrl.length)));
                    dispatch(fetchImage(manga));
                }
            }
        }).catch(function (error) {
            console.log(error);
            // Todo: manage timeouts
        });
    };
}

export function fetchPagesIfNeeded (manga, chapter) {
    return (dispatch, getState) => {
        const { pages } = getState().reader;

        // If the request was canceled previously and requestCanceled never has been dispatched
        if (pages.cancelRequest) {
            dispatch(requestCanceled());
        }

        if (pages.chapterId !== chapter.id) {
            // If it is a new chapter
            dispatch(fetchPages(manga, chapter));
        } else {
            // If we already loaded the chapter
            dispatch(fetchImage(manga));
        }
    };
}
