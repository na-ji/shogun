import _ from 'lodash';

import {
    GET_POPULAR_MANGAS,
    LOAD_MORE,
    RECEIVE_MANGAS_LIST,
    RECEIVE_MANGA_DETAILS
} from '../actions/catalog';

export default function catalog (state = {
    loading: true,
    catalogName: null,
    catalog: null,
    hasNext: false,
    nextUrl: null,
    mangas: []
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
        case RECEIVE_MANGAS_LIST:
            let futureState = Object.assign({}, state, {
                hasNext: action.response.has_next,
                nextUrl: action.response.next_url,
                loading: false
            });

            if (action.override) {
                futureState.mangas = action.response.mangas;
                return futureState;
            }

            futureState.mangas = [...state.mangas, ...action.response.mangas];
            return futureState;
        case RECEIVE_MANGA_DETAILS:
            let mangas = _.cloneDeep(state.mangas);
            mangas[_.findIndex(mangas, {id: action.manga.id})] = action.manga;

            return Object.assign({}, state, {
                mangas
            });
        default:
            return state;
    }
}
