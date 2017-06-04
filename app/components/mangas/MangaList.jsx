import React from 'react';
import { Link } from 'react-router-dom';

import MangaCard from './MangaCard';
import Spinner from '../spinner/Spinner';

export default class MangaList extends React.Component {
    render () {
        let spinner;
        if (this.props.loading) {
            spinner = (
                <div>
                    <Spinner />
                </div>
            );
        }
        return (
            <div>
                <div className="grid">
                    {this.props.mangas.map(function (manga, index) {
                        return (
                            <div key={manga.id}>
                                <Link to={{ pathname: `/manga/${manga.id}` }}>
                                    <MangaCard manga={manga} />
                                </Link>
                            </div>
                        );
                    })}
                </div>
                <div className="clearfix" />
                <div>
                    {spinner}
                </div>
                <div className="clearfix" />
            </div>
        );
    }
}
