import _ from 'lodash';

import {
    GET_POPULAR_MANGAS,
    LOAD_MORE,
    SEARCH,
    RESET_SEARCH,
    RECEIVE_MANGAS_LIST,
    RECEIVE_MANGA_DETAILS
} from '../actions/catalog';

export default function catalog (state = {
    loading: true,
    catalogName: null,
    catalog: null,
    hasNext: false,
    query: null,
    mangas: [],
    searchMangas: []
}, action) {
    switch (action.type) {
        case GET_POPULAR_MANGAS:
            return Object.assign({}, state, {
                loading: true,
                catalogName: action.catalogName,
                catalog: action.catalog
            });
        case LOAD_MORE:
            return Object.assign({}, state, {
                loading: true
            });
        case SEARCH:
            return Object.assign({}, state, {
                loading: true,
                searchMangas: [],
                query: action.query
            });
        case RESET_SEARCH:
            return Object.assign({}, state, {
                query: null,
                searchMangas: []
            });
        case RECEIVE_MANGAS_LIST:
            let futureState = Object.assign({}, state, {
                hasNext: action.response.hasNext,
                loading: false
            });

            if (!_.isNil(state.query)) {
                futureState.searchMangas = action.response.mangas;
                return futureState;
            }

            if (action.override) {
                futureState.mangas = action.response.mangas;
                return futureState;
            }

            futureState.mangas = [...state.mangas, ...action.response.mangas];
            return futureState;
        case RECEIVE_MANGA_DETAILS:
            let arrayToUpdate = 'mangas';
            if (!_.isNil(state.query)) {
                arrayToUpdate = 'searchMangas';
            }

            let mangas = _.cloneDeep(state[arrayToUpdate]);
            mangas[_.findIndex(mangas, {id: action.manga.id})] = action.manga;

            let nextState = {};
            nextState[arrayToUpdate] = mangas;

            return Object.assign({}, state, nextState);
        default:
            return state;
    }
}
