import { spy } from 'sinon';

jest.mock('electron-rxdb');
jest.mock('../../app/utils/manga-manager');

import * as actions from '../../app/actions/manga';
import { TOGGLE_MANGA_TO_LIBRARY } from '../../app/actions/library';

describe('manga actions', () => {
    it('should mark chapters read', () => {
        const action = actions.markChaptersRead({}, [{read: false}, {read: true}]);
        expect(action).toBeInstanceOf(Function);
        const dispatch = spy();

        action(dispatch);
        expect(dispatch.calledWithMatch({ type: actions.MARK_CHAPTERS_READ })).toBe(true);
    });

    it('should toggle manga to library', () => {
        const action = actions.toggleLibrary();
        expect(action).toBeInstanceOf(Function);
        const dispatch = spy();
        const getState = () => ({ manga: { manga: {} } });

        action(dispatch, getState);
        expect(dispatch.calledWith({ type: actions.MANGA_TOGGLE_LIBRARY })).toBe(true);
        expect(dispatch.calledWith({ type: TOGGLE_MANGA_TO_LIBRARY, manga: {} })).toBe(true);
    });

    it('should fetch infos if needed', () => {
        const manga = { id: 'yolo', detailsFetched: false };
        const action = actions.fetchInfosIfNeeded(manga);
        expect(action).toBeInstanceOf(Function);
        const dispatch = spy();
        const getState = () => ({ manga: { manga: {id: 'swag'} } });

        action(dispatch, getState);
        expect(dispatch.calledOnce).toBe(true);

        const fetchInfos = dispatch.args[0][0];
        expect(fetchInfos).toBeInstanceOf(Function);
        const dispatch2 = spy();
        const getState2 = () => ({ manga: { manga: {} } });

        fetchInfos(dispatch2, getState2);
        expect(dispatch2.calledWithMatch({ type: actions.LOAD_MANGA, manga })).toBe(true);
    });

    it('should not fetch infos if not needed', () => {
        const action = actions.fetchInfosIfNeeded({id: 'swag'});
        expect(action).toBeInstanceOf(Function);
        const dispatch = spy();
        const getState = () => ({ manga: { manga: {id: 'swag'} } });

        action(dispatch, getState);
        expect(dispatch.notCalled).toBe(true);
    });

    it('should update chapters', () => {
        const action = actions.updateChapters();
        expect(action).toBeInstanceOf(Function);
        const dispatch = spy();
        const getState = () => ({ manga: { manga: {} } });

        action(dispatch, getState);
        expect(dispatch.calledWith({ type: actions.REFRESH_CHAPTERS })).toBe(true);
    });
});
