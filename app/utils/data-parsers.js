import moment from 'moment';
import _ from 'lodash';

/**
 * Parse string '8 months ago' to Date object
 * @param date string in the format of '8 months ago'
 * @return Date object corresponding
 */
export function parseDateAgo (date) {
    let dateWords = date.toLowerCase().split(' ');

    if (dateWords.length === 3) {
        if (dateWords[1].substr(dateWords[1].length - 1) !== 's') {
            dateWords[1] = dateWords[1] + 's';
        }

        let date = moment().subtract(parseInt(dateWords[0]), dateWords[1]);
        date.millisecond(0).second(0).minute(0).hour(0);

        return date.toDate();
    }

    return new Date(1970, 0, 1);
}

export function trimSpaces (str) {
    if (_.isString(str)) {
        return str.trim().replace(/ +(?= )/g, '');
    }
    return str;
}
