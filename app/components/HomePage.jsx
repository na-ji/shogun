import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MangaList from './mangas/MangaList';

class HomePage extends Component {
    componentWillMount () {
        const { fetchLibrary } = this.props;

        fetchLibrary();
    }

    render () {
        const { state } = this.props;

        return (
            <div>
                <h3>Library</h3>
                <MangaList mangas={state.mangas} loading={!state.loaded} />
            </div>
        );
    }
}

HomePage.propTypes = {
    state: PropTypes.object.isRequired,
    fetchLibrary: PropTypes.func.isRequired
};

module.exports = HomePage;
