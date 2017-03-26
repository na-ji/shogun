import React, { Component, PropTypes } from 'react';

import MangaList from '../mangas/MangaList';

class CatalogPage extends Component {
    componentDidMount () {
        const { fetchPopularMangas, catalogName } = this.props;
        fetchPopularMangas(catalogName);
    }

    render () {
        const { catalog } = this.props;

        return (
            <div>
                <h3>{catalog.catalog ? catalog.catalog.name : ''}</h3>
                <MangaList mangas={catalog.mangas} loading={catalog.loading} />
            </div>
        );
    }
}

CatalogPage.propTypes = {
    catalog: PropTypes.object.isRequired,
    catalogName: PropTypes.string.isRequired,
    fetchPopularMangas: PropTypes.func.isRequired
};

module.exports = CatalogPage;
