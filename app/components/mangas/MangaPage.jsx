import React, { Component, PropTypes } from 'react';

import MangaInfo from './MangaInfo';
import ChapterList from '../chapters/ChapterList';

class MangaPage extends Component {
    componentWillMount () {
        const { fetchInfosIfNeeded, mangaFromRouter } = this.props;

        fetchInfosIfNeeded(mangaFromRouter);
    }

    render () {
        const { state } = this.props;

        return (
            <div>
                <div className="col-sm-5 col-md-4 col-lg-3">
                    <MangaInfo manga={state.manga} loading={state.infoLoading} />
                </div>
                <div className="col-sm-7 col-md-8 col-lg-9">
                    <ChapterList manga={state.manga} chapters={state.chapters} loading={state.chapterLoading} />
                </div>
            </div>
        );
    }
}

MangaPage.propTypes = {
    state: PropTypes.object.isRequired,
    mangaFromRouter: PropTypes.object.isRequired,
    fetchInfosIfNeeded: PropTypes.func.isRequired
};

module.exports = MangaPage;
