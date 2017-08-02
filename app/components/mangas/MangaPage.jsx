import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Grid } from 'material-ui';

import MangaInfo from './MangaInfo';
import ChapterList from '../chapters/ChapterList';

class MangaPage extends Component {
    componentWillMount () {
        const { fetchInfosIfNeeded, manga } = this.props;

        fetchInfosIfNeeded(manga);
    }

    render () {
        const { state, toggleLibrary, updateChapters, markChaptersRead, push } = this.props;

        return (
            <Grid container gutter={24}>
                <Grid item xs={12} sm={5} md={4} lg={3}>
                    <MangaInfo manga={state.manga} loading={state.infoLoading} toggleLibrary={toggleLibrary} />
                </Grid>
                <Grid item xs={12} sm={7} md={8} lg={9}>
                    <ChapterList
                        manga={state.manga}
                        chapters={state.manga.chapters}
                        loading={_.isNil(state.chapterLoading) ? true : state.chapterLoading}
                        push={push}
                        markChaptersRead={markChaptersRead}
                        updateChapters={updateChapters}
                    />
                </Grid>
            </Grid>
        );
    }
}

MangaPage.propTypes = {
    state: PropTypes.object.isRequired,
    manga: PropTypes.object.isRequired,
    fetchInfosIfNeeded: PropTypes.func.isRequired,
    toggleLibrary: PropTypes.func.isRequired,
    markChaptersRead: PropTypes.func.isRequired,
    updateChapters: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
};

module.exports = MangaPage;
