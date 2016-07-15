"use babel";
import React from 'react';

class Manga extends React.Component {
    render() {
        var inlineStyle = {
            backgroundImage: 'url(' + this.props.manga.thumbnail_url + ')'
        };

        return (
            <div className="manga card">
                <div className="manga-content" style={inlineStyle}>
                    <div className="manga-title">
                        <p>{this.props.manga.title}</p>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Manga;
