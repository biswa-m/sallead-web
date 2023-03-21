// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { isLoggedIn as isLoggedInFunc } from "../../Stores/redux/Persisted/Selectors";

const PrivateRoute = ({
  isLoggedIn,
  component: Component,
  logoutOnly = false,
  userTypes,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        (isLoggedIn && !logoutOnly) ||
        (!isLoggedIn && logoutOnly) ||
        (userTypes && !userTypes.includes(this.props.user.role)) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: logoutOnly ? "/" : "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user?.user,
  isLoggedIn: isLoggedInFunc(state),
});

export default connect(mapStateToProps)(PrivateRoute);
