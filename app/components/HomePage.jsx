import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, Button } from 'material-ui';
import { Refresh as RefreshIcon } from 'material-ui-icons';

import MangaList from './mangas/MangaList';

class HomePage extends Component {
    componentWillMount () {
        const { fetchLibrary } = this.props;

        fetchLibrary();
    }

    render () {
        const { state, refreshLibrary } = this.props;

        return (
            <div>
                <Typography type="headline">
                    Library
                    <Button onClick={refreshLibrary} dense title="Refresh">
                        <RefreshIcon />
                    </Button>
                </Typography>
                <MangaList mangas={state.mangas} loading={!state.loaded} />
            </div>
        );
    }
}

HomePage.propTypes = {
    state: PropTypes.object.isRequired,
    fetchLibrary: PropTypes.func.isRequired,
    refreshLibrary: PropTypes.func.isRequired
};

module.exports = HomePage;
