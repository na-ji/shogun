// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import reader from './reader';

const rootReducer = combineReducers({
    reader,
    routing
});

export default rootReducer;
