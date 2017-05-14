/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';

import { CatalogList } from './components';
import { App, ReaderPage, CatalogPage, MangaPage, HomePage } from './containers';

export default () => (
    <App>
        <Switch>
            <Route exact path="/catalogs" component={CatalogList} />
            <Route exact path="/catalog/:catalogName" component={CatalogPage} />
            <Route exact path="/manga/:mangaId" component={MangaPage} />
            <Route exact path="/chapter/:chapterId" component={ReaderPage} />
            <Route exact path="/" component={HomePage} />
        </Switch>
    </App>
);
