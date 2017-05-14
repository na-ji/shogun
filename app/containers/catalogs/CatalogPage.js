import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CatalogPage } from '../../components';
import * as CatalogActions from '../../actions/catalog';

function mapStateToProps (state, ownProps) {
    const { catalog } = state;
    console.log(ownProps);
    const catalogName = ownProps.match.params.catalogName;

    return {
        catalog,
        catalogName
    };
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(CatalogActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogPage);
