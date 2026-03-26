import React, { useState } from "react";
import "./CategoriesNav.css";
import { Link } from "react-router-dom";

import { icons } from "../../../../common/Path";
import { CategoriesNavItem } from "../../../../common/Element";

import {Menu} from "../../../index";

const CategoriesNav = () => {
  const [hovering, setHovering] = useState(null);
  const [menuCategory, setMenuCategory] = useState(null);

  const mouseLeave = () => {
    setHovering(null);
    setMenuCategory(null);
  };

  return (
    <div
      className="nav-bar-container"
      onMouseLeave={() => {
        setHovering(null);
        setMenuCategory(null);
      }}
    >
      <ul className="nav-list">
        {CategoriesNavItem.map((category, index) => (
          <Link
            to={category.path}
            className="nav-item-with-img"
            key={index}
            onMouseEnter={(event) => {
              if (category.path === "") {
                setHovering(index);
                setMenuCategory(category.title);
              } else {
                setHovering(null);
                setMenuCategory(null);
              }
            }}
          >
            {category.img && (
              <div className="cat-img-con">
                <img src={category.img} alt={category.title} />
              </div>
            )}
            <div className="cat-title-con">
              <span>{category.title}</span>
              {category.path === "" && icons.arrowdown}
            </div>
          </Link>
        ))}

        <Menu
          hovering={hovering}
          mouseLeave={mouseLeave}
          menuCategory={menuCategory}
        />
      </ul>
    </div>
  );
};

export default CategoriesNav;
