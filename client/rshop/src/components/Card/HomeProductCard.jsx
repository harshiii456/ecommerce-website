import React from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { icons } from "../../common/Path";

const HomeProductCard = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <div className="home-product-card">
      <Link to={`/product/${item.product_id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-image">
          <img src={item.main_image_url} alt={item.product_name} draggable="false" />
        </div>
        <div className="home-product-info">
          <span className="product-name">{item.product_name}</span>
          <span className="product-price">₹{item.discount_price || item.price}</span>
          <button 
            className="home-add-to-cart-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(addToCart({ productId: item.product_id }));
            }}
          >
            {icons.cart}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default HomeProductCard;
