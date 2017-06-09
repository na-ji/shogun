import { spy } from 'sinon';

jest.mock('electron-rxdb');
jest.mock('../../app/utils/manga-manager');

import * as actions from '../../app/actions/reader';

describe('reader actions', () => {
    it('should cancel request', () => {
        expect(actions.cancelRequest()).toMatchSnapshot();
    });

    it('should fetch pages if needed', (done) => {
        const manga = {id: 'manga'};
        const chapter = {id: 'chapter'};
        const fetchPagesIfNeeded = actions.fetchPagesIfNeeded(manga, chapter);

        const dispatch = spy();
        const getState = () => ({ reader: { pages: { chapterId: null } } });
        fetchPagesIfNeeded(dispatch, getState);

        const fetchPages = dispatch.args[0][0];
        const dispatch2 = spy();
        fetchPages(dispatch2);
        setTimeout(() => {
            expect(dispatch2.callCount).toBe(5);
            expect(dispatch2.calledWithMatch({ type: actions.REQUEST_PAGES_URL })).toBe(true);
            expect(dispatch2.calledWithMatch({ type: actions.INIT_IMAGES, images: [] })).toBe(true);
            expect(dispatch2.calledWithMatch({
                type: actions.RECEIVE_PAGES_URL,
                pagesUrl: new Array(5),
                chapterId: 'chapter'
            })).toBe(true);
            expect(dispatch2.calledWithMatch({
                type: actions.INIT_IMAGES,
                images: new Array(5)
            })).toBe(true);
            done();
        }, 100);
    });

    // it('should fetch images if pages are already fetched', (done) => {
    //     const manga = {id: 'manga'};
    //     const chapter = {id: 'chapter'};
    //     const fetchPagesIfNeeded = actions.fetchPagesIfNeeded(manga, chapter);
    //
    //     const dispatch = spy();
    //     const getState = () => ({ reader: { pages: { chapterId: 'chapter' } } });
    //     fetchPagesIfNeeded(dispatch, getState);
    //
    //     const fetchImage = dispatch.args[0][0];
    //     const dispatch2 = spy();
    //     const getState2 = () => ({
    //         reader: {
    //             pages: { chapterId: 'chapter', pagesUrl: ['https://swag.army/1', 'https://swag.army/2'] },
    //             images: { images: [], cancelRequest: false, imageFetching: 0 }
    //         }
    //     });
    //     fetchImage(dispatch2, getState2);
    //     setTimeout(() => {
    //         console.log(dispatch2.args);
    //         console.log(dispatch2.callCount);
    //         done();
    //     }, 100);
    // });
});
