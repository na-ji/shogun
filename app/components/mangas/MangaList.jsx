'use babel';
import React from 'react';
import MangaCard from './MangaCard';
import { Link } from 'react-router';
import Spinner from '../Spinner';

class MangaList extends React.Component {
    render () {
        if (this.props.loading) {
            return (
                <div>
                    <Spinner />
                </div>
            );
        }

        return (
            <div>
                {this.props.mangas.map(function (manga, index) {
                    return (
                        <div key={manga.id} className="col-md-2 col-sm-3">
                            <Link to={{ pathname: `/manga/${manga.id}`, state: { manga: manga } }}>
                                <MangaCard manga={manga} />
                            </Link>
                        </div>
                    );
                })}
            </div>
        );
    }
}

module.exports = MangaList;
