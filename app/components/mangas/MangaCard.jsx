import React from 'react';
import Overdrive from 'react-overdrive';
import { Typography } from 'material-ui';

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
                <Typography className={styles.badge}>
                    { unreadCount }
                </Typography>
            );
        }

        return (
            <Overdrive id={manga.id} duration={400}>
                <div className={styles.manga}>
                    <div className={styles.content} style={inlineStyle}>
                        <div className={styles.title}>
                            <Typography className={styles.text}>{manga.title}</Typography>
                            {badge}
                        </div>
                    </div>
                </div>
            </Overdrive>
        );
    }
}
