"use babel";
import React from 'react';

class ChapterRow extends React.Component {
    render() {
        return (
            <div>
                <h4>
                    {this.props.chapter.name}
                    <span className="pull-right">{this.props.chapter.date}</span>
                </h4>
            </div>
        );
    }
}

module.exports = ChapterRow;
