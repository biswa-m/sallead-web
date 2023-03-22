import React, { Component } from "react";
import { connect } from "react-redux";
import update from "immutability-helper";

import { isLoggedIn } from "../../Stores/redux/Persisted/Selectors";
import PActions from "../../Stores/redux/Persisted/Actions";
import UnpActions from "../../Stores/redux/Unpersisted/Actions";
import TopNav from "../Common/TopNav";
import withRouter from "../../Components/wrappers/with-router";
import SearchBar from "../Common/SearchBar";
import DropDown from "../../Components/Input/Dropdown/Dropdown";
import navigationModule from "../../Modules/navigation/navigationModule";
import { Link } from "react-router-dom";
import apiModule from "../../Modules/api/apiModule";

class BrowseScreen extends Component {
  queries = navigationModule.getQueries();
  state = {
    keyword: this.queries?.keyword,
    city: this.queries?.city,
    state: this.queries?.state,
    searchType: this.queries?.searchTypem || "daily",
    consumerType: this.queries?.searchTypem || "Home Buyer",
    leads: null,
  };

  searchTypeOptions = [
    { value: "daily", label: "Daily" },
    { value: "legacy", label: "Legacy" },
  ];

  buyerTypeOptions = [
    { value: "Home Buyer", label: "Any Buyer" },
    { value: "Home Owner", label: "Potential Listings" },
  ];

  creditHistoryOptions = [
    { value: "", label: "All Credit History" },
    { value: "excellent", label: "Excellent Credit" },
    { value: "fair", label: "Fair Credit" },
    { value: "good", label: "Good Credit" },
    { value: "bad", label: "Bad Credit" },
  ];

  financingOptions = [
    { value: "", label: "All Financing" },
    { value: "0,200000", label: "Less Than $200,000", miniLabel: "$200,000" },
    { value: "200000,250000", label: "$250,000", miniLabel: "$250,000" },
    { value: "250000,300000", label: "$300,000", miniLabel: "$300,000" },
    { value: "300000,350000", label: "$350,000", miniLabel: "$350,000" },
    { value: "350000,400000", label: "$400,000", miniLabel: "$400,000" },
    { value: "400000,450000", label: "$450,000", miniLabel: "$450,000" },
    { value: "450000,500000", label: "$500,000", miniLabel: "$500,000" },
    { value: "500000,550000", label: "$550,000", miniLabel: "$550,000" },
    { value: "550000,600000", label: "$600,000", miniLabel: "$600,000" },
    { value: "600000,650000", label: "$650,000", miniLabel: "$650,000" },
    { value: "650000,700000", label: "$700,000", miniLabel: "$700,000" },
    { value: "700000,750000", label: "$750,000", miniLabel: "$750,000" },
    { value: "750000,800000", label: "$800,000", miniLabel: "$800,000" },
    { value: "800000,850000", label: "$850,000", miniLabel: "$850,000" },
    { value: "850000,900000", label: "$900,000", miniLabel: "$900,000" },
    { value: "900000,950000", label: "$950,000", miniLabel: "$950,000" },
    {
      value: "1000000,0",
      label: "More Than $1,000,000",
      miniLabel: "$1,000,000",
    },
  ];

  avatarColors = ["#a565f7", "#18baff", "#1ea10f", "#faa731"];

  componentDidMount() {
    this.loadSearchResult();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.leads?.length !== this.props.leads?.length) {
      setTimeout(() => {
        this.loadSearchResult();
      }, 50);
    }
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

      const keywordRegex = keyword && new RegExp(`.*${keyword}.*`, "i");
      const financingFilter = financing
        ? financing.split(",").map((x) => parseFloat(x))
        : [];

