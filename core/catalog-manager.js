var fs   = require('fs');
var path = require('path');
var yaml = require('js-yaml');

var CatalogManager = {
    catalogs: [],
    sites_path: path.resolve(__dirname, 'sites') + '/',
    files_cache: {}
};

CatalogManager.openFile = function(name) {
    if (this.files_cache[name] != undefined) {
        return this.files_cache[name];
    }

    this.files_cache[name] = yaml.safeLoad(fs.readFileSync(this.sites_path + name), 'utf8');

    return this.files_cache[name];
};

CatalogManager.getCatalogList = function() {
    if (this.catalogs.length > 0) {
        return this.catalogs;
    }

    var files = fs.readdirSync(this.sites_path);
    files.forEach(function (file) {
        // console.log(file);
        if (".yml" === path.extname(file)) {
            var catalog = CatalogManager.openFile(file);
            // console.log(catalog);
            CatalogManager.catalogs.push(catalog);
        }
    });

    return this.catalogs;
};

module.exports = CatalogManager;
