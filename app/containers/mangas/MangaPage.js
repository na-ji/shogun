import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { routerActions } from 'react-router-redux';

import { MangaPage } from '../../components';
import * as MangaActions from '../../actions/manga';

const actions = {
    ...MangaActions,
    ...routerActions
};

function mapStateToProps (state, ownProps) {
    const mangaId = ownProps.match.params.mangaId;
    let manga = _.find(state.library.mangas, {id: mangaId});

    if (_.isNil(manga)) {
        manga = _.find(state.catalog.mangas, {id: mangaId});
    }

    if (_.isNil(manga)) {
        manga = _.find(state.catalog.searchMangas, {id: mangaId});
    }

    return {
        state: state.manga,
        manga
    };
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MangaPage);
