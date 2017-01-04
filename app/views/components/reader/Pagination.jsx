'use babel';
import React from 'react';

class Pagination extends React.Component {
    render () {
        let self = this;
        let pagesDisplayed = [];
        let numberDisplayed = 20;
        let offset = 0;
        // calculate the position of the '...'
        if (this.props.pages.length > numberDisplayed) {
            if (this.props.page > numberDisplayed / 2) {
                pagesDisplayed.push('...');
            }

            offset = Math.max(this.props.page - numberDisplayed / 2, 0);
            pagesDisplayed = pagesDisplayed.concat(
                this.props.pages.slice(
                    offset,
                    Math.min(offset + numberDisplayed, this.props.pages.length - 1)
                )
            );

            if (this.props.page + numberDisplayed / 2 + 1 < this.props.pages.length) {
                pagesDisplayed.push('...');
            }
        } else {
            pagesDisplayed = this.props.pages;
        }

        return (
            <div>
                <nav>
                    <ul className="pagination">
                        <li className={(self.props.page === 0 ? 'disabled' : '')} onClick={this.props.handler} data-page="previous">
                            <a href="#!">
                                <span>&laquo;</span>
                            </a>
                        </li>
                        {pagesDisplayed.map(function (page, index) {
                            if (page === '...') {
                                return (
                                    <li key={index} className="disabled" data-page="none" onClick={self.props.handler}>
                                        <a href="#!">...</a>
                                    </li>
                                );
                            }
                            return (
                                <li key={index} className={(self.props.page === offset + index ? 'active ' : '') + (self.props.loadedImages[offset + index] ? 'loaded' : '')} onClick={self.props.handler} data-page={offset + index}>
                                    <a href="#!">{offset + index + 1}</a>
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

module.exports = Pagination;
