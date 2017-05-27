import { combineReducers } from 'redux';
import {
    REQUEST_PAGES_URL, RECEIVE_PAGES_URL, CHANGE_PAGE,
    REQUEST_IMAGE_URL, RECEIVE_IMAGE_URL,
    REQUEST_IMAGE, RECEIVE_IMAGE, INIT_IMAGES, CANCEL_REQUEST, REQUEST_CANCELED
} from '../actions/reader';
import _ from 'lodash';

function pages (state = {
    currentPage: 0,
    isFetching: false,
    chapterId: '',
    pagesUrl: [],
    promise: null
}, action) {
    switch (action.type) {
        case REQUEST_PAGES_URL:
            return Object.assign({}, state, {
                isFetching: true,
                pagesUrl: [],
                currentPage: 0,
                promise: action.promise
            });
        case CANCEL_REQUEST:
            if (state.promise) {
                state.promise.cancel();
            }

            return Object.assign({}, state, {
                promise: null
            });
        case RECEIVE_PAGES_URL:
            return Object.assign({}, state, {
                isFetching: false,
                pagesUrl: action.pagesUrl,
                chapterId: action.chapterId,
                promise: null
            });
        case CHANGE_PAGE:
            return Object.assign({}, state, {
                currentPage: action.nextPage
            });
        default:
            return state;
    }
}

function images (state = {
    imageFetching: 0,
    isFetching: false,
    images: [],
    cancelRequest: false,
    promise: null
}, action) {
    switch (action.type) {
        case REQUEST_IMAGE_URL:
            return Object.assign({}, state, {
                isFetching: true,
                promise: action.promise
            });
        case RECEIVE_IMAGE_URL:
            return Object.assign({}, state, {
                isFetching: false,
                promise: null
            });
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
            let nextState = {
                promise: null
            };

            if (state.promise) {
                state.promise.cancel();
            } else if (state.isFetching) {
                nextState.cancelRequest = true;
            }

            return Object.assign({}, state, nextState);
        case REQUEST_CANCELED:
            return Object.assign({}, state, {
                cancelRequest: false
            });
        case CHANGE_PAGE:
            // If the image is not yet loaded, we set it as the next image to load
            if (!state.images[action.nextPage]) {
                return Object.assign({}, state, {
                    nextImageFetching: action.nextPage
                });
            }
            return state;
        case RECEIVE_IMAGE:
            let nextImageFetching = state.imageFetching;

            if (!_.isUndefined(state.nextImageFetching)) {
                nextImageFetching = state.nextImageFetching;
            } else if (_.findIndex(state.images, _.isUndefined) > -1) {
                // We select the next image not downloaded
                if (_.findIndex(state.images, _.isUndefined, state.imageFetching + 1) > -1) {
                    // if there is an image not downloaded AFTER the current image
                    nextImageFetching = _.findIndex(state.images, _.isUndefined, state.imageFetching + 1);
                } else {
                    // if there is an image not downloaded BEFORE the current image
                    nextImageFetching = _.findIndex(state.images, _.isUndefined);
                }
            }

            let newState = Object.assign({}, state, {
                isFetching: false,
                imageFetching: nextImageFetching,
                images: [
                    ...state.images.slice(0, state.imageFetching),
                    action.htmlImage,
                    ...state.images.slice(state.imageFetching + 1)
                ]
            });

            if (state.nextImageFetching !== undefined) {
                // We remove the nextImageFetching once the loading started
                newState = Object.assign({}, newState, {
                    nextImageFetching: undefined
                });
            }

            return newState;
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    pages,
    images
});

export default rootReducer;