      const result = leads?.filter((x) => {
        return (
          (searchType === "legacy" ? x.isLegacy : !x.isLegacy) &&
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

  onUnlock(item) {
    try {
      const index = this.state.leads?.findIndex((id) => item.id);
      if (index > -1) {
        this.setState({
          leads: update(this.state.leads, { $merge: { [index]: item } }),
        });
      }

      apiModule
        .loadLeads()
        .then((leads) => this.props.setScreenState({ leads }, true, "APP_DATA"))
        .catch(console.error);
    } catch (e) {
      console.error(e);
    }
  }

  getDescription(item) {
    let address = `${item.city ? item.city + ", " : ""}${item.state || ""}`;
    let lookingAtAddress = `${
      item.lookingAtCity ? item.lookingAtCity + ", " : ""
    }${item.lookingAtState || ""}`;
    let description =
      item.consumerType === "Home Buyer" ? (
        <span>
          I am Home Buyer from {address} and I am looking to buy a home in
          {lookingAtAddress}. I'm looking for a home for
          {item.minBudget
            ? `$${item.minBudget?.toLocaleString()}-$${item.budget?.toLocaleString()}`
            : `less than $${item.budget?.toLocaleString()}`}{" "}
          with a possible down payment of ${item.financing?.toLocaleString()}+.
          I have {item.creditHistory} credit with a household income of $
          {item.income?.toLocaleString()}K+
        </span>
      ) : (
        `I have a potential listing in ${address} and I am looking to buy a home in ${lookingAtAddress}. I'm looking for a home for ${
          item.minBudget
            ? `$${item.minBudget?.toLocaleString()}-$${item.budget?.toLocaleString()}`
            : `less than $${item.budget?.toLocaleString()}`
        } with a possible down payment of $${item.financing?.toLocaleString()}. I have ${
          item.creditHistory
        } credit with a household income of $${item.income?.toLocaleString()}K+`
      );
    description = this.props.descriptionTextLim
      ? description.substr(0, this.props.descriptionTextLim) +
        (description.length > this.props.descriptionTextLim ? "..." : "")
      : description;

    return description;
  }

  render() {
    const {
      state: { searchType, keyword, city, state, leads },
    } = this;

    const address =
      city || state ? `${city ? `${city}, ${state || ""}` : state}` : null;

    return (
      <div>
        <TopNav />
        <center>
          <SearchBar
            initialValue={keyword}
            goToSearchResult={(x) =>
              this.setState({ city: "", state: "", keyword: "", ...x }, () =>
                this.loadSearchResult()
              )
            }
          />
        </center>

        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {this.searchTypeOptions.map((x) => (
            <div
              key={x.value}
              className={`searchtype-tab ${
                x.value === searchType ? "active" : ""
              }`}
              onClick={() =>
                this.setState({ searchType: x.value }, () =>
                  this.loadSearchResult()
                )
              }
            >
              {x.label}
            </div>
          ))}
          {[
            { value: "consumerType", options: this.buyerTypeOptions },
            { value: "creditHistory", options: this.creditHistoryOptions },
            { value: "financing", options: this.financingOptions },
          ].map((x) => (
            <div style={{ position: "" }} key={x.value}>
              <DropDown
                {...{
                  options: x.options,
                  onChange: (value) =>
                    this.setState({ [x.value]: value }, () =>
                      this.loadSearchResult()
                    ),
                  value: this.state[x.value] || "",
                }}
              />
            </div>
          ))}
        </div>

        <div>
          <div>
            {address ? (
              <>
                Showing results near <span>{address}</span>
              </>
            ) : null}
          </div>
          <div>Profiles found: {leads?.length}</div>
        </div>

        {!leads?.length ? <div>Nothing to show</div> : null}

        <div>
          {leads?.map((item, index) => {
            return (
              <LeadRow
                {...{
                  key: item.id,
                  item,
                  index,
                  avatarColor:
                    this.avatarColors[(index || 0) % this.avatarColors.length],
                  getDescription: this.getDescription.bind(this),
                  onSuccess: (item) => this.onUnlock(item),
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

class LeadRow extends React.PureComponent {
  state = { unlocking: false };

  async unlock() {
    try {
      if (this.state.unlocking) return;
      if (!this.props?.item?.id) {
        throw new Error("Loading Failed. Invalid lead id");
      }
      this.setState({ error: null, unlocking: true });

      const item = this.props.item;

      await apiModule.unlock(item);
      const updatedLead = await apiModule
        .loadLeads({ where: { "data.id": item.id } })
        .then((x) => x[0]);

      this.setState({ unlocking: false });

      this.props.onSuccess?.(updatedLead);
      window.alert("Success", "Lead Unlocked");
    } catch (e) {
      console.error(e);
      this.setState({ error: e.message, unlocking: false });
      this.props.onFail?.(e);
      window.alert("Error: " + e.message);
    }
  }

  render() {
    const {
      props: { item, getDescription, avatarColor },
      state: { unlocking },
    } = this;

    var matches = item.name?.match(/\b(\w)/g) || ["A", "S"];
    var acronym = matches.join("");

    const leadUnlocked = item?.sharesUserOwns > 0;

    const description = getDescription(item);

    return (
      <div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: avatarColor,
              width: "150px",
            }}
          >
            {acronym}
          </div>
          <div>
            <div>
              <div>{acronym}</div>
              <div>
                <div>{item.name}</div>
                <div>
                  {item.city}, {item.state}
                </div>
                <div>{item.consumerType}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <div style={{ width: "50%" }}>
                <img src="../images/qz/core/metaPerson.png" alt="icon" />
                <div>
                  <div>I am a</div>
                  <div>{item.consumerType}</div>
                </div>
              </div>
              <div style={{ width: "50%" }}>
                <img src="../images/qz/core/metaLocation.png" alt="icon" />
                <div>
                  <div>I'm looking In</div>
                  <div>
                    {item.lookingAtCity}, {item.lookingAtState}
                  </div>
                </div>
              </div>
              <div style={{ width: "50%" }}>
                <img src="../images/qz/core/metaEmail.png" alt="icon" />
                <div>
                  <div>Email</div>
                  <div>
                    {leadUnlocked ? (
                      <a href={"mailto:" + item.email}>{item.email}</a>
                    ) : item.email ? (
                      "Email Available"
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div style={{ width: "50%" }}>
                <img src="../images/qz/core/metaPhone.png" alt="icon" />
                <div>
                  <div>Phone Number</div>
                  <div>
                    <div>
                      {leadUnlocked ? (
                        <a href={"tel:" + item.phone}>{item.phone}</a>
                      ) : item.phone ? (
                        "Phone Available"
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {description}
          <Link to={`/detail/${item.id}`}>View details »</Link>
        </div>

        <div>
          <Link to={`/detail/${item.id}`}>View details »</Link>
          <button onClick={() => this.unlock()} disabled={unlocking}>
            {unlocking ? "Unlocking" : "Unlock Contact Info"}
          </button>
        </div>
      </div>
    );
  }
}

const SCREEN_NAME = "HOME_SCREEN";
const mapStateToProps = (state) => ({
  isLoggedIn: isLoggedIn(state),
  leads: state.pState.APP_DATA?.leads,
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
)(withRouter(BrowseScreen));
