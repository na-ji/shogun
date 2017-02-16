// @flow
// import { combineReducers } from 'redux';
import { LOCATION_CHANGE } from 'react-router-redux';

function app (state = {
    canGoBack: false,
    historyLength: 0
}, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            console.log(action);

            if (action.payload.action === 'PUSH') {
                return Object.assign({}, state, {
                    canGoBack: true,
                    historyLength: state.historyLength + 1
                });
            } else if (action.payload.action === 'POP') {
                return Object.assign({}, state, {
                    historyLength: Math.max(state.historyLength - 1, 0),
                    canGoBack: state.historyLength - 1 > 0
                });
            }

            return state;
        default:
            return state;
    }
}

export default app;
