import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MangaPage } from '../../components';
import * as MangaActions from '../../actions/manga';

function mapStateToProps (state, ownProps) {
    const { manga } = state;
    const mangaFromRouter = ownProps.location.state.manga;

    return {
        state: manga,
        mangaFromRouter
    };
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(MangaActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MangaPage);
