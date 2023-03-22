import React, { Component } from "react";
import { connect } from "react-redux";

import { isLoggedIn } from "../../Stores/redux/Persisted/Selectors";
import PActions from "../../Stores/redux/Persisted/Actions";
import UnpActions from "../../Stores/redux/Unpersisted/Actions";
import TopNav from "../Common/TopNav";
import withRouter from "../../Components/wrappers/with-router";
import SearchBar from "../Common/SearchBar";

class HomeScreen extends Component {
  render() {
    return (
      <div>
        <TopNav />
        <center>
          <div>
            Search for home buyer and seller leads in your area! Start your
            search to begin connecting with motivated buyers and sellers today.
          </div>

          <SearchBar />
        </center>
      </div>
    );
  }
}

const SCREEN_NAME = "HOME_SCREEN";
const mapStateToProps = (state) => ({
  isLoggedIn: isLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HomeScreen));
