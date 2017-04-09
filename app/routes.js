// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { CatalogList } from './components';
import { App, ReaderPage, CatalogPage, MangaPage, HomePage } from './containers';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="catalogs" component={CatalogList} />
        <Route path="/catalog/:catalogName" component={CatalogPage} />
        <Route path="/manga/:mangaId" component={MangaPage} />
        <Route path="/chapter/:chapterId" component={ReaderPage} />
    </Route>
);
