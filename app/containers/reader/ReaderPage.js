import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';

import { ReaderPage } from '../../components';
import * as ReaderActions from '../../actions/reader';

const actions = {
    ...ReaderActions,
    ...routerActions
};

function mapStateToProps (state, ownProps) {
    const { pages, images } = state.reader;
    const { manga, chapter } = ownProps.location.state;

    return {
        pages,
        images,
        manga,
        chapter
    };
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReaderPage);
