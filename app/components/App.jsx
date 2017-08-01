import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, MuiThemeProvider, Grid } from 'material-ui';
import { createMuiTheme, createPalette, withStyles, createStyleSheet } from 'material-ui/styles';
import { ArrowBack as ArrowBackIcon } from 'material-ui-icons';
import { teal } from 'material-ui/colors';

const theme = createMuiTheme({
    palette: createPalette({
        primary: teal
    })
});

const styleSheet = createStyleSheet({
    grid: {
        padding: '5px',
        marginTop: '5px',
        width: '100%'
    }
});

class App extends Component {
    constructor (props) {
        super(props);

        this.goBack = this.goBack.bind(this);
    }

    goBack () {
        const { goingBack, goBack } = this.props;
        goingBack();
        goBack();
    }

    render () {
        const { canGoBack } = this.props;

        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <AppBar position="static">
                        <Toolbar>
                            {canGoBack && <IconButton color="contrast" aria-label="Previous" onClick={this.goBack}><ArrowBackIcon /></IconButton>}
                            <Link to="/"><Button color="contrast">Shogun</Button></Link>
                            <NavLink to="/catalogs" activeClassName="active"><Button color="contrast">Catalogs</Button></NavLink>
                        </Toolbar>
                    </AppBar>
                    <Grid container className={this.props.classes.grid}>
                        <Grid item sm={12}>
                            {this.props.children}
                        </Grid>
                    </Grid>
                </div>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    canGoBack: PropTypes.bool.isRequired,
    goingBack: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

module.exports = withStyles(styleSheet)(App);
