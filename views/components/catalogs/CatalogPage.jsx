"use babel";
import React from 'react';
var catalogManager = require('../../../core/catalog-manager');
var mangaManager = require('../../../core/manga-manager');
var _ = require('lodash');
import MangaList from '../mangas/MangaList';

class CatalogPage extends React.Component {
    constructor() {
        super();
        this.state = {
            mangas: [],
            catalog: {
                name: ''
            }
        };
    }

    componentDidMount() {
        this.setState({
            catalog: catalogManager.getCatalog(this.props.params.catalogName)
        });

        var self = this;

        mangaManager.getPopularManga(this.props.params.catalogName).then(function(response) {
            self.setState({mangas: response.mangas});
            _.forEach(response.promises, function(promise) {
                promise.then(function(manga) {
                    var mangas = self.state.mangas;
                    mangas[_.findIndex(self.state.mangas, {_id: manga._id})] = manga;
                    self.setState({mangas: mangas});
                });
            });
        });
    }

    render() {
        return (
            <div>
                <h3>{this.state.catalog.name}</h3>
                <MangaList mangas={this.state.mangas} />
            </div>
        );
    }
}

module.exports = CatalogPage;
