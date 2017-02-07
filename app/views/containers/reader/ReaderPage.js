import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ReaderPage } from '../../components';
import * as ReaderActions from '../../../actions/reader';

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
    return bindActionCreators(ReaderActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReaderPage);
