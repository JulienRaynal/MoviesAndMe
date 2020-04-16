import React from 'react';
import MoviesTabNavigator from './Navigation/Navigation';
import {Provider} from 'react-redux';
import Store from './Store/configureStore';
import {persistStore} from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react'

export default class App extends React.Component {
  render() {
    //We persist our store with persisStore
    //We tell to rehydrate our child components with persisGate (our whole app here)
    let persistor = persistStore(Store);
    return (
      <Provider store={Store}>
        <PersistGate persistor={persistor}>
          <MoviesTabNavigator />
        </PersistGate>
      </Provider>
    );
  }
}
