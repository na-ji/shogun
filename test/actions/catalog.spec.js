import { spy } from 'sinon';

jest.mock('electron-rxdb');
jest.mock('../../app/utils/manga-manager');

import * as actions from '../../app/actions/catalog';
const catalogName = 'readmangatoday';

describe('catalog actions', () => {
    it('should reset search field', () => {
        expect(actions.resetSearch()).toMatchSnapshot();
    });

    it('should fetch popular mangas', () => {
        const fn = actions.fetchPopularMangas(catalogName);
        expect(fn).toBeInstanceOf(Function);
        const dispatch = spy();
        const getState = () => ({ catalog: { catalogName: null } });
        fn(dispatch, getState);
        expect(dispatch.calledWithMatch({ type: actions.GET_POPULAR_MANGAS, catalogName })).toBe(true);

        const fn2 = dispatch.args[1][0];
        const dispatch2 = spy();
        fn2(dispatch2);
        // More to do, but we need to mock the database OR manga manager
        // expect(dispatch2.calledWithMatch({ type: actions.RECEIVE_MANGAS_LIST })).toBe(true);
    });

    it('should load more mangas', () => {
        const fn = actions.fetchMore();
        expect(fn).toBeInstanceOf(Function);
        const dispatch = spy();
        const getState = () => ({ catalog: { hasNext: true, catalogName } });
        fn(dispatch, getState);
        expect(dispatch.calledWithMatch({ type: actions.LOAD_MORE })).toBe(true);

        const fn2 = dispatch.args[1][0];
        const dispatch2 = spy();
        fn2(dispatch2);
    });

    it('should search for mangas', () => {
        const fn = actions.searchManga('naruto');
        expect(fn).toBeInstanceOf(Function);
        const dispatch = spy();
        const getState = () => ({ catalog: { query: null, catalogName } });
        fn(dispatch, getState);
        expect(dispatch.calledWithMatch({ type: actions.SEARCH, query: 'naruto' })).toBe(true);

        const fn2 = dispatch.args[1][0];
        const dispatch2 = spy();
        fn2(dispatch2);
    });
});
