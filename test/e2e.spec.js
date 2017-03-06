import { Application } from 'spectron';
import electronPath from 'electron';
import path from 'path';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('main window', function spec () {
    beforeAll(async () => {
        this.app = new Application({
            path: electronPath,
            startTimeout: 10000,
            waitTimeout: 10000,
            args: [path.join(__dirname, '..', 'app')]
        });

        return this.app.start();
    });

    afterAll(() => {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });

    it('should open window', async () => {
        const {client, browserWindow} = this.app;

        client.waitUntilWindowLoaded().getWindowCount().then(function (count) {
            expect(count).toBe(1);
            const title = browserWindow.getTitle();
            expect(title).toBe('Shogun Manga Reader');
        });
    });
});
