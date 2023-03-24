import React, { Component } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

import RootScreen from "./Views/Root/RootScreen";

import { persistor, store } from "./store";
import LoginModal from "./Views/Login/LoginScreen";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootScreen />
          <LoginModal/>
        </PersistGate>
      </Provider>
    );
  }
}
