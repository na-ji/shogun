import React from 'react';
import { render } from 'react-dom'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
import { HomePage, AboutPage, ContactPage } from './pages';

const App = React.createClass({
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
                            <Link className="navbar-brand" to="/">Brand</Link>
                        </div>
                        <div className="navbar-collapse collapse navbar-responsive-collapse">
                            <ul className="nav navbar-nav">
                                <li class="active"><Link to="/about" activeClassName="active">About</Link></li>
                                <li><Link to="/contact" activeClassName="active">Contact</Link></li>
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
});

render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={HomePage} />
            <Route path="about" component={AboutPage} />
            <Route path="contact" component={ContactPage} />
        </Route>
    </Router>
), document.getElementById('wrapper'));
