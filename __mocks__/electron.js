function getGlobal (global) {
    if (global === 'dataDirectory') {
        return '/tmp';
    }

    return '';
}

module.exports = {
    require: jest.fn(),
    match: jest.fn(),
    app: jest.fn(),
    remote: {getGlobal: getGlobal},
    dialog: jest.fn()
};
