import React from "react";
import { connect } from "react-redux";

import { isLoggedIn } from "../../Stores/redux/Persisted/Selectors";
import PActions from "../../Stores/redux/Persisted/Actions";
import UnpActions from "../../Stores/redux/Unpersisted/Actions";
import withRouter from "../../Components/wrappers/with-router";
import { BrowseScreen } from "../Browse/BrowseScreen";

class MyLeadsScreen extends BrowseScreen {
  state = {
    keyword: this.queries?.keyword,
    city: this.queries?.city,
    state: this.queries?.state,
    searchType: this.queries?.searchTypem || "",
    consumerType: this.queries?.searchTypem || "Home Buyer",
    leads: null,
  };

  componentDidMount() {
    if (!this.props.isLoggedIn) {
      this.openLoginModal();
    } else {
      this.loadSearchResult();
    }
  }

  openLoginModal() {
    this.props.setScreenState({ isVisible: true }, false, "LOGIN_SCREEN");
  }

  async loadSearchResult() {
    try {
      const {
        state: {
          searchType,
          city,
          state,
          keyword,
          creditHistory,
          financing,
          consumerType,
        },
        props: { leads },
      } = this;

      console.info("loading ", Date.now());

      const keywordRegex = keyword && new RegExp(`.*${keyword}.*`, "i");
      const financingFilter = financing
        ? financing.split(",").map((x) => parseFloat(x))
        : [];

      const result = leads?.filter((x) => {
        return (
          x.sharesUserOwns > 0 &&
          (searchType === "legacy"
            ? x.isLegacy
            : searchType === "daily"
            ? !x.isLegacy
            : 1) &&
          (((!city || x.city === city) && (!state || x.state === state)) ||
            ((!city || x.lookingAtCity === city) &&
              (!state || x.lookingAtState === state))) &&
          (keyword
            ? keywordRegex.test(x.name) ||
              keywordRegex.test(x.city) ||
              keywordRegex.test(x.state)
            : 1) &&
          (creditHistory ? x.creditHistory === creditHistory : 1) &&
          (financing
            ? (financingFilter[0] || 0) <= parseFloat(x.financing) &&
              (financingFilter[1] || Infinity) > parseFloat(x.financing)
            : 1) &&
          (consumerType ? x.consumerType === consumerType : 1)
        );
      });

      this.setState({ leads: result });
    } catch (e) {
      console.error(e.message);
      this.setState({ error: e.message });
    }
  }

  handlesearchTimer = 0;
  handleSearch(q) {
    clearTimeout(this.handlesearchTimer);
    this.handlesearchTimer = setTimeout(() => {
      this.setState({ keyword: q }, () => this.loadSearchResult());
    }, 100);
  }

  get searchbar() {
    const {
      state: { keyword },
    } = this;
    return (
      <div>
        <input
          value={keyword}
          onChange={(e) => this.handleSearch(e.target.value)}
          placeholder="Search Leads"
        />
      </div>
    );
  }
}

const SCREEN_NAME = "MYLEADS_SCREEN";
const mapStateToProps = (state) => ({
  isLoggedIn: isLoggedIn(state),
  leads: state.pState.APP_DATA?.leads,
  leadRefreshed: state.pState.APP_DATA?.leadRefreshed,
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
)(withRouter(MyLeadsScreen));
