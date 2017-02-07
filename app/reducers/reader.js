// @flow
import { combineReducers } from 'redux';
import {
    REQUEST_PAGES_URL, RECEIVE_PAGES_URL, CHANGE_PAGE,
    REQUEST_IMAGE_URL, RECEIVE_IMAGE_URL,
    REQUEST_IMAGE, RECEIVE_IMAGE, INIT_IMAGES, CANCEL_REQUEST
} from '../actions/reader';

function pages (state = {
    currentPage: 0,
    isFetching: false,
    chapterId: '',
    pagesUrl: []
}, action) {
    switch (action.type) {
        case REQUEST_PAGES_URL:
            return Object.assign({}, state, {
                isFetching: true,
                pagesUrl: [],
                chapterId: action.chapterId
            });
        case RECEIVE_PAGES_URL:
            return Object.assign({}, state, {
                isFetching: false,
                pagesUrl: action.pagesUrl
            });
        case CHANGE_PAGE:
            return Object.assign({}, state, {
                currentPage: action.currentPage
            });
        default:
            return state;
    }
}

function images (state = {
    imageFetching: 0,
    isFetching: false,
    images: [],
    cancelRequest: false
}, action) {
    switch (action.type) {
        case REQUEST_IMAGE_URL:
        case RECEIVE_IMAGE_URL:
        case REQUEST_IMAGE:
            return Object.assign({}, state, {
                isFetching: true
            });
        case INIT_IMAGES:
            return Object.assign({}, state, {
                images: action.images,
                imageFetching: 0,
                cancelRequest: false
            });
        case CANCEL_REQUEST:
            return Object.assign({}, state, {
                cancelRequest: true
            });
        case RECEIVE_IMAGE:
            let nextImageFetching = state.imageFetching;
            if (nextImageFetching + 1 < state.images.length) {
                nextImageFetching = nextImageFetching + 1;
            }

            return Object.assign({}, state, {
                isFetching: false,
                imageFetching: nextImageFetching,
                images: [
                    ...state.images.slice(0, state.imageFetching),
                    action.htmlImage,
                    ...state.images.slice(state.imageFetching + 1)
                ]
            });
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    pages,
    images
});

export default rootReducer;
