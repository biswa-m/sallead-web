import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Config from "../Config";
// import NotFound404 from "../Views/Common/not-found-404";
import WorkInProgress from "../Views/Common/work-in-progress";

function AppNavigator() {
  return (
    <Router basename={Config.relativePath}>
      <Routes>
        <Route path="/" element={<WorkInProgress />} />
        <Route path="/login" exact element={<WorkInProgress />} />
      </Routes>
    </Router>
  );
}

export default AppNavigator;
