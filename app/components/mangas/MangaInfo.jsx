import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Overdrive from 'react-overdrive';
import _ from 'lodash';
import { shell } from 'electron';
import { Button, Typography } from 'material-ui';
import { Grade as GradeIcon, OpenInNew as OpenInNewIcon } from 'material-ui-icons';

import Spinner from '../spinner/Spinner';
import styles from './mangaInfo.scss';

export default class MangaInfo extends Component {
    constructor (props) {
        super(props);

        // we bind 'this' to handleResize()
        this.openExternal = this.openExternal.bind(this);
    }

    openExternal (e) {
        e.preventDefault();
        console.log(this.props);
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
                <table className={styles.table}>
                    <tbody>
                        {fieldsToRender.map(function (field, index) {
                            return (
                                <tr key={index}>
                                    <th>{_.capitalize(field)}</th>
                                    <td>{self.props.manga[field]}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            );
        }

        return (
            <div>
                <Typography type="headline">{this.props.manga.title}</Typography>
                <Overdrive id={this.props.manga.id} duration={400}>
                    <img src={this.props.manga.thumbnailUrl} />
                </Overdrive>
                {render}
                <Button fab color={(this.props.manga.inLibrary ? 'primary' : 'default')} onClick={this.props.toggleLibrary}>
                    <GradeIcon />
                </Button>
                <Button fab color="primary" onClick={this.openExternal}>
                    <OpenInNewIcon />
                </Button>
            </div>
        );
    }
}

MangaInfo.propTypes = {
    manga: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    toggleLibrary: PropTypes.func.isRequired
};
