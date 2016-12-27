'use babel';
import React from 'react';
var mangaManager = require('../../../core/manga-manager');
import MangaInfo from './MangaInfo';
import ChapterList from '../chapters/ChapterList';

class MangaPage extends React.Component {
    constructor () {
        super();
        this.state = {
            manga: {},
            chapters: [],
            infoLoading: true,
            chapterLoading: true
        };
    }

    componentDidMount () {
        var self = this;
        mangaManager.getMangaById(this.props.params.mangaId).then(function (manga) {
            self.setState({
                manga: manga.manga,
                chapters: manga.chapters,
                infoLoading: false
            });

            if (!manga.chapters.length) {
                mangaManager.getChapterList(manga.manga).then(function (chapters) {
                    self.setState({
                        chapters: chapters,
                        chapterLoading: false
                    });
                });
            } else {
                self.setState({
                    chapterLoading: false
                });
            }
        });
    }

    render () {
        return (
            <div>
                <div className="col-sm-5 col-md-4 col-lg-3">
                    <MangaInfo manga={this.state.manga} loading={this.state.infoLoading} />
                </div>
                <div className="col-sm-7 col-md-8 col-lg-9">
                    <ChapterList chapters={this.state.chapters} loading={this.state.chapterLoading} />
                </div>
            </div>
        );
    }
}

module.exports = MangaPage;
