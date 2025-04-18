import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Home from "./screens/Home";
import UserManager from "./screens/UserManager";
import Layout from "./components/Layout";
import PostManager from "./screens/PostManager";
import OrgManager from "./screens/OrgManager";
import UserProfile from "./screens/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import OrgProfile from "./screens/OrgProfile";
import PinManager from "./screens/PinManager";
import PermissionManager from "./screens/PermissionManager";

function App() {
  const { userToken, userRole } = useContext(AuthContext);
  const theme = localStorage.getItem("theme");

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-bs-theme", theme);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Admin-Only Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={!!userToken} userRole={userRole}>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute isAuthenticated={!!userToken} userRole={userRole}>
              <Layout>
                <UserManager />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <ProtectedRoute isAuthenticated={!!userToken} userRole={userRole}>
              <Layout>
                <PostManager />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pins"
          element={
            <ProtectedRoute isAuthenticated={!!userToken} userRole={userRole}>
              <Layout>
                <PinManager />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizations"
          element={
            <ProtectedRoute isAuthenticated={!!userToken} userRole={userRole}>
              <Layout>
                <OrgManager />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/permissions"
          element={
            <ProtectedRoute isAuthenticated={!!userToken} userRole={userRole}>
              <Layout>
                <PermissionManager />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizations/:id"
          element={
            <ProtectedRoute isAuthenticated={!!userToken} userRole={userRole}>
              <Layout>
                <OrgProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <ProtectedRoute isAuthenticated={!!userToken} userRole={userRole}>
              <Layout>
                <UserProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
