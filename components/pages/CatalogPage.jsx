"use babel";
import React from 'react';
var catalogManager = require('../../core/catalog-manager');

var CatalogPage = React.createClass({
    render: function() {
        var catalogs = catalogManager.getCatalogList();
        return (
            <div>
                <h3>Catalogs Page</h3>
                <ul>
                    {catalogs.map(function(catalog, index){
                        return <li key="{index}">{catalog.name}</li>;
                    })}
                </ul>
            </div>
        );
    }
});

module.exports = CatalogPage;
