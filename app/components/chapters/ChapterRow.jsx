import React from 'react';
import moment from 'moment';

import styles from './chapter.scss';

class ChapterRow extends React.Component {
    render () {
        return (
            <div>
                <h4 className={this.props.chapter.read ? styles.read : ''}>
                    {this.props.chapter.title}
                    <span className="pull-right">{moment(this.props.chapter.publishedAt).format('DD-MM-YYYY')}</span>
                </h4>
            </div>
        );
    }
}

module.exports = ChapterRow;
