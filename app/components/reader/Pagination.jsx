import React from 'react';
import _ from 'lodash';
import { Button } from 'material-ui';
import {
    NavigateBefore as NavigateBeforeIcon,
    NavigateNext as NavigateNextIcon
} from 'material-ui-icons';

import styles from './pagination.scss';

class Pagination extends React.Component {
    render () {
        let self = this;
        let pagesDisplayed = [];
        let numberDisplayed = 20;

        // calculate the pages to display, with '...' to not display more than numberDisplayed
        if (this.props.pages.length > numberDisplayed) {
            pagesDisplayed.push(1);

            let offset = 2;
            if (this.props.page > numberDisplayed / 2) {
                pagesDisplayed.push('...');
                offset = 3;
            }

            let min = Math.max(this.props.page - numberDisplayed / 2 + 1, offset);

            if (this.props.page + numberDisplayed / 2 > this.props.pages.length) {
                min = Math.max(this.props.pages.length - numberDisplayed, offset);
            }

            let max = Math.min(min + numberDisplayed + 1, this.props.pages.length);

            pagesDisplayed = pagesDisplayed.concat(
                _.range(min, max)
            );

            if (this.props.page + numberDisplayed / 2 < this.props.pages.length) {
                pagesDisplayed.push('...');
            }

            pagesDisplayed.push(this.props.pages.length);
        } else {
            pagesDisplayed = this.props.pages;
        }

        return (
            <div>
                <nav className={styles.pagination}>
                    <Button
                        dense
                        disabled={this.props.page === 0}
                        onClick={this.props.handler}
                        data-page="previous"
                        className={styles.button}
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
                                    className={styles.button}
                                >
                                    ...
                                </Button>
                            );
                        }
                        let color = 'default';
                        if (self.props.page === page - 1) {
                            color = 'accent';
                        } else if (self.props.loadedImages[page - 1]) {
                            color = 'primary';
                        }
                        return (
                            <Button
                                dense
                                key={index}
                                color={color}
                                onClick={self.props.handler}
                                data-page={page - 1}
                                className={styles.button}
                            >
                                {page}
                            </Button>
                        );
                    })}
                    <Button
                        dense
                        disabled={this.props.page === this.props.pages.length - 1}
                        onClick={this.props.handler}
                        data-page="next"
                        className={styles.button}
                    >
                        <NavigateNextIcon />
                    </Button>
                </nav>
            </div>
        );
    }
}

module.exports = Pagination;
