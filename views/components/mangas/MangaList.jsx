"use babel";
import React from 'react';
import Manga from '../mangas/Manga';

class MangaList extends React.Component {
    render() {
        return (
            <div>
                {this.props.mangas.map(function(manga, index){
                    return <div className="col-md-2 col-sm-3"><Manga manga={manga} /></div>;
                })}
            </div>
        );
    }
}

module.exports = MangaList;
