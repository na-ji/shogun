import React from 'react';
import MangaCard from './MangaCard';
import { Link } from 'react-router';
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
                <div>
                    {this.props.mangas.map(function (manga, index) {
                        return (
                            <div key={manga.id} className="col-lg-2 col-md-3 col-sm-3">
                                <Link to={{ pathname: `/manga/${manga.id}`, state: { manga: manga } }}>
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
