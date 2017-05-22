// import { combineReducers } from 'redux';
import { LOCATION_CHANGE } from 'react-router-redux';
import { GOING_BACK } from '../actions/app';

function app (state = {
    canGoBack: false,
    isGoingBack: false,
    currentPathname: '/',
    historyLength: 0,
    scrollPosition: []
}, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            if (state.isGoingBack) {
                // scroll restoration -> fuck it
                setTimeout(() => {
                    window.scrollTo(0, state.scrollPosition[state.scrollPosition.length - 1]);
                }, 10);

                return Object.assign({}, state, {
                    isGoingBack: false,
                    currentPathname: action.payload.pathname,
                    scrollPosition: state.scrollPosition.slice(0, -1)
                });
            }

            if (state.currentPathname !== action.payload.pathname) {
                return Object.assign({}, state, {
                    canGoBack: true,
                    currentPathname: action.payload.pathname,
                    historyLength: state.historyLength + 1,
                    scrollPosition: [...state.scrollPosition, window.scrollY]
                });
            }

            return state;
        case GOING_BACK:
            return Object.assign({}, state, {
                isGoingBack: true,
                historyLength: Math.max(state.historyLength - 1, 0),
                canGoBack: state.historyLength - 1 > 0
            });
        default:
            return state;
    }
}

export default app;
