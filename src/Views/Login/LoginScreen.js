import React, { Component } from "react";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import { v4 as uuidV4 } from "uuid";

import { isLoggedIn } from "../../Stores/redux/Persisted/Selectors";
import PActions from "../../Stores/redux/Persisted/Actions";
import UnpActions from "../../Stores/redux/Unpersisted/Actions";
import TopNav from "../Common/TopNav";
import withRouter from "../../Components/wrappers/with-router";
import api from "../../Services/Api/api";
import authModule from "../../Modules/auth/auth";
import { initAuth } from "../../Modules/auth/startup";

class LoginInner extends Component {
  initialState = {
    loading: null,
    error: null,
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    visibleScreen: "login",
    success: "",
    currentScreen: "login",
  };

  state = this.initialState;

  onMount() {
    this.mounted = true;
  }
  onUnmount() {
    this.mounted = false;
  }

  componentDidMount() {
    this.onMount();
  }
  componentWillUnmount() {
    this.onUnmount();
  }

  mounted = true;

  setAsyncState(x) {
    return new Promise((resolve) => {
      if (!this.mounted) return resolve(null);

      this.setState(x, () => resolve(x));
    });
  }

  validateEmail(email) {
    let emailChecker =
      /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return !!emailChecker.test(email);
  }

  async handleLogin() {
    try {
      let { email, password } = this.state;
      email = email.toLowerCase();

      if (!this.validateEmail(email)) {
        throw new Error("Please enter a correct email");
      }

      this.setAsyncState({ loading: true, error: null });

      const existingUser = (
        await api.request({
          uri: "/v1/data/get",
          method: "POST",
          body: {
            filter: { where: { type: "user", "data.email": email }, limit: 1 },
          },
        })
      ).items?.map((x) => ({ ...(x.data || {}), _id: x._id }))?.[0];

      if (!existingUser) {
        throw new Error("Your email doesn't exist.");
      }

      if (password && existingUser.password !== password) {
        throw new Error("Your password is incorrect.");
      }

      await authModule.login(existingUser);
      this.setAsyncState({ ...this.initialState });

      setTimeout(() => {
        initAuth();
      }, 100);
    } catch (e) {
      console.log(e);
      this.setAsyncState({
        loading: false,
        error: e.message,
      });
    }
  }

  async handleSignup() {
    try {
      let { name: fullName, email, password, confirmPassword } = this.state;

      email = email.toLowerCase();

      if (!this.validateEmail(email)) {
        throw new Error("Please enter a correct email");
      }

      if (password !== confirmPassword) {
        throw new Error("Confirm password does not match");
      }

      this.setAsyncState({ loading: true, error: null });

      const existingUser = (
        await api.request({
          uri: "/v1/data/get",
          method: "POST",
          body: {
            filter: { where: { type: "user", "data.email": email }, limit: 1 },
          },
        })
      ).items?.map((x) => ({ ...(x.data || {}), _id: x._id }))?.[0];

      if (existingUser) {
        throw new Error("Your email already exists.");
      }

      let user = {
        id: uuidV4(),
        fullName,
        email,
        password,
      };

      const apiresult = await api
        .request({
          uri: "/v1/data",
          method: "POST",
          body: {
            type: "user",
            data: user,
          },
        })
        .then((x) => x.item);

      user = {
        ...apiresult.data,
        _id: apiresult._id,
      };

      await authModule.login(user);

      await this.setAsyncState({ ...this.initialState });

      setTimeout(() => {
        initAuth();
      }, 100);
    } catch (e) {
      this.setAsyncState({
        loading: false,
        error: e.message,
      });
    }
  }

  closeModal() {
    this.setAsyncState({ ...this.initialState });
    this.props.setScreenState({ isVisible: false });
  }

  modal() {
    const {
      props: { isVisible, isLoggedIn },
    } = this;
    return (
      <>
        <ReactModal isOpen={!!isVisible && !isLoggedIn} ariaHideApp={false}>
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div>𝕊𝕒𝕝𝕃𝕖𝕒𝕕</div>
              <div
                onClick={this.closeModal.bind(this)}
                hitslop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <img
                  src={require("../../Assets/img/modalClose.png")}
                  style={{
                    width: 34,
                    height: 34,
                    resizeMode: "contain",
                  }}
                />
              </div>
            </div>

            {this.inner()}
          </div>
        </ReactModal>
      </>
    );
  }

  renderLogin() {
    const {
      state: { email, password, loading, error },
    } = this;

    const disableSubmit = loading || !email || !password;
    return (
      <div key="login">
        <div>
          <div>Login</div>
          <input
            placeholder="Email"
            type={"email"}
            value={email}
            onChange={(e) => this.setState({ email: e.target.value })}
          />
        </div>

        <div>
          <div>Password</div>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => this.setState({ password: e.target.value })}
            autoCapitalize="none"
          />
        </div>
        {error ? <div style={{ color: "red" }}>{error}</div> : null}

        <div
          onClick={() =>
            loading ? undefined : this.setState({ visibleScreen: "signup" })
          }
        >
          <div>Do not have account ? Sign up</div>
        </div>

        <button
          onClick={disableSubmit ? undefined : this.handleLogin.bind(this)}
        >
          <div>{loading ? "Loading" : "Log In"}</div>
        </button>
      </div>
    );
  }

  renderSingup() {
    const {
      state: { email, password, confirmPassword, name, loading, error },
    } = this;

    const disableSubmit =
      loading || !email || !password || !name || !confirmPassword;
    return (
      <div key="signup">
        <div>
          <div>Sign Up</div>
        </div>
        <div>
          <div>Full Name</div>
          <input
            placeholder="Full Name"
            value={name}
            onChange={({ target: { value: x } }) => this.setState({ name: x })}
          />
        </div>

        <div>
          <div>Email</div>
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={({ target: { value: x } }) => this.setState({ email: x })}
          />
        </div>

        <div>
          <div>Password</div>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={({ target: { value: x } }) =>
              this.setState({ password: x })
            }
          />
        </div>

        <div>
          <div>Confirm Password</div>
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={({ target: { value: x } }) =>
              this.setState({ confirmPassword: x })
            }
          />
        </div>

        {error ? <div style={{ color: "red" }}>{error}</div> : null}

        <div
          onClick={() =>
            loading ? undefined : this.setState({ visibleScreen: "login" })
          }
        >
          <div>Have an account ? Login</div>
        </div>

        <button
          type="submit"
          onClick={disableSubmit ? undefined : this.handleSignup.bind(this)}
        >
          {loading ? "Loading" : "Sign Up"}
        </button>
      </div>
    );
  }

  inner() {
    if (this.props.isLoggedIn) return null;
    else if (this.state.visibleScreen === "signup") return this.renderSingup();
    else return this.renderLogin();
  }

  render() {
    if (this.props.renderInner) return this.inner();
    else return this.modal();
  }
}

const SCREEN_NAME = "LOGIN_SCREEN";
const mapStateToProps = (state) => ({
  isLoggedIn: isLoggedIn(state),
  isVisible: state.vState[SCREEN_NAME].isVisible,
});

const mapDispatchToProps = (dispatch) => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

const LoginModal = connect(mapStateToProps, mapDispatchToProps)(LoginInner);

export const LoginScreen = withRouter((props) => {
  return (
    <div>
      <TopNav />
      <LoginModal renderInner {...props} />
    </div>
  );
});

export default LoginModal;
