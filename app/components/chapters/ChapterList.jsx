import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactList from 'react-list';
import _ from 'lodash';
import $ from 'jquery';
import { Typography, List, Button, Checkbox } from 'material-ui';
import { Refresh as RefreshIcon, Sort as SortIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from 'material-ui-icons';

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
            checked: [],
            checkAll: false,
            chapters: [],
            order: 'desc'
        };
    }

    componentDidMount () {
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleCheckAll = this.handleCheckAll.bind(this);
        this.reverseOrder = this.reverseOrder.bind(this);
        this.toggleRead = this.toggleRead.bind(this);
        this.loadChapter = this.loadChapter.bind(this);
        this.loadChapter(this.props.chapters);
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

    handleResize () {
        this.setState({style: {height: $(window).height() - $('header').outerHeight() - _.toSafeInteger($('#headline').outerHeight()) - 55}});
    }

    handleToggle (value) {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked
        });
    }

    handleCheckAll (event, checked) {
        if (checked) {
            this.setState({
                checkAll: true,
                checked: _.map(this.state.chapters, 'id')
            });
        } else {
            this.setState({
                checkAll: false,
                checked: []
            });
        }
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

    toggleRead (read) {
        if (this.state.checked.length > 0) {
            const { markChaptersRead, manga } = this.props;
            const { checked } = this.state;
            const chapters = _.filter(this.state.chapters, (chapter) => {
                return checked.indexOf(chapter.id) > -1;
            });

            markChaptersRead(manga, chapters, read);

            this.setState({
                checked: [],
                checkAll: false
            });
        }
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
                        <ChapterRow
                            key={key}
                            chapter={chapter}
                            manga={this.props.manga}
                            push={this.props.push}
                            handleToggle={this.handleToggle}
                            checked={this.state.checked.indexOf(chapter.id) !== -1}
                        />
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

        let markAsReadButtons;
        let countChecked;

        if (this.state.checked.length > 0) {
            markAsReadButtons = (
                <span>
                    <Button onClick={() => this.toggleRead(true)} dense title="Mark as read">
                        <VisibilityIcon />
                    </Button>
                    <Button onClick={() => this.toggleRead(false)} dense title="Mark as unread">
                        <VisibilityOffIcon />
                    </Button>
                </span>
            );
            countChecked = `${this.state.checked.length} selected`;
        }

        return (
            <div>
                <Typography type="headline" id="headline" className={styles.headline}>
                    {this.props.chapters.length} chapter{(this.props.chapters.length > 1) ? 's' : ''}
                    <Button onClick={this.props.updateChapters} dense title="Refresh">
                        <RefreshIcon />
                    </Button>
                    <Button onClick={this.reverseOrder} dense title="Sort">
                        <SortIcon className={styles[this.state.order]} />
                    </Button>
                    {markAsReadButtons}
                    <span className={styles.checkAll}>
                        <span>
                            {countChecked}
                        </span>
                        <Checkbox
                            onChange={this.handleCheckAll}
                            checked={this.state.checkAll} />
                    </span>
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
    markChaptersRead: PropTypes.func.isRequired,
    updateChapters: PropTypes.func.isRequired
};

module.exports = ChapterList;
