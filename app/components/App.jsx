import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';

class App extends Component {
    constructor () {
        super();

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
            <div>
                <div className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </button>
                            {canGoBack && <a className="navbar-brand go-back" onClick={this.goBack}><i className="material-icons">arrow_back</i></a>}
                            <Link className="navbar-brand" to="/">Shogun</Link>
                        </div>
                        <div className="navbar-collapse collapse navbar-responsive-collapse">
                            <ul className="nav navbar-nav">
                                <li><NavLink to="/" activeClassName="active">Library</NavLink></li>
                                <li><NavLink to="/catalogs" activeClassName="active">Catalogs</NavLink></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    canGoBack: PropTypes.bool.isRequired,
    goingBack: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
};

module.exports = App;
