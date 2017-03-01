var fs = require('fs');
var path = require('path');

class CatalogManager {
    constructor () {
        this.catalogs = [];
        this.relative_path = './sites/';
        this.sites_path = path.resolve(__dirname, 'utils/sites') + '/';
        if (process.env.NODE_ENV === 'test') {
            this.sites_path = path.resolve(__dirname, 'sites') + '/';
        }
        this.files_cache = {};
    }

    openFile (name) {
        if (undefined === this.files_cache[name]) {
            this.files_cache[name] = require(this.relative_path + name);
            this.files_cache[name].file = path.basename(name, '.js');
        }

        return this.files_cache[name];
    }

    getCatalogList () {
        if (this.catalogs.length > 0) {
            return this.catalogs;
        }

        let files = fs.readdirSync(this.sites_path);
        let _this = this;
        files.forEach(function (file) {
            // console.log(file);
            if (path.extname(file) === '.js') {
                var catalog = _this.openFile(file);
                // console.log(catalog);
                _this.catalogs.push(catalog);
            }
        });

        return this.catalogs;
    }

    getCatalog (name) {
        return this.openFile(name + '.js');
    }
}

module.exports = new CatalogManager();