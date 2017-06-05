// We set this var to simulate electron env
process.type = 'renderer';

const rxdb = jest.genMockFromModule('electron-rxdb');

rxdb.RxDatabase.prototype.models = {
    registerDeferred: jest.fn()
};
rxdb.RxDatabase.prototype._query = jest.fn(() => {
    return new Promise((resolve, reject) => resolve());
});

module.exports = rxdb;
