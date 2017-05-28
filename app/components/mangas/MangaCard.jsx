import React from 'react';
import Overdrive from 'react-overdrive';

import styles from './mangaCard.scss';

export default class MangaCard extends React.Component {
    render () {
        let { manga } = this.props;
        let inlineStyle = {
            backgroundImage: 'url(' + manga.thumbnailUrl + ')'
        };
        let badge = '';

        let unreadCount = manga.getChapterUnreadCount();
        if (manga.inLibrary && unreadCount) {
            badge = (
                <span className={styles.badge}>
                    { unreadCount }
                </span>
            );
        }

        return (
            <Overdrive id={manga.id} duration={400}>
                <div className={styles.manga + ' card'}>
                    <div className={styles.content} style={inlineStyle}>
                        <div className={styles.title}>
                            <p>{manga.title}</p>
                            {badge}
                        </div>
                    </div>
                </div>
            </Overdrive>
        );
    }
}
