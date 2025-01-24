import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Home from "./screens/Home";
import UserManager from "./screens/UserManager";
import Layout from "./components/Layout";
import PostManager from "./screens/PostManager";
import OrgManager from "./screens/OrgManager";
import UserProfile from "./screens/UserProfile";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/users"
          element={
            <Layout>
              <UserManager />
            </Layout>
          }
        />
        <Route
        path="/posts"
        element={
          <Layout>
            < PostManager />
          </Layout>
        }  
      />
        <Route
        path="organizations"
        element={
          <Layout>
            < OrgManager />
          </Layout>
        }
        />
        <Route 
          path="/users/:id" 
          element={
            <Layout>
              <UserProfile/>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
