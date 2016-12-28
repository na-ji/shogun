'use babel';
import React from 'react';
var mangaManager = require('../../../core/manga-manager');
import Paginator from './Paginator';

/* global $ */
class ReaderPage extends React.Component {
    constructor () {
        super();
        this.state = {
            manga: {},
            chapter: {},
            pages: [],
            page: 0
        };

        this.changePage = this.changePage.bind(this);
    }

    componentDidMount () {
        if (this.props.location.state && this.props.location.state.manga && this.props.location.state.chapter) {
            this.setState({
                'manga': this.props.location.state.manga,
                'chapter': this.props.location.state.chapter
            });

            let self = this;

            mangaManager.getChapterPages(this.props.location.state.manga, this.props.location.state.chapter).then(function (pages) {
                self.setState({
                    'pages': pages
                });
            });
        }
    }

    changePage (e) {
        e.preventDefault();

        let newPage = parseInt($(e.currentTarget).attr('data-page'));
        if ($(e.currentTarget).attr('data-page') === 'previous') {
            newPage = Math.max(0, this.state.page - 1);
        }
        if ($(e.currentTarget).attr('data-page') === 'next') {
            newPage = Math.min(this.state.pages.length - 1, this.state.page + 1);
        }

        this.setState({
            page: newPage
        });
    }

    render () {
        return (
            <div>
                <div className="col-sm-12">
                    <h3>{this.state.chapter.name}</h3>
                    <Paginator pages={this.state.pages} page={this.state.page} handler={this.changePage} />
                </div>
            </div>
        );
    }
}

module.exports = ReaderPage;
