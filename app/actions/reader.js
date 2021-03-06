import _ from 'lodash';
import { push } from 'react-router-redux';

import MangaManager from '../utils/manga-manager';
import { markChaptersRead } from './manga';

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

function requestPagesUrl (promise) {
    return {
        type: REQUEST_PAGES_URL,
        promise
    };
}

function receivePagesUrl (pagesUrl, chapterId) {
    return {
        type: RECEIVE_PAGES_URL,
        pagesUrl,
        chapterId
    };
}

export function changePage (targetPage, manga) {
    return (dispatch, getState) => {
        const state = getState().reader.pages;
        let nextPage = state.currentPage;
        const chapterIndex = _.findIndex(manga.chapters, {id: state.chapterId});
        let nextChapter;

        if (!isNaN(parseInt(targetPage))) {
            nextPage = parseInt(targetPage);
        } else if (targetPage === 'previous') {
            if (state.currentPage - 1 < 0) {
                // we move to the previous chapter if the reader was on the first page
                if (chapterIndex - 1 > 0) {
                    nextChapter = manga.chapters[chapterIndex - 1];
                }
            } else {
                nextPage = Math.max(0, state.currentPage - 1);
            }
        } else if (targetPage === 'next') {
            if (state.currentPage + 1 > state.pagesUrl.length - 1) {
                // we move to the next chapter if the reader was on the last page
                if (chapterIndex + 1 < manga.chapters.length) {
                    nextChapter = manga.chapters[chapterIndex + 1];
                }
            } else {
                nextPage = Math.min(state.pagesUrl.length - 1, state.currentPage + 1);
            }
        }

        if (nextChapter) {
            return dispatch(
                push({
                    pathname: `/chapter/${nextChapter.id}`,
                    state: {chapter: nextChapter, manga: manga}
                })
            );
        }

        // if the reader reached the last page, we mark the chapter as read
        if (nextPage === state.pagesUrl.length - 1) {
            let chapter = _.find(manga.chapters, {id: state.chapterId});
            dispatch(markChaptersRead(manga, [chapter]));
        }

        return dispatch({
            type: CHANGE_PAGE,
            nextPage
        });
    };
}

function requestImageUrl (pageUrl, promise) {
    return {
        type: REQUEST_IMAGE_URL,
        pageUrl,
        promise
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

        const pageUrl = pages.pagesUrl[images.imageFetching];
        const promise = MangaManager.getImageURL(manga, pageUrl);
        dispatch(requestImageUrl(pageUrl, promise));

        promise.then(function (imageURL) {
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
    return dispatch => {
        const promise = MangaManager.getChapterPages(manga, chapter);
        dispatch(requestPagesUrl(promise));
        dispatch(initImages([]));

        promise.then(function (pagesUrl) {
            dispatch(receivePagesUrl(pagesUrl, chapter.id));

            if (pagesUrl.length) {
                dispatch(initImages(new Array(pagesUrl.length)));
                dispatch(fetchImage(manga));
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

        if (pages.chapterId !== chapter.id) {
            // If it is a new chapter
            dispatch(fetchPages(manga, chapter));
        } else {
            // If we already loaded the chapter
            dispatch(fetchImage(manga));
        }
    };
}
