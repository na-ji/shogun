import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import _ from 'lodash';
import 'select2';

import Pagination from './Pagination';
import Spinner from '../spinner/Spinner';
import styles from './pagination.scss';

/* global Image */
class ReaderPage extends Component {
    constructor (props) {
        super(props);

        this.changePage = this.changePage.bind(this);
    }

    componentDidMount () {
        const { fetchPagesIfNeeded, manga, chapter, push } = this.props;
        fetchPagesIfNeeded(manga, chapter);

        let data = _.map(
            _.orderBy(manga.chapters, ['number', 'publishedAt'], ['desc', 'desc']),
            (chapter) => {
                return {id: chapter.id, text: chapter.title};
            }
        );

        $('#chapterSelect')
            .select2({
                theme: 'bootstrap',
                data: data
            })
            .val(chapter.id).trigger('change')
            .on('change', () => {
                let id = $('#chapterSelect').val();
                if (id !== chapter.id) {
                    let chapter = _.find(manga.chapters, {id: id});
                    // we move to another page
                    push({
                        pathname: `/chapter/${chapter.id}`,
                        state: {chapter: chapter, manga: manga}
                    });
                }
            })
        ;

        $('.select2-container--bootstrap').css('display', 'inline-block');
    }

    componentWillReceiveProps (nextProps) {
        const { chapter, cancelRequest, fetchPagesIfNeeded } = this.props;
        if (chapter.id !== nextProps.chapter.id) {
            cancelRequest();
            fetchPagesIfNeeded(nextProps.manga, nextProps.chapter);
            $('#chapterSelect').val(nextProps.chapter.id).trigger('change');
        }
    }

    componentWillUnmount () {
        const { cancelRequest } = this.props;
        cancelRequest();
    }

    changePage (e) {
        e.preventDefault();
        const { changePage, manga } = this.props;

        changePage($(e.currentTarget).attr('data-page'), manga);
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
        const { pages, images } = this.props;

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
                    <select id="chapterSelect">
                    </select>
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
    go: PropTypes.func.isRequired,
    cancelRequest: PropTypes.func.isRequired
};

module.exports = ReaderPage;
