import React from 'react';
var catalogManager = require('../../utils/catalog-manager');
import { Link } from 'react-router';

class CatalogList extends React.Component {
    render () {
        var catalogs = catalogManager.getCatalogList();
        return (
            <div>
                <h3>Catalogs Page</h3>
                <ul>
                    {catalogs.map(function (catalog, index){
                        return (
                            <li key={index}>
                                <Link to={`/catalog/${catalog.file}`}>{catalog.name}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

module.exports = CatalogList;
