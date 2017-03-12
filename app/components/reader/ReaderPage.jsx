import React, { Component, PropTypes } from 'react';
import Pagination from './Pagination';
import Spinner from '../spinner/Spinner';
import $ from 'jquery';
import styles from './pagination.less';

/* global Image */
class ReaderPage extends Component {
    constructor (props) {
        super(props);

        this.changePage = this.changePage.bind(this);
    }

    componentDidMount () {
        const { fetchPagesIfNeeded, manga, chapter, pages } = this.props;
        fetchPagesIfNeeded(manga, chapter);
    }

    componentWillUnmount () {
        const { cancelRequest } = this.props;
        cancelRequest();
    }

    changePage (e) {
        e.preventDefault();
        const { changePage } = this.props;

        changePage($(e.currentTarget).attr('data-page'));
    }

    static imageClick (e) {
        let offset = $(e.currentTarget).offset();

        if (e.clientX - offset.left < $(e.currentTarget).width() / 2) {
            // if we clicked on the left side, we go on the previous page
            $('[data-page="previous"]:first').trigger('click');
        } else {
            // if we clicked on the right side, we go on the next page
            $('[data-page="next"]:first').trigger('click');
        }
    }

    render () {
        const { pages, images, chapter } = this.props;

        let image;
        if (images.images[pages.currentPage]) {
            image = (
                <img className={styles.imgPage + ' img-responsive'} src={images.images[pages.currentPage].src} onClick={ReaderPage.imageClick} />
            );
        } else {
            image = (
                <Spinner />
            );
        }
        let pagination = (
            <Pagination pages={pages.pagesUrl} page={pages.currentPage} loadedImages={images.images} handler={this.changePage} />
        );
        return (
            <div>
                <div className={styles.container + ' text-center'}>
                    <h3>{chapter.name}</h3>
                    {pagination}
                    {image}
                    {pagination}
                </div>
            </div>
        );
    }
}

ReaderPage.propTypes = {
    images: PropTypes.object.isRequired,
    pages: PropTypes.object.isRequired,
    manga: PropTypes.object.isRequired,
    chapter: PropTypes.object.isRequired,
    fetchPagesIfNeeded: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    cancelRequest: PropTypes.func.isRequired
};

module.exports = ReaderPage;
