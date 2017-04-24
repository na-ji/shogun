/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { CatalogList } from './components';
import { App, ReaderPage, CatalogPage, MangaPage, HomePage } from './containers';

export default (
    <Router>
        <App>
            <Switch>
                <Route path="/" component={HomePage} />
                <Route path="catalogs" component={CatalogList} />
                <Route path="/catalog/:catalogName" component={CatalogPage} />
                <Route path="/manga/:mangaId" component={MangaPage} />
                <Route path="/chapter/:chapterId" component={ReaderPage} />
            </Switch>
        </App>
    </Router>
);
