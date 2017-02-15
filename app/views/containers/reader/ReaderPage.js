import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ReaderPage } from '../../components';
import * as ReaderActions from '../../../actions/reader';

function mapStateToProps (state, ownProps) {
    const { pages, images } = state.reader;
    const { manga, chapter } = ownProps.location.state;

    // Initial state
    pages.pagesUrl = pages.pagesUrl ? pages.pagesUrl : [];
    pages.currentPage = pages.currentPage !== undefined ? pages.currentPage : 0;
    images.images = images.images ? images.images : [];
    images.imageFetching = images.imageFetching !== undefined ? images.imageFetching : 0;

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
