import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [background, setBackground] = useState("src/assets/blobs2.svg");

  const updateTheme = (theme: string) => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme); // Save theme in local browser storage
  };

  useEffect(() => {
    setBackground("src/assets/blobs2.svg");
  }, []);

  const myStyle = {
    backgroundImage: `url(${background})`,
    height: "100vh",
    // marginTop: "-70px",
    // fontSize: "50px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">
            Wóoph̆e Admin
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  Users
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/posts">
                  Posts
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/pins">
                  Pins
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizations">
                  Organizations
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/permissions">
                  Permissions
                </Link>
              </li>
              <li className="nav-item dropdown">
                <button
                  className="btn dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Theme
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => updateTheme("light")}
                    >
                      Light
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => updateTheme("dark")}
                    >
                      Dark
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="containter p-5" style={myStyle}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
