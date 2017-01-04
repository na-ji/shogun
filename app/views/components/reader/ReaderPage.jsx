'use babel';
import React from 'react';
var mangaManager = require('../../../core/manga-manager');
import Paginator from './Paginator';
import Spinner from '../Spinner';

/* global $, Image */
class ReaderPage extends React.Component {
    constructor () {
        super();
        this.state = {
            manga: {},
            chapter: {},
            pagesURL: [],
            images: [],
            page: 0
        };

        this.changePage = this.changePage.bind(this);
        this.loadImage = this.loadImage.bind(this);
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
                    'pagesURL': pages,
                    'images': new Array(pages.length)
                });

                self.loadImage(self.state.page);
            });
        }
    }

    loadImage (page) {
        let downloadingImage = new Image();
        let self = this;

        downloadingImage.onload = function () {
            let images = self.state.images;
            images[page] = downloadingImage;
            self.setState({
                'images': images
            });

            if (page + 1 < self.state.pagesURL.length) {
                self.loadImage(page + 1);
            }
        };

        mangaManager.getImageURL(this.state.manga, this.state.pagesURL[page]).then(function (imageURL) {
            downloadingImage.src = imageURL;
        });
    }

    changePage (e) {
        e.preventDefault();

        let newPage = parseInt($(e.currentTarget).attr('data-page'));
        if ($(e.currentTarget).attr('data-page') === 'previous') {
            newPage = Math.max(0, this.state.page - 1);
        }
        if ($(e.currentTarget).attr('data-page') === 'next') {
            newPage = Math.min(this.state.pagesURL.length - 1, this.state.page + 1);
        }

        this.setState({
            page: newPage
        });
    }

    static imageClick (e) {
        let offset = $(e.currentTarget).offset();

        if (e.clientX - offset.left < $(e.currentTarget).width() / 2) {
            // if we clicked on the left side, we go on the previous page
            $('[data-page="previous"]').trigger('click');
        } else {
            // if we clicked on the right side, we go on the next page
            $('[data-page="next"]').trigger('click');
        }
    }

    render () {
        let image;
        if (this.state.images[this.state.page]) {
            image = (
                <img className="img-responsive img-page" src={this.state.images[this.state.page].src} onClick={ReaderPage.imageClick} />
            );
        } else {
            image = (
                <Spinner />
            );
        }
        return (
            <div>
                <div className="text-center">
                    <h3>{this.state.chapter.name}</h3>
                    <Paginator pages={this.state.pagesURL} page={this.state.page} loadedImages={this.state.images} handler={this.changePage} />
                    {image}
                    <Paginator pages={this.state.pagesURL} page={this.state.page} loadedImages={this.state.images} handler={this.changePage} />
                </div>
            </div>
        );
    }
}

module.exports = ReaderPage;
