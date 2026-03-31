import React from "react";
import "./style.css"
import { icons } from "../../common/Path";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { toggleWishlistTask } from "../../features/wishlist/wishlistSlice";
import toast from "react-hot-toast";

const ProductCard = ({data}) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isInWishlist = wishlistItems?.wishlistItems?.some(item => String(item.product_id) === String(data.product_id));
  
  // Convert string prices to numbers for calculations
  const price = parseFloat(data.price) || 0;
  const discountPrice = parseFloat(data.discount_price) || price;
  const discountAmount = price - discountPrice;
  const discountPercentage = price > 0 ? Math.round((discountAmount / price) * 100) : 0;

  return (
    <div className="product-card">
      <div className="card">
        <Link to={`/product/${data.product_id}`} className="product-image-con">
          <div className="product-image">
            <img src={data.main_image_url} alt={data.product_name} />
          </div>
        </Link>
        <div 
          className={`product-whishlist ${isInWishlist ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(toggleWishlistTask(data.product_id));
          }}
        >
          {icons.heart}
        </div>

        <div className="product-info">
          <h4 className="product-brand-name">RShop</h4>
          <h3 className="product-name">{data.product_name}</h3>

          <div className="product-price">
            <span className="product-discounted-price">₹{discountPrice.toFixed(2)}</span>
            {discountPrice < price && (
              <>
                <span className="product-retail-price">₹{price.toFixed(2)}</span>
                <span className="product-discount-percentage">
                  {discountPercentage}% off
                </span>
              </>
            )}
          </div>

          <div className="xcelerator-info-tag">
            {data.stock_quantity > 0 ? (data.stock_quantity < 10 ? "Only Few Left!" : "In Stock") : "Out of Stock"}
          </div>

          <div className="product-size">
            <span>Free Delivery</span>
          </div>

          <button 
            className="add-to-cart-btn"
            onClick={(e) => {
              e.preventDefault();
              dispatch(addToCart({ productId: data.product_id }));
            }}
          >
            {icons.cart} Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
