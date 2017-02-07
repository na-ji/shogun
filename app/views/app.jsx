"use babel";
import React from 'react';
import { hashHistory, Link } from 'react-router';

var canGoBack = 0;

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            showBackButton: false,
            goingBack: false
        };

        // we bind 'this' to goBack()
        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        canGoBack--;
        if (canGoBack < 0)
            canGoBack = 0;
        this.setState({ showBackButton: (canGoBack > 0), goingBack: true }, function () {
            // console.log(this.state);
            hashHistory.goBack();
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.goingBack) {
            this.state.goingBack = false;
        } else {
            // console.log(nextProps.location);
            if(nextProps.location.pathname !== this.props.location.pathname) {
                canGoBack++;
            }
            this.state.showBackButton = (canGoBack > 0);
        }
    }

    render() {
        return (
            <div>
                <div className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            {this.state.showBackButton && <a className="navbar-brand go-back" onClick={this.goBack}><i className="fa fa-arrow-left"></i></a>}
                            {/*<Link className="navbar-brand" to="/">Brand</Link>*/}
                        </div>
                        <div className="navbar-collapse collapse navbar-responsive-collapse">
                            <ul className="nav navbar-nav">
                                <li><Link to="/" activeClassName="active">Library</Link></li>
                                <li><Link to="/catalogs" activeClassName="active">Catalogs</Link></li>
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

module.exports = App;
