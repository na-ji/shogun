import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ListItem, ListItemText, ListItemSecondaryAction, Checkbox } from 'material-ui';

import styles from './chapter.scss';

class ChapterRow extends React.Component {
    constructor (props) {
        super(props);

        this.goToChapter = this.goToChapter.bind(this);
    }

    goToChapter () {
        const { chapter, manga, push } = this.props;
        push({ pathname: `/chapter/${chapter.id}`, state: { chapter: chapter, manga: manga } });
    }

    render () {
        const { chapter } = this.props;

        return (
            <ListItem dense button onClick={event => this.goToChapter(chapter)}>
                <ListItemText
                    className={chapter.read ? styles.read : ''}
                    primary={chapter.title}
                    secondary={moment(chapter.publishedAt).format('DD-MM-YYYY')}
                />
                <ListItemSecondaryAction>
                    <Checkbox
                        onClick={event => this.props.handleToggle(chapter.id)}
                        checked={this.props.checked}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

ChapterRow.propTypes = {
    chapter: PropTypes.object.isRequired,
    manga: PropTypes.object.isRequired,
    checked: PropTypes.bool.isRequired,
    handleToggle: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
};

module.exports = ChapterRow;
