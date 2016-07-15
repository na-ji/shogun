"use babel";
import React from 'react';
import MangaCard from './MangaCard';

class MangaList extends React.Component {
    render() {
        return (
            <div>
                {this.props.mangas.map(function(manga, index){
                    return <div key={manga._id} className="col-md-2 col-sm-3"><MangaCard manga={manga} /></div>;
                })}
            </div>
        );
    }
}

module.exports = MangaList;
