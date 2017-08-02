import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactList from 'react-list';
import _ from 'lodash';
import $ from 'jquery';
import { Typography, List, Button } from 'material-ui';
import { Refresh as RefreshIcon, Sort as SortIcon } from 'material-ui-icons';

import ChapterRow from './ChapterRow';
import Spinner from '../spinner/Spinner';
import styles from './chapter.scss';

class ChapterList extends Component {
    constructor (props) {
        super(props);

        this.state = {
            style: {
                height: $(window).height() - $('header').outerHeight() - _.toSafeInteger($('#headline').outerHeight()) - 55
            },
            chapters: [],
            order: 'desc'
        };
    }

    handleResize () {
        this.setState({style: {height: $(window).height() - $('header').outerHeight() - _.toSafeInteger($('#headline').outerHeight()) - 55}});
    }

    componentDidMount () {
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
        this.reverseOrder = this.reverseOrder.bind(this);
        this.loadChapter = this.loadChapter.bind(this);
        this.loadChapter(this.props.chapters);
    }

    loadChapter (chapters) {
        this.setState({
            chapters: _.orderBy(chapters, ['number', 'publishedAt'], [this.state.order, this.state.order])
        });
    }

    reverseOrder () {
        let newOrder = 'asc';
        if (this.state.order === 'asc') {
            newOrder = 'desc';
        }

        console.log(newOrder);

        this.setState({
            order: newOrder
        }, () => {
            this.loadChapter(this.state.chapters);
        });
    }

    componentWillReceiveProps (nextProps) {
        if (this.state.chapters !== nextProps.chapters) {
            this.loadChapter = this.loadChapter.bind(this);
            this.loadChapter(nextProps.chapters);
        }
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.handleResize);
    }

    render () {
        let render;
        if (this.props.loading) {
            render = (
                <Spinner />
            );
        } else {
            let itemRenderer = (index, key) => {
                if (this.state.chapters && this.state.chapters.length && index in this.state.chapters) {
                    const chapter = this.state.chapters[index];
                    return (
                        <ChapterRow chapter={chapter} manga={this.props.manga} key={key} push={this.props.push} />
                    );
                }
                return '';
            };
            itemRenderer = itemRenderer.bind(this);

            render = (
                <List className="chapter-list" style={this.state.style}>
                    <ReactList
                        itemRenderer={itemRenderer}
                        length={this.props.chapters.length}
                        type="uniform"
                    />
                </List>
            );
        }

        return (
            <div>
                <Typography type="headline" id="headline">
                    {this.props.chapters.length} chapter{(this.props.chapters.length > 1) ? 's' : ''}
                    <Button onClick={this.props.updateChapters} dense title="refresh">
                        <RefreshIcon />
                    </Button>
                    <Button onClick={this.reverseOrder} dense title="sort">
                        <SortIcon className={styles[this.state.order]} />
                    </Button>
                </Typography>
                {render}
            </div>
        );
    }
}

ChapterList.propTypes = {
    chapters: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
    updateChapters: PropTypes.func.isRequired
};

module.exports = ChapterList;
