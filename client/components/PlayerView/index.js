import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist'
import reducer from './reducer'
import PlayerView from './PlayerView';
import './style.css';

function configureStore(initialState, reducer) {
    const store = createStore(reducer, undefined,
        compose(
            applyMiddleware(thunk),
            //autoRehydrate(),
            typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f,
        )
    );
    return store;
}

let store = configureStore({}, reducer);

persistStore(store, { blacklist: ['routing']});

const Wrapper = ({}) => {
  return <Provider store={store}>
    <div className="playerView">
      <div className="inner">
        <PlayerView  />
      </div>
    </div>

  </Provider>
};

export default Wrapper;
