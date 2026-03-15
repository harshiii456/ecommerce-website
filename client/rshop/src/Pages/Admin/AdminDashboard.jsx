import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { adminGetAllUsers, adminGetAllOrders, adminGetAllProducts } from "../../features/admin/adminAPI";
import { clearErrors } from "../../features/admin/adminSlice";
import { MdDashboard, MdPeople, MdShoppingCart, MdInventory, MdError, MdCheckCircle } from "react-icons/md";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products, users, orders, isLoading, error, message } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(adminGetAllProducts());
    dispatch(adminGetAllUsers());
    dispatch(adminGetAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      setTimeout(() => dispatch(clearErrors()), 3000);
    }
    if (error) {
      setTimeout(() => dispatch(clearErrors()), 3000);
    }
  }, [message, error, dispatch]);

  const stats = [
    {
      title: "Total Products",
      value: products?.length || 0,
      icon: <MdInventory className="text-3xl text-blue-500" />,
      link: "/admin/products",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Total Users",
      value: users?.length || 0,
      icon: <MdPeople className="text-3xl text-green-500" />,
      link: "/admin/users",
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Total Orders",
      value: orders?.length || 0,
      icon: <MdShoppingCart className="text-3xl text-purple-500" />,
      link: "/admin/orders",
      color: "bg-purple-50 border-purple-200"
    },
    {
      title: "Pending Orders",
      value: orders?.filter(order => order.order_status === 'PENDING')?.length || 0,
      icon: <MdError className="text-3xl text-orange-500" />,
      link: "/admin/orders",
      color: "bg-orange-50 border-orange-200"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your e-commerce store</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
          <MdCheckCircle className="mr-2" />
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <MdError className="mr-2" />
          {typeof error === 'string' ? error : (error?.message || "An error occurred")}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className={`p-6 border-2 rounded-lg hover:shadow-lg transition-shadow ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/products/new"
              className="block w-full text-left p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add New Product
            </Link>
            <Link
              to="/admin/orders"
              className="block w-full text-left p-3 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              View Orders
            </Link>
            <Link
              to="/admin/users"
              className="block w-full text-left p-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Manage Users
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Orders</h2>
          <div className="space-y-3">
            {orders?.slice(0, 5).map((order) => (
              <div key={order.order_id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Order #{order.order_id}</p>
                  <p className="text-sm text-gray-600">${order.total_amount}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  order.order_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  order.order_status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                  order.order_status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                  order.order_status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.order_status}
                </span>
              </div>
            ))}
            {(!orders || orders.length === 0) && (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
