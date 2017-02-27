var catalogManager = require('../../app/utils/catalog-manager');
var parser = require('../../app/utils/site-parser');

catalogManager.getCatalogList().forEach(function (catalog) {
    describe('parser for ' + catalog.name, function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

        var manga;
        describe('getPopularMangaList', function () {
            let response;
            it('expect response to be an object with keys', function (done) {
                parser.getPopularMangaList(catalog).then(function (resp) {
                    response = resp;
                    expect(response).toEqual(expect.objectContaining({
                        mangas: expect.any(Array),
                        has_next: expect.any(Boolean),
                        next_url: expect.any(String)
                    }));
                    manga = response.mangas[0];
                    done();
                }).catch(function (error) {
                    console.log(error);
                    expect(error).toBe(null);
                    done();
                });
            });
        });

        describe('getMangaDetail', function () {
            let response;
            it('expect manga to be an object with keys', function (done) {
                parser.getMangaDetail(catalog, manga).then(function (resp) {
                    response = resp;
                    expect(response).toEqual(expect.objectContaining({
                        url: expect.any(String),
                        in_library: expect.any(Boolean),
                        id: expect.any(String),
                        catalog: expect.any(String),
                        thumbnail_url: expect.any(String)
                    }));
                    manga = response;
                    done();
                }).catch(function (error) {
                    console.log(error);
                    expect(error).toBe(null);
                    done();
                });
            });
        });

        var chapter;
        describe('getChapterList', function () {
            it('expect chapters to be an array', function (done) {
                parser.getChapterList(catalog, manga).then(function (chapters) {
                    expect(chapters).toEqual(expect.any(Array));
                    expect(chapters.length).toBeGreaterThanOrEqual(1);
                    if (chapters.length) {
                        expect(chapters[0]).toEqual(expect.objectContaining({
                            manga: expect.any(String),
                            read: expect.any(Boolean),
                            url: expect.any(String),
                            name: expect.any(String),
                            date: expect.any(Date),
                            id: expect.any(String),
                            chapter_number: expect.any(Number)
                        }));
                    }
                    chapter = chapters[0];
                    done();
                }).catch(function (error) {
                    console.log(error);
                    expect(error).toBe(null);
                    done();
                });
            });
        });

        var page;
        describe('getPageList', function () {
            it('expect pages to be an array', function (done) {
                parser.getPageList(catalog, chapter).then(function (pages) {
                    expect(pages).toEqual(expect.any(Array));
                    expect(pages.length).toBeGreaterThanOrEqual(1);
                    page = pages[0];
                    done();
                }).catch(function (error) {
                    console.log(error);
                    expect(error).toBe(null);
                    done();
                });
            });
        });

        describe('getImageURL', function () {
            it('expect url to be a string', function (done) {
                parser.getImageURL(catalog, page).then(function (imageURL) {
                    expect(imageURL).toEqual(expect.any(String));
                    done();
                }).catch(function (error) {
                    console.log(error);
                    expect(error).toBe(null);
                    done();
                });
            });
        });
    });
});
