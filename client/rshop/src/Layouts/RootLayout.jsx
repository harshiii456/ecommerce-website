import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
const RootLayout = () => {
  return (
    <>
      <div className="main-container">
        <div className="container">
          <Header />
          <div className="pages-container">
            <div className="pages">
              <Outlet />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default RootLayout;
