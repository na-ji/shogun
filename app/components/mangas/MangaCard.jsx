import React from 'react';
import styles from './mangaCard.less';

class MangaCard extends React.Component {
    render () {
        var inlineStyle = {
            backgroundImage: 'url(' + this.props.manga.thumbnail_url + ')'
        };

        return (
            <div className={styles.manga + ' card'}>
                <div className={styles.mangaContent} style={inlineStyle}>
                    <div className={styles.mangaTitle}>
                        <p>{this.props.manga.title}</p>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = MangaCard;
