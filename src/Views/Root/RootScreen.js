import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import AppNavigator from "../../Navigators/AppNavigator";
import { isLoggedIn } from "../../Stores/redux/Persisted/Selectors";
import { initAuth, startup } from "../../Modules/auth/startup";
import apiModule from "../../Modules/api/apiModule";
import PActions from "../../Stores/redux/Persisted/Actions";
import UnpActions from "../../Stores/redux/Unpersisted/Actions";

class RootScreen extends Component {
  componentDidMount() {
    startup().catch(console.error);

    if (this.props.isLoggedIn) {
      initAuth().catch(console.error);
    }

    apiModule
      .loadLeads()
      .then((leads) =>
        this.props.setScreenState({ leads, leadRefreshed: Date.now() }, true)
      )
      .catch(console.error);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isLoggedIn !== this.props.isLoggedIn) {
      apiModule
        .loadLeads()
        .then((leads) =>
          this.props.setScreenState({ leads, leadRefreshed: Date.now() }, true)
        );
    }
  }

  render() {
    return <AppNavigator />;
  }
}

RootScreen.propTypes = {
  isLoggedIn: PropTypes.bool,
};

const SCREEN_NAME = "APP_DATA";
const mapStateToProps = (state) => ({
  isLoggedIn: isLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
