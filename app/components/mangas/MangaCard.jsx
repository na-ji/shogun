import React from 'react';
import Overdrive from 'react-overdrive';

import styles from './mangaCard.less';

class MangaCard extends React.Component {
    render () {
        let inlineStyle = {
            backgroundImage: 'url(' + this.props.manga.thumbnail_url + ')'
        };

        return (
            <Overdrive id={this.props.manga.id} duration={400}>
                <div className={styles.manga + ' card'}>
                    <div className={styles.mangaContent} style={inlineStyle}>
                        <div className={styles.mangaTitle}>
                            <p>{this.props.manga.title}</p>
                        </div>
                    </div>
                </div>
            </Overdrive>
        );
    }
}

module.exports = MangaCard;
