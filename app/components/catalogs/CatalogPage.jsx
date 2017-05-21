import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import MangaList from '../mangas/MangaList';

class CatalogPage extends Component {
    componentDidMount () {
        const { fetchPopularMangas, catalogName } = this.props;
        fetchPopularMangas(catalogName);
    }

    render () {
        const { catalog, fetchMore, searchManga, resetSearch } = this.props;
        let moreButton;
        if (catalog.hasNext && !catalog.loading) {
            moreButton = (
                <div className="col-sm-12">
                    <button className="btn btn-raised btn-primary full-width" onClick={ () => fetchMore() }>Load More</button>
                </div>
            );
        }

        let subtitle = '';
        let mangas = catalog.mangas;
        if (catalog.query) {
            mangas = catalog.searchMangas;

            if (!catalog.loading) {
                subtitle = <h5>{catalog.searchMangas.length} results</h5>;
            }
        }

        const search = (e) => {
            e.preventDefault();

            searchManga($('#search').val());

            return false;
        };

        const cancelSearch = () => {
            $('#search').val('');
            resetSearch();
        };

        return (
            <div>
                <h3>{catalog.catalog ? catalog.catalog.name : ''}</h3>
                <form className="form-inline" onSubmit={search}>
                    <div className="input-group">
                        <input type="text" id="search" className="form-control" placeholder="Search" defaultValue={catalog.query ? catalog.query : ''} />
                        <span className="input-group-btn input-group-sm">
                            <button type="submit" className="btn btn-fab btn-fab-mini btn-primary">
                                <i className="material-icons">search</i>
                            </button>
                        </span>
                        <span className="input-group-btn input-group-sm">
                            <button type="button" className="btn btn-fab btn-fab-mini btn-primary" onClick={cancelSearch}>
                                <i className="material-icons">close</i>
                            </button>
                        </span>
                    </div>
                </form>
                {subtitle}
                <MangaList mangas={mangas} loading={catalog.loading} />
                {moreButton}
            </div>
        );
    }
}

CatalogPage.propTypes = {
    catalog: PropTypes.object.isRequired,
    catalogName: PropTypes.string.isRequired,
    fetchPopularMangas: PropTypes.func.isRequired,
    searchManga: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    fetchMore: PropTypes.func.isRequired
};

module.exports = CatalogPage;
