'use babel';
import React from 'react';

class Paginator extends React.Component {
    render () {
        let self = this;
        return (
            <div>
                <nav>
                    <ul className="pagination">
                        <li className={(self.props.page === 0 ? 'disabled' : '')} onClick={this.props.handler} data-page="previous">
                            <a href="#!">
                                <span>&laquo;</span>
                            </a>
                        </li>
                        {this.props.pages.map(function (pages, index) {
                            return (
                                <li key={index} className={(self.props.page === index ? 'active ' : '') + (self.props.loadedImages[index] ? 'loaded' : '')} onClick={self.props.handler} data-page={index}>
                                    <a href="#!">{index + 1}</a>
                                </li>
                            );
                        })}
                        <li className={(self.props.page === this.props.pages.length - 1 ? 'disabled' : '')} onClick={this.props.handler} data-page="next">
                            <a href="#!">
                                <span>&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}

module.exports = Paginator;
