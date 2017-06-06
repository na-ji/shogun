const fs = require('fs');
const path = require('path');

const request = (url, callback) => {
    // console.log(url);
    const file = encodeURIComponent(url.trim());
    // console.log(file);
    const filePath = path.resolve(__dirname, `../__mockData__/${file}.html`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err, null, null);
        }

        return callback(null, null, data);
    });
};

request.defaults = jest.fn(() => {
    return request;
});

export default request;
