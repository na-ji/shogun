import React from 'react';
import { Button } from 'material-ui';
import {
    FirstPage as FirstPageIcon,
    LastPage as LastPageIcon,
    NavigateBefore as NavigateBeforeIcon,
    NavigateNext as NavigateNextIcon
} from 'material-ui-icons';

import styles from './pagination.scss';

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
                <nav className={styles.pagination}>
                    <Button
                        dense
                        disabled={self.props.page === 0}
                        onClick={this.props.handler}
                        data-page="previous"
                    >
                        <NavigateBeforeIcon />
                    </Button>
                    {pagesDisplayed.map(function (page, index) {
                        if (page === '...') {
                            return (
                                <Button
                                    dense
                                    key={index}
                                    disabled
                                    onClick={self.props.handler}
                                    data-page="none"
                                >
                                    ...
                                </Button>
                            );
                        }
                        return (
                            <Button
                                dense
                                key={index}
                                className={self.props.loadedImages[offset + index] ? styles.loaded : ''}
                                color={self.props.page === offset + index ? 'accent' : 'default'}
                                onClick={self.props.handler}
                                data-page={offset + index}
                            >
                                {offset + index + 1}
                            </Button>
                        );
                    })}
                    <Button
                        dense
                        disabled={self.props.page === this.props.pages.length - 1}
                        onClick={this.props.handler}
                        data-page="next"
                    >
                        <NavigateNextIcon />
                    </Button>
                </nav>
            </div>
        );
    }
}

module.exports = Pagination;
