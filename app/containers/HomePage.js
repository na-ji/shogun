import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { HomePage } from '../components';
import * as LibraryActions from '../actions/library';

function mapStateToProps (state) {
    const { library } = state;

    return {
        state: library
    };
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(LibraryActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
