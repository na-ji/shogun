import React, { Component, PropTypes } from 'react';

import MangaList from '../mangas/MangaList';

class CatalogPage extends Component {
    componentDidMount () {
        const { fetchPopularMangas, catalogName } = this.props;
        fetchPopularMangas(catalogName);
    }

    render () {
        const { catalog, fetchMore } = this.props;
        let moreButton;
        if (catalog.hasNext && !catalog.loading) {
            moreButton = (
                <div className="col-sm-12">
                    <button className="btn btn-raised btn-primary" onClick={ () => fetchMore() }>Load More</button>
                </div>
            );
        }

        return (
            <div>
                <h3>{catalog.catalog ? catalog.catalog.name : ''}</h3>
                <MangaList mangas={catalog.mangas} loading={catalog.loading} />
                {moreButton}
            </div>
        );
    }
}

CatalogPage.propTypes = {
    catalog: PropTypes.object.isRequired,
    catalogName: PropTypes.string.isRequired,
    fetchPopularMangas: PropTypes.func.isRequired,
    fetchMore: PropTypes.func.isRequired
};

module.exports = CatalogPage;
