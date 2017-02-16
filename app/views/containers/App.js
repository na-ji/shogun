import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { App } from '../components';
import * as AppActions from '../../actions/app';

function mapStateToProps (state, ownProps) {
    const { canGoBack } = state.app;
    const { goBack } = ownProps.router;

    return {
        canGoBack,
        goBack
    };
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(AppActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
