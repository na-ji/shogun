"use babel";
import React from 'react';
var mangaManager = require('../../../core/manga-manager');
import MangaInfo from './MangaInfo';

class MangaPage extends React.Component {
    constructor() {
        super();
        this.state = {
            manga: {}
        };
    }

    componentDidMount() {
        var self = this;
        mangaManager.getMangaById(this.props.params.mangaId).done(function(manga) {
            self.setState({
                manga: manga
            });
        });
    }

    render() {
        return (
            <div>
                <div className="col-sm-4">
                    <MangaInfo manga={this.state.manga} />
                </div>
                <div className="col-sm-8">

                </div>
            </div>
        );
    }
}

module.exports = MangaPage;
