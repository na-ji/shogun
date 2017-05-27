import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactList from 'react-list';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import $ from 'jquery';

import ChapterRow from './ChapterRow';
import Spinner from '../spinner/Spinner';

class ChapterList extends Component {
    constructor (props) {
        super(props);
        // we bind 'this' to handleResize()
        this.state = {
            style: {
                height: $(window).height() - $('.navbar').outerHeight() - 20
            }
            // chapters: []
        };
    }

    handleResize (e) {
        this.setState({style: {height: $(window).height() - $('.navbar').outerHeight() - 20}});
    }

    componentDidMount () {
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.chapters !== nextProps.chapters) {
            this.setState({
                chapters: _.orderBy(nextProps.chapters, ['number', 'publishedAt'], ['desc', 'desc'])
            });
        }
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.handleResize);
    }

    render () {
        let render;
        if (this.props.loading) {
            render = (
                <div className="list-group">
                    <Spinner />
                </div>
            );
        } else {
            let itemRenderer = (index, key) => {
                if (this.state.chapters && this.state.chapters.length && index in this.state.chapters) {
                    const chapter = this.state.chapters[index];
                    return (
                        <Link to={{ pathname: `/chapter/${chapter.id}`, state: { chapter: chapter, manga: this.props.manga } }} className="list-group-item" key={key}>
                            <ChapterRow chapter={chapter} />
                        </Link>
                    );
                }
                return '';
            };
            itemRenderer = itemRenderer.bind(this);

            render = (
                <div className="list-group">
                    <ReactList
                        itemRenderer={itemRenderer}
                        length={this.props.chapters.length}
                        type="uniform"
                    />
                </div>
            );
        }

        return (
            <div className="chapter-list" style={this.state.style}>
                <h3>{this.props.chapters.length} chapter{(this.props.chapters.length > 1) ? 's' : ''}</h3>
                {render}
            </div>
        );
    }
}

ChapterList.propTypes = {
    chapters: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
};

module.exports = ChapterList;
