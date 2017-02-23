var chai = require('chai');
var expect = chai.expect;

var catalogManager = require('../../app/core/catalog-manager');
var parser = require('../../app/core/site-parser');

catalogManager.getCatalogList().forEach(function (catalog) {
    describe('parser for ' + catalog.name, function () {
        this.timeout(0);

        var manga;
        describe('getPopularMangaList', function () {
            let response;
            it('expect response to be an object', function (done) {
                parser.getPopularMangaList(catalog).then(function (resp) {
                    response = resp;
                    expect(response).to.be.an('object');
                    manga = response.mangas[0];
                    done();
                }).catch(function (error) {
                    console.log(error);
                    expect(error).to.be.null;
                    done();
                });
            });
            it('expect response to contains keys', function () {
                expect(response).to.have.all.keys(['mangas', 'has_next', 'next_url']);
                expect(response.mangas).to.be.an('array');
                expect(response.has_next).to.be.a('boolean');
            });
        });

        describe('getMangaDetail', function () {
            let response;
            it('expect manga to be an object', function (done) {
                parser.getMangaDetail(catalog, manga).then(function (resp) {
                    response = resp;
                    expect(response).to.be.an('object');
                    manga = response;
                    done();
                }).catch(function (error) {
                    console.log(error);
                    expect(error).to.be.null;
                    done();
                });
            });
            it('expect manga to contains keys', function () {
                expect(response).to.contain.all.keys(['url', 'in_library', 'title', 'id', 'catalog', 'thumbnail_url']);
                expect(response.url).to.be.a('string');
                expect(response.in_library).to.be.a('boolean');
                expect(response.id).to.be.a('string');
                expect(response.catalog).to.be.a('string');
                expect(response.thumbnail_url).to.be.a('string');
            });
        });

        var chapter;
        describe('getChapterList', function () {
            it('expect chapters to be an array', function (done) {
                parser.getChapterList(catalog, manga).then(function (chapters) {
                    expect(chapters).to.be.an('array');
                    if (chapters.length) {
                        expect(chapters[0]).to.have.all.keys('manga', 'read', 'url', 'name', 'date', 'id', 'chapter_number');
                    }
                    chapter = chapters[0];
                    done();
                }).catch(function (error) {
                    console.log(error);
                    expect(error).to.be.null;
                    done();
                });
            });
        });

        var page;
        describe('getPageList', function () {
            it('expect pages to be an array', function (done) {
                parser.getPageList(catalog, chapter).then(function (pages) {
                    expect(pages).to.be.an('array');
                    expect(pages).to.have.length.above(1);
                    page = pages[0];
                    done();
                }).catch(function (error) {
                    console.log(error);
                    expect(error).to.be.null;
                    done();
                });
            });
        });

        describe('getImageURL', function () {
            it('expect url to be a string', function (done) {
                parser.getImageURL(catalog, page).then(function (imageURL) {
                    expect(imageURL).to.be.a('string');
                    done();
                }).catch(function (error) {
                    console.log(error);
                    expect(error).to.be.null;
                    done();
                });
            });
        });
    });
});
