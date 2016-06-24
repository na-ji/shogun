"use babel";
import React from 'react';
var catalogManager = require('../../../core/catalog-manager');

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
    }

    render() {
        return (
            <div>
                <h3>{this.state.catalog.name}</h3>
            </div>
        );
    }
};

module.exports = CatalogPage;
