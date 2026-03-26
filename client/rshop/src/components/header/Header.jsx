import React, { useEffect, useState } from "react";

import "./Header.css";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { CategoriesNav, Dropdown, DropDownMenu } from "../index";

import { DropDownMenuItem } from "../../common/Element";
import { icons } from "../../common/Path";
import { logOut } from "../../features/auth/authAPI";
import { useDispatch } from "react-redux";

const Header = () => {
  const [hovering, setHovering] = useState(false);
  const [popoverLeft, setPopoverLeft] = useState(null);
  const [popoverTop, setPopoverTop] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, userData } = useSelector((state) => state.auth);
  const [productList, SetProductList] = useState([]);

  const location = useLocation();
  const homePathPattern = /^\/$/;
  const isHome = homePathPattern.test(location.pathname);

  useEffect(() => {
    async function getProductList() {
      const response = await fetch(
        "https://dummyjson.com/products/category-list",
      );
      const data = await response.json();
      SetProductList(data);
    }
    getProductList();
  }, []);

  const onMouseEnter = (el) => {
    setHovering(true);
    setPopoverLeft(el.offsetLeft);
    setPopoverTop(el.offsetHeight);
  };

  const handleItemClick = (item) => {
    if (item.title === "Logout") {
      dispatch(logOut());
      setHovering(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/product-list?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className="header-container">
        <div className="header">
          <NavLink className="logo-container" to="/">
            <h1 className="logo-txt">RShop</h1>
          </NavLink>

          <div className="serach-container">
            <Dropdown data={productList} />

            <div className="search-input-container">
              <input
                className="serach-input"
                placeholder="Search Products, Brands & More"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button className="search-btn" onClick={handleSearch}>{icons.search}</button>
          </div>

          <div className="header-nav-link-container">
            <ul
              className="header-links"
              onMouseLeave={() => {
                setHovering(false);
              }}
            >
              <li className="link-item">
                <NavLink
                  to={
                    !isAuthenticated 
                      ? "/auth" 
                      : (userData?.role === 'admin' || userData?.user_role_id === 2) 
                        ? "/admin/dashboard" 
                        : "/customer/dashboard"
                  }
                  className="nav-link"
                >
                  <div
                    className={`drop-down-wrapper ${hovering ? "active" : ""}`}
                    onMouseEnter={(event) => {
                      onMouseEnter(event.currentTarget);
                    }}
                  >
                    {icons.Account}
                    {isAuthenticated
                      ? userData?.user_first_name
                        ? userData.user_first_name
                        : "Account"
                      : "Login"}
                    <div className="icon-con">{icons.arrowdown}</div>
                  </div>
                </NavLink>
              </li>

              <li
                className="link-item"
                onMouseEnter={() => {
                  setHovering(false);
                }}
              >
                <NavLink to="/cart" className="nav-link">
                  {icons.cart}
                  Cart
                </NavLink>
              </li>

              <li
                className="link-item"
                onMouseEnter={() => {
                  setHovering(false);
                }}
              >
                <NavLink to="/wishlist" className="nav-link">
                  {icons.heart}
                  Whishlist
                </NavLink>
              </li>

              <li
                className="link-item"
                onMouseEnter={() => {
                  setHovering(false);
                }}
              >
                <NavLink to="/cart" className="nav-link">
                  {icons.customercare}
                  Customer Care
                </NavLink>
              </li>

              <DropDownMenu
                hovering={hovering}
                popoverTop={popoverTop}
                popoverLeft={popoverLeft}
                data={DropDownMenuItem.filter((item) => {
                  if (!isAuthenticated) {
                    return !item.authorized;
                  }
                  if (item.authorized === "admin") {
                    return userData?.role === 'admin' || userData?.user_role_id === 2;
                  }
                  return item.authorized !== false;
                })}
                onItemClick={handleItemClick}
              />
            </ul>
          </div>
        </div>

        <CategoriesNav />
      </div>
    </>
  );
};

export default Header;

{
  /* {HeaderNavItem.map((item, index) =>
  index === 0 ? (
    <li
      className="link-item"
      key={item.title}
      onMouseEnter={(event) => {
        onMouseEnter(event.currentTarget);
      }}
    >
      <NavLink
        to={isAuthenticated ? "/" : item.path}
        className="nav-link"
      >
        {item.img}
        {isAuthenticated
          ? userData?.data?.user?.user_first_name
            ? userData.data.user.user_first_name
            : "Account"
          : item.title}
        <div className="icon-con">{icons.arrowdown}</div>
      </NavLink>
    </li>
  ) : (
    <li
      className="link-item"
      key={item.title}
      onMouseEnter={() => {
        setHovering(false);
      }}
    >
      <NavLink to={item.path} className="nav-link">
        {item.img}
        {item.title}
      </NavLink>
    </li>
  )
)} */
}
