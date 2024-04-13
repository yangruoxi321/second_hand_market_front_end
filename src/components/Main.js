import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Profile from "./Profile";

function Main(props) {
  const { isLoggedIn, handleLoggedIn } = props;

  return (
      <div className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/home" replace /> : <Login handleLoggedIn={handleLoggedIn} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
              path="/home"
              element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route
              path="/profile"
              element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
  );
}

export default Main;