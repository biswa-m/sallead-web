import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import AppNavigator from "../../Navigators/AppNavigator";
import { isLoggedIn } from "../../Stores/redux/Persisted/Selectors";
import { initAuth } from "../../Modules/auth/startup";

class RootScreen extends Component {
  async componentDidMount() {
    if (this.props.isLoggedIn) {
      initAuth();
    }
  }

  render() {
    return <AppNavigator />;
  }
}

RootScreen.propTypes = {
  isLoggedIn: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isLoggedIn: isLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
