import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { Button, TextField, Typography } from 'material-ui';
import { Search as SearchIcon, Close as CloseIcon } from 'material-ui-icons';

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
                <Button color="primary" raised className="full-width" onClick={ () => fetchMore() }>
                    Load More
                </Button>
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
                <Typography type="headline">{catalog.catalog ? catalog.catalog.name : ''}</Typography>
                <form className="form-inline" onSubmit={search}>
                    <div className="input-group">
                        <TextField
                            id="search"
                            label="Search"
                            defaultValue={catalog.query ? catalog.query : ''}
                        />
                        <span className="input-group-btn input-group-sm">
                            <Button fab dense color="primary" type="submit">
                                <SearchIcon />
                            </Button>
                        </span>
                        <span className="input-group-btn input-group-sm">
                            <Button fab dense color="primary" onClick={cancelSearch}>
                                <CloseIcon />
                            </Button>
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
