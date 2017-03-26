import _ from 'lodash';

import {
    GET_POPULAR_MANGAS,
    RECEIVE_MANGAS_LIST,
    RECEIVE_MANGA_DETAILS
} from '../actions/catalog';

export default function catalog (state = {
    loading: true,
    catalogName: null,
    catalog: null,
    mangas: []
}, action) {
    switch (action.type) {
        case GET_POPULAR_MANGAS:
            return Object.assign({}, state, {
                loading: true,
                catalogName: action.catalogName,
                catalog: action.catalog
            });
        case RECEIVE_MANGAS_LIST:
            if (action.override) {
                return Object.assign({}, state, {
                    mangas: action.mangas,
                    loading: false
                });
            }

            return Object.assign({}, state, {
                mangas: state.mangas.concat(action.mangas),
                loading: false
            });
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
