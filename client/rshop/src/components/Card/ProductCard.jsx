import React from "react";
import "./style.css"
import { icons } from "../../common/Path";
import { Link } from "react-router-dom";

const ProductCard = ({data}) => {
  const discountAmount = data.price - data.discount_price;
  const discountPercentage = data.price > 0 ? Math.round((discountAmount / data.price) * 100) : 0;

  return (
    <div className="product-card">
      <div className="card">
        <Link to={`/product/${data.product_id}`} className="product-image-con">
          <div className="product-image">
            <img src={data.main_image_url} alt={data.product_name} />
          </div>
        </Link>
        <div className="product-whishlist">
          {icons.heart}
        </div>

        <div className="product-info">
          <h4 className="product-brand-name">RShop</h4>
          <h3 className="product-name">{data.product_name}</h3>

          <div className="product-price">
            <span className="product-discounted-price">₹{data.discount_price || data.price}</span>
            {data.discount_price < data.price && (
              <>
                <span className="product-retail-price">₹{data.price}</span>
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
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
