import _ from 'lodash';

import {
    REQUEST_LIBRARY, RECEIVE_LIBRARY, REFRESH_LIBRARY,
    REFRESH_PROGRESS, TOGGLE_MANGA_TO_LIBRARY
} from '../actions/library';

export default function library (state = {
    mangas: [],
    loaded: false,
    refreshing: false,
    progress: 0,
    progressPercent: 0
}, action) {
    switch (action.type) {
        case REQUEST_LIBRARY:
            return Object.assign({}, state, {
                loaded: false
            });
        case RECEIVE_LIBRARY:
            return Object.assign({}, state, {
                loaded: true,
                mangas: action.mangas
            });
        case REFRESH_LIBRARY:
            return Object.assign({}, state, {
                refreshing: true,
                progress: 0,
                progressPercent: 0
            });
        case REFRESH_PROGRESS:
            let nextState = {
                progress: state.progress + 1,
                progressPercent: (state.progress + 1) / state.mangas.length * 100
            };

            if (state.progress + 1 === state.mangas.length) {
                nextState.refreshing = false;
            }

            return Object.assign({}, state, nextState);
        case TOGGLE_MANGA_TO_LIBRARY:
            let mangas = _.cloneDeep(state.mangas);
            let index = _.findIndex(mangas, {id: action.manga.id});

            if (index > -1) {
                // If the manga is already in library, we remove it
                _.pullAt(mangas, index);
            } else {
                // If the manga is not in library, we add it
                mangas.push(action.manga);
            }

            return Object.assign({}, state, {
                mangas: mangas
            });
        default:
            return state;
    }
}
