import 'babel-polyfill';

require('jsdom-global')('<!doctype html><html><body></body></html>');

global.window = document.defaultView;
global.navigator = global.window.navigator;
window.localStorage = window.sessionStorage = {
    getItem(key) {
        return this[key];
    },
    setItem(key, value) {
        this[key] = value;
    },
    removeItem(key) {
        this[key] = undefined;
    }
};
