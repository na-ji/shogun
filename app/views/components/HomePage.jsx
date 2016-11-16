"use babel";
import React from 'react';
var mangaManager = require('../../core/manga-manager');
import MangaList from './mangas/MangaList';

class HomePage extends React.Component {
    constructor() {
        super();
        this.state = {
            mangas: []
        };
    }

    componentDidMount() {
        var self = this;

        mangaManager.getLibrary().then(function (mangas) {
            self.setState({mangas: mangas});
        });
    }

    render() {
        return (
            <div>
                <h3>Library</h3>
                <MangaList mangas={this.state.mangas} />
            </div>
        );
    }
}

module.exports = HomePage;
