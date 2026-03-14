import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

const HomeProductCard = ({ item }) => {
  return (
    <div className="home-product-card">
      <Link to={`/product/${item.product_id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-image">
          <img src={item.main_image_url} alt={item.product_name} draggable="false" />
        </div>
        <div className="home-product-info">
          <span className="product-name">{item.product_name}</span>
          <span className="product-price">From ₹{item.discount_price || item.price}</span>
        </div>
      </Link>
    </div>
  );
};

export default HomeProductCard;
