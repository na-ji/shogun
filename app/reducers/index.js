// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import reader from './reader';
import app from './app';

const rootReducer = combineReducers({
    reader,
    app,
    routing
});

export default rootReducer;
