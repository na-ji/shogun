'use babel';
import React from 'react';
var mangaManager = require('../utils/manga-manager');
import MangaList from './mangas/MangaList';

class HomePage extends React.Component {
    constructor () {
        super();
        this.state = {
            mangas: [],
            loading: true
        };
    }

    componentDidMount () {
        var self = this;

        mangaManager.getLibrary().then(function (mangas) {
            self.setState({mangas: mangas, loading: false});
        });
    }

    render () {
        return (
            <div>
                <h3>Library</h3>
                <MangaList mangas={this.state.mangas} loading={this.state.loading} />
            </div>
        );
    }
}

module.exports = HomePage;
