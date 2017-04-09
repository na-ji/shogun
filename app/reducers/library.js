import _ from 'lodash';

import { REQUEST_LIBRARY, RECEIVE_LIBRARY, TOGGLE_MANGA_TO_LIBRARY } from '../actions/library';

export default function library (state = {
    mangas: [],
    loaded: false
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
