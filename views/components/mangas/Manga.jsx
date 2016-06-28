"use babel";
import React from 'react';

class Manga extends React.Component {
    render() {
        return (
            <div className="card manga">
                <div className="card-height-indicator"></div>

                <div className="card-content">
                    <div className="card-image">
                        <img src={this.props.manga.thumbnail_url}  />
                    </div>

                    <div className="card-body">
                        <p>{this.props.manga.title}</p>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Manga;
