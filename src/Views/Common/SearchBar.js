import React, { Component } from "react";
import { connect } from "react-redux";

import PActions from "../../Stores/redux/Persisted/Actions";
import UnpActions from "../../Stores/redux/Unpersisted/Actions";
import leadModule from "../../Modules/lead/leadModule";
import withRouter from "../../Components/wrappers/with-router";
import { createSearchParams } from "react-router-dom";

class SearchBar extends Component {
  state = {
    q: this.props.initialValue || "",
    searchSuggestions: null,
  };

  searchTimer = null;
  async handleSearch(q) {
    try {
      this.setState({ q });

      clearTimeout(this.searchTimer);

      if (!q) {
        this.setState({ searchSuggestions: null });
      } else {
        this.searchTimer = setTimeout(async () => {
          const locations = await leadModule.searchLocation(q);
          this.setState({
            searchSuggestions: locations,
          });
        }, 100);
      }
    } catch (e) {
      console.error(e);
    }
  }

  goToSearchResult(x) {
    let params = {};
    if (x.keyword) params.keyword = x.keyword;
    if (x.location?.item?.city) params.city = x.location?.item?.city;
    if (x.location?.item?.state) params.state = x.location?.item?.state;

    // this.props.router.navigate("/search", params);
    if (this.props.goToSearchResult) {
      this.props.goToSearchResult(params);
    } else {
      this.props.router.navigate({
        pathname: "/search",
        search: createSearchParams(params).toString(),
      });
    }
  }

  renderSuggestion({ item, group }) {
    return (
      <div
        key={item.address}
        onClick={() => this.goToSearchResult({ location: { item, group } })}
      >
        {item.address}
      </div>
    );
  }

  render() {
    const {
      state: { searchSuggestions },
    } = this;

    const searchSuggestionList = (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
        }}
      >
        {searchSuggestions?.strongcity?.length ? (
          <div>
            <div>City Hits</div>
            {searchSuggestions?.strongcity?.map((item) =>
              this.renderSuggestion({ item, group: "strongcity" })
            )}
          </div>
        ) : null}

        {searchSuggestions?.state?.length ? (
          <div>
            <div>State Hits</div>
            {searchSuggestions?.state?.map((item) =>
              this.renderSuggestion({ item, group: "state" })
            )}
          </div>
        ) : null}
      </div>
    );
    return (
      <div>
        <div>
          <input
            value={this.state.q}
            onChange={(e) => this.handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter")
                this.goToSearchResult({ keyword: e.target.value });
            }}
          />
          <button
            onClick={() => this.goToSearchResult({ keyword: this.state.q })}
          >
            Search
          </button>
        </div>
        {searchSuggestions ? searchSuggestionList : null}
      </div>
    );
  }
}

const SCREEN_NAME = "HOME_SCREEN";
const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SearchBar));
