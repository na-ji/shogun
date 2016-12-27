'use babel';
import React from 'react';
import { Link } from 'react-router';
import ChapterRow from './ChapterRow';
import Spinner from '../Spinner';

/* global $ */
class ChapterList extends React.Component {
    constructor () {
        super();
        this.state = {
            style: {
                height: $(window).height() - $('.navbar').outerHeight() - 20
            }
        };

        // we bind 'this' to handleResize()
        this.handleResize = this.handleResize.bind(this);
    }

    handleResize (e) {
        this.setState({style: {height: $(window).height() - $('.navbar').outerHeight() - 20}});
    }

    componentDidMount () {
        window.addEventListener('resize', this.handleResize);
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
            render = (
                <div className="list-group">
                    {this.props.chapters.map(function (chapter, index) {
                        return (
                            <Link to={`/`} className="list-group-item" key={index}>
                                <ChapterRow chapter={chapter} />
                            </Link>
                        );
                    })}
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
