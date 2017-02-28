import React from 'react';
import Spinner from '../Spinner';
var _ = require('lodash');
const {shell} = require('electron');
var mangaManager = require('../../utils/manga-manager');
var manga = {};

class MangaInfo extends React.Component {
    constructor () {
        super();

        this.state = {
            in_library: false
        };

        // we bind 'this' to handleResize()
        this.openExternal = this.openExternal.bind(this);
        this.toggleLibrary = this.toggleLibrary.bind(this);
    }

    openExternal (e) {
        e.preventDefault();
        shell.openExternal(this.props.manga.url);
    }

    toggleLibrary (e) {
        e.preventDefault();
        mangaManager.toggleInLibrary(manga);
        this.setState({
            in_library: !this.state.in_library
        });
    }

    componentWillReceiveProps (nextProps) {
        manga = nextProps.manga;
        this.setState({
            in_library: manga.in_library
        });
    }

    render () {
        var fieldsToRender = [];
        var self = this;

        if (this.props.manga.author) {
            fieldsToRender.push('author');
        }

        if (this.props.manga.artist) {
            fieldsToRender.push('artist');
        }

        if (this.props.manga.genre) {
            fieldsToRender.push('genre');
        }

        if (this.props.manga.status) {
            fieldsToRender.push('status');
        }

        let render;
        if (this.props.loading) {
            render = (
                <div>
                    <Spinner />
                </div>
            );
        } else {
            render = (
                <table>
                    <tbody>
                    {fieldsToRender.map(function (field, index) {
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
            );
        }

        return (
            <div>
                <h3>{this.props.manga.title}</h3>
                <img src={this.props.manga.thumbnail_url} />
                {render}
                <a href="#!" onClick={this.toggleLibrary} className={`btn btn-fab ${(this.state.in_library ? ' btn-primary' : '')}`}><i className="material-icons">grade</i></a>
            </div>
        );
    }
}

module.exports = MangaInfo;
