// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import reader from './reader';
import app from './app';
import catalog from './catalog';
import manga from './manga';
import library from './library';

const rootReducer = combineReducers({
    reader,
    app,
    catalog,
    manga,
    library,
    router
});

export default rootReducer;
