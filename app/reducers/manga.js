import { LOAD_MANGA, RECEIVE_CHAPTERS, RECEIVE_DETAILS } from '../actions/manga';

export default function manga (state = {
    manga: {
        id: ''
    },
    chapters: [],
    infoLoading: true,
    chapterLoading: true
}, action) {
    switch (action.type) {
        case LOAD_MANGA:
            return Object.assign({}, state, {
                manga: action.manga,
                chapters: action.manga.chapters,
                chapterLoading: action.manga.chapters && action.manga.chapters.length === 0,
                infoLoading: !action.manga.detail_fetched
            });
        case RECEIVE_DETAILS:
            return Object.assign({}, state, {
                manga: action.manga,
                infoLoading: false
            });
        case RECEIVE_CHAPTERS:
            return Object.assign({}, state, {
                chapters: action.chapters,
                chapterLoading: false
            });
        default:
            return state;
    }
}
