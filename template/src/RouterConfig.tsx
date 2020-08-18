import React from 'react';
import Router, { Route } from '../lib/Router';

import IndexPage from './routes/IndexPage';

const routes: Route[] = [
    {
        component: IndexPage,
        path: '/',
    },
];

export default () => (
    <Router routes={routes}/>
);
