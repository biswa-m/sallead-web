import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Config from "../Config";
import BrowseScreen from "../Views/Browse/BrowseScreen";
import NotFound404 from "../Views/Common/not-found-404";
import WorkInProgress from "../Views/Common/work-in-progress";
import HomeScreen from "../Views/Home/HomeScreen";

function AppNavigator() {
  return (
    <Router basename={Config.relativePath}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" exact element={<WorkInProgress />} />
        <Route path="/search" exact element={<BrowseScreen />} />
        <Route path="/*" exact element={<NotFound404 />} />
      </Routes>
    </Router>
  );
}

export default AppNavigator;
