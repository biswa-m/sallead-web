import React from "react";
import { useNavigate } from "react-router-dom";

const Redirect = ({ to }) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to);
  }, [navigate, to]);
};

export default Redirect;
