import { LOAD_MANGA, RECEIVE_CHAPTERS, RECEIVE_DETAILS, MANGA_TOGGLE_LIBRARY } from '../actions/manga';

export default function manga (state = {
    manga: {
        id: '',
        chapters: []
    },
    infoLoading: true,
    chapterLoading: true
}, action) {
    switch (action.type) {
        case LOAD_MANGA:
            return Object.assign({}, state, {
                manga: action.manga,
                chapterLoading: action.manga.chapters && action.manga.chapters.length === 0,
                infoLoading: !action.manga.detailsFetched
            });
        case MANGA_TOGGLE_LIBRARY:
            let manga = Object.assign({}, state.manga, {
                inLibrary: !state.manga.inLibrary
            });

            return Object.assign({}, state, {
                manga: manga
            });
        case RECEIVE_DETAILS:
            return Object.assign({}, state, {
                manga: action.manga,
                infoLoading: false
            });
        case RECEIVE_CHAPTERS:
            return Object.assign({}, state, {
                chapterLoading: false
            });
        default:
            return state;
    }
}
