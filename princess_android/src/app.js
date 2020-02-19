import React from 'react';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import Screens from './Screens';
import {PersistGate} from 'redux-persist/integration/react';
const {store, persistor} = configureStore();

// import {} from 'react-native';

class Loading extends React.Component {
  render() {
    return false;
  }
}

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <Screens />
        </PersistGate>
      </Provider>
    );
  }
}
