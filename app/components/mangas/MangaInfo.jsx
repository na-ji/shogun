import React, { Component, PropTypes } from 'react';
import Overdrive from 'react-overdrive';
import _ from 'lodash';
import { shell } from 'electron';

import Spinner from '../spinner/Spinner';

export default class MangaInfo extends Component {
    constructor () {
        super();

        // we bind 'this' to handleResize()
        this.openExternal = this.openExternal.bind(this);
    }

    openExternal (e) {
        e.preventDefault();
        shell.openExternal(this.props.manga.url);
    }

    render () {
        let fieldsToRender = [];
        let self = this;

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
                        <td><a target="_blank" href="#!" onClick={this.openExternal}><i className="material-icons">open_in_new</i></a></td>
                    </tr>
                    </tbody>
                </table>
            );
        }

        return (
            <div>
                <h3>{this.props.manga.title}</h3>
                <Overdrive id={this.props.manga.id} duration={400}>
                    <img src={this.props.manga.thumbnail_url} />
                </Overdrive>
                {render}
                <button onClick={this.props.toggleLibrary} className={`btn btn-fab ${(this.props.manga.in_library ? ' btn-primary' : '')}`}>
                    <i className="material-icons">grade</i>
                </button>
            </div>
        );
    }
}

MangaInfo.propTypes = {
    manga: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    toggleLibrary: PropTypes.func.isRequired
};
