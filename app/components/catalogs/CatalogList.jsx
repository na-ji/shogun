import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from 'material-ui';

import CatalogManager from '../../utils/catalog-manager';

class CatalogList extends React.Component {
    render () {
        const catalogs = CatalogManager.getCatalogList();

        return (
            <div>
                <Typography type="headline">Catalogs Page</Typography>
                <ul>
                    {catalogs.map(function (catalog, index) {
                        return (
                            <li key={index}>
                                <Link to={`/catalog/${catalog.file}`}><Typography>{catalog.name}</Typography></Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

module.exports = CatalogList;
