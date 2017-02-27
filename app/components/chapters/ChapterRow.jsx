'use babel';
import React from 'react';
var moment = require('moment');

class ChapterRow extends React.Component {
    render () {
        return (
            <div>
                <h4>
                    {this.props.chapter.name}
                    <span className="pull-right">{moment(this.props.chapter.date).format('DD-MM-YYYY')}</span>
                </h4>
            </div>
        );
    }
}

module.exports = ChapterRow;
