import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from 'material-ui';
import { Parser } from 'manga-parser';
import _ from 'lodash';

class CatalogList extends React.Component {
    render () {
        const catalogs = Parser.getCatalogs();
        let i = 0;
        let list = [];
        _.forEach(catalogs, (catalog, key) => {
            list.push(
                <li key={i++}>
                    <Link to={`/catalog/${key}`}>
                        <Typography>{catalog.name}</Typography>
                    </Link>
                </li>
            );
        });

        return (
            <div>
                <Typography type="headline">Catalogs Page</Typography>
                <ul>
                    {list}
                </ul>
            </div>
        );
    }
}

module.exports = CatalogList;
