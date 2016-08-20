"use babel";
import React from 'react';
import MangaCard from './MangaCard';
import { Link } from 'react-router';

class MangaList extends React.Component {
    render() {
        return (
            <div>
                {this.props.mangas.map(function(manga, index){
                    return (
                        <div key={manga.id} className="col-md-2 col-sm-3">
                            <Link to={`/manga/${manga.id}`}>
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
