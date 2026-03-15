import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./App.css";

import RootLayout from "../src/Layouts/RootLayout";
import Auth from "./Pages/Account/Auth/Auth";
import AdminLogin from "./Pages/Account/Auth/AdminLogin";
import OtpVerification from "./Pages/Account/Auth/OtpVerification";
import CustomerDashboard from "./Pages/Account/CustomerDashboard";
import Cart from "./Pages/Cart/Cart";
import Wishlist from "./Pages/Wishlist/Wishlist";
import Home from "./Pages/Home/Home";
import ProductListing from "./Pages/ProductListing/ProductListing";
import MobilePhoneStore from "./Pages/ProductStore/MobilePhoneStore";

// Admin Pages
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminProducts from "./Pages/Admin/AdminProducts";
import AdminUsers from "./Pages/Admin/AdminUsers";
import AdminOrders from "./Pages/Admin/AdminOrders";

import { getCurrentUser } from "./features/auth/authAPI";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Toaster } from "react-hot-toast";

const App = () => {
  const { userData, isAuthenticated, isCheckingAuth, error } = useSelector(
    (state) => state.auth,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    if (!userData || (userData.role !== 'admin' && userData.user_role_id !== 2)) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const RedirectAuthenticatedUsers = ({ children }) => {
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { path: "/", element: <Home />, index: true },
          { path: "auth", element: <Auth /> },
          { path: "admin/login", element: <AdminLogin /> },
          { path: "otp-verification", element: <OtpVerification /> },
          { 
            path: "customer/dashboard", 
            element: <ProtectedRoute><CustomerDashboard /></ProtectedRoute> 
          },
          { path: "cart", element: <Cart /> },
          { path: "wishlist", element: <Wishlist /> },
          { path: "mobile-phone-store", element: <MobilePhoneStore /> },
          { path: "product-list", element: <ProductListing /> },
          
          // Admin Routes
          { 
            path: "admin/dashboard", 
            element: <AdminRoute><AdminDashboard /></AdminRoute> 
          },
          { 
            path: "admin/products", 
            element: <AdminRoute><AdminProducts /></AdminRoute> 
          },
          { 
            path: "admin/users", 
            element: <AdminRoute><AdminUsers /></AdminRoute> 
          },
          { 
            path: "admin/orders", 
            element: <AdminRoute><AdminOrders /></AdminRoute> 
          },
        ],
      },
    ],
    {
      future: {
        v7_relativeSplatPath: true,
      },
    },
  );

  if (isCheckingAuth) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
        }}
      />
    </>
  );
};

export default App;

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     children: [
//       { path: "/", element: <Home /> },
//       {
//         path: "/account", element: <AccountLayout />,
//         children: [
//           { path: "/account/auth", element: <Auth />},
//           { path: "/account/otp-verification", element: <OtpVerification /> },
//         ]
//       },
//       { path: "cart", element: <Cart /> },
//       { path: "wishlist", element: <Wishlist /> },
//       { path: "mobile-phone-store", element: <MobilePhoneStore /> },
//       { path: "product-list", element: <ProductListing /> },
//     ],
//   },
// ]);
