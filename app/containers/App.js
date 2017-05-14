import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';

import { App } from '../components';
import * as AppActions from '../actions/app';

function mapStateToProps (state) {
    const { canGoBack } = state.app;

    return {
        canGoBack,
        goBack
    };
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(AppActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
