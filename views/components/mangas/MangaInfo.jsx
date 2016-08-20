"use babel";
import React from 'react';
var _ = require('lodash');
const {shell} = require('electron');

class MangaInfo extends React.Component {
    constructor() {
        super();
        // we bind 'this' to handleResize()
        this.openExternal = this.openExternal.bind(this);
    }

    openExternal(e) {
        e.preventDefault();
        shell.openExternal(this.props.manga.url);
    }

    render() {
        console.log(this.props.manga);

        var fieldsToRender = [];
        var self = this;

        if (this.props.manga.author)
            fieldsToRender.push('author');

        if (this.props.manga.artist)
            fieldsToRender.push('artist');

        if (this.props.manga.genre)
            fieldsToRender.push('genre');

        if (this.props.manga.status)
            fieldsToRender.push('status');

        return (
            <div>
                <h3>{this.props.manga.title}</h3>
                <img src={this.props.manga.thumbnail_url} />
                <table>
                    <tbody>
                        {fieldsToRender.map(function(field, index){
                            return (
                                <tr key={index}>
                                    <th>{_.capitalize(field)}</th>
                                    <td>{self.props.manga[field]}</td>
                                </tr>
                            );
                        })}
                        <tr>
                            <th>URL</th>
                            <td><a target="_blank" href="#!" onClick={this.openExternal}><i className="fa fa-external-link"></i></a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

module.exports = MangaInfo;
