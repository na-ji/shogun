import { spy } from 'sinon';

jest.mock('../../app/utils/manga-manager');

import * as actions from '../../app/actions/library';

describe('library actions', () => {
    it('should reset toggle manga to library', () => {
        const fn = actions.toggleMangaToLibrary({});
        expect(fn).toBeInstanceOf(Function);
        const dispatch = spy();
        fn(dispatch);
        expect(dispatch.calledWithMatch({ type: actions.TOGGLE_MANGA_TO_LIBRARY })).toBe(true);
    });

    it('should fetch library', () => {
        const fn = actions.fetchLibrary();
        expect(fn).toBeInstanceOf(Function);
        const dispatch = spy();
        const getState = () => ({ library: { loaded: false } });
        fn(dispatch, getState);
        expect(dispatch.calledWithMatch({ type: actions.REQUEST_LIBRARY })).toBe(true);
    });
});
