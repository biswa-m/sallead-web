import React, { useEffect } from "react";

import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../Stores/redux/Persisted/Selectors";

const MainScreen = ({ isLoggedIn, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  return (
    <div className="mainwrapper">
      <div className="gaouter">{children}</div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoggedIn: isLoggedIn(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
