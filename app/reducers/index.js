// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import reader from './reader';
import app from './app';
import catalog from './catalog';
import manga from './manga';

const rootReducer = combineReducers({
    reader,
    app,
    catalog,
    manga,
    routing
});

export default rootReducer;
