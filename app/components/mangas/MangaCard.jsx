import React from 'react';
import Overdrive from 'react-overdrive';

import styles from './mangaCard.less';

export default class MangaCard extends React.Component {
    render () {
        let inlineStyle = {
            backgroundImage: 'url(' + this.props.manga.thumbnailUrl + ')'
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
