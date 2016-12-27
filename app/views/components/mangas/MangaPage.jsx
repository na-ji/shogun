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

    loadManga (manga) {
        this.setState({
            manga: manga,
            infoLoading: false
        });

        let self = this;
        if (!manga.chapters.length) {
            mangaManager.getChapterList(manga).then(function (chapters) {
                self.setState({
                    chapters: chapters,
                    chapterLoading: false
                });
            });
        } else {
            mangaManager.getMangaById(manga.id).then(function (response) {
                self.setState({
                    chapters: response.chapters,
                    chapterLoading: false
                });
            });
        }
    }

    componentDidMount () {
        if (this.props.location.state && this.props.location.state.manga) {
            this.loadManga(this.props.location.state.manga);
        }
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
