import React, { Component } from "react";
import { connect } from "react-redux";

import { isLoggedIn } from "../../Stores/redux/Persisted/Selectors";
import PActions from "../../Stores/redux/Persisted/Actions";
import UnpActions from "../../Stores/redux/Unpersisted/Actions";
import { Link } from "react-router-dom";
import authModule from "../../Modules/auth/auth";

class RootScreen extends Component {
  render() {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/">Sal Lead</Link>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {this.props.isLoggedIn ? (
            <>
              <Link style={{ padding: "0 5px" }} to="/myleads">
                My Leads
              </Link>
              <Link style={{ padding: "0 5px" }} to="/profile">
                Profile
              </Link>
              <div
                onClick={() => authModule.confirmAndLogout()}
                style={{ padding: "0 5px" }}
              >
                Logout
              </div>
            </>
          ) : (
            <Link
              style={{ padding: "0 5px" }}
              onClick={() =>
                this.props.setScreenState(
                  { isVisible: true },
                  false,
                  "LOGIN_SCREEN"
                )
              }
            >
              Login
            </Link>
          )}
          <a style={{ padding: "0 5px" }} href="tel:000000000">
            Contact
          </a>
        </div>
      </div>
    );
  }
}

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
