import React from 'react';
import { Router, Route, browserHistory, Redirect, IndexRoute } from 'react-router';


import AppContainer from '../containers/AppContainer';
import AdminContainer from '../containers/AdminContainer';

import RoundsList from '../components/RoundsList';
import QuestionsList from '../components/QuestionsList';
import Controller from '../components/Controller';

import TV from '../components/TV';
import PlayerView from '../components/PlayerView';

import MobileController from '../components/MobileController';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <IndexRoute component={PlayerView} />

      <Route path="admin" component={AdminContainer}>
          <IndexRoute component={RoundsList} />
          <Route path="questions/:id" component={QuestionsList} />
          <Route path="controller" component={Controller} />

      </Route>
      <Route path="tv" component={TV} />
      <Route path="mobile" component={MobileController} />
    </Route>
  </Router>
);
