// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './views/app';
import { HomePage, CatalogList, CatalogPage, ContactPage, MangaPage } from './views/components';
import { ReaderPage } from './views/containers';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="catalogs" component={CatalogList} />
        <Route path="/catalog/:catalogName" component={CatalogPage}/>
        <Route path="/manga/:mangaId" component={MangaPage}/>
        <Route path="/chapter/:chapterId" component={ReaderPage} />
        <Route path="contact" component={ContactPage} />
    </Route>
);
