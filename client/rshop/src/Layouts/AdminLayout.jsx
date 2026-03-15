import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/header/AdminHeader";

const AdminLayout = () => {
  return (
    <div className="main-container">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AdminHeader />
        <div className="pages-container" style={{ flex: 1, backgroundColor: '#f8fafc' }}>
          <div className="pages" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
