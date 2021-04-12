import * as React from 'react';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import { createReduxEnhancer } from 'react-native-feedback-reporter';
import {
  compose,
  Middleware,
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';

import App from './src/App';
import { name as appName } from './app.json';
import { userReducers } from './src/userReducers';

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware: Middleware[] = [];

const enhancers = __DEV__
  ? composeEnhancers(applyMiddleware(...middleware), createReduxEnhancer())
  : composeEnhancers(applyMiddleware(...middleware));

let store = createStore(combineReducers({ userReducers }), enhancers);

const WrapperApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => WrapperApp);
