import React from 'react';
import ReactList from 'react-list';
import { Link } from 'react-router';
import ChapterRow from './ChapterRow';
import Spinner from '../Spinner';
import _ from 'lodash';
import $ from 'jquery';

class ChapterList extends React.Component {
    constructor () {
        super();
        this.state = {
            style: {
                height: $(window).height() - $('.navbar').outerHeight() - 20
            },
            chapters: []
        };

        // we bind 'this' to handleResize()
        this.handleResize = this.handleResize.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    handleResize (e) {
        this.setState({style: {height: $(window).height() - $('.navbar').outerHeight() - 20}});
    }

    componentDidMount () {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.chapters !== nextProps.chapters) {
            this.setState({
                chapters: _.orderBy(nextProps.chapters, ['chapter_number', 'date'], ['desc', 'desc'])
            });
        }
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.handleResize);
    }

    renderItem (index, key) {
        let chapter = this.state.chapters[index];
        return (
            <Link to={{ pathname: `/chapter/${chapter.id}`, state: { chapter: chapter, manga: this.props.manga, chapters: this.state.chapters } }} className="list-group-item" key={key}>
                <ChapterRow chapter={chapter} />
            </Link>
        );
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
            render = (
                <div className="list-group">
                    <ReactList
                        itemRenderer={this.renderItem}
                        length={this.state.chapters.length}
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

module.exports = ChapterList;
