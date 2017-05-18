import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';

import { App } from '../components';
import * as AppActions from '../actions/app';

const actions = {
    ...AppActions,
    ...routerActions
};

function mapStateToProps (state) {
    const { canGoBack } = state.app;

    return {
        canGoBack
    };
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
