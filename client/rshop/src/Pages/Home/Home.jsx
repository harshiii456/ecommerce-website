import React from "react";
import "./Home.css";

import { productsCardData, productsData } from "../../common/Data";
import { bannerImage, icons } from "../../common/Path";

import CategoryBar from "./CategoryBar/CategoryBar";
import ImageSlider from "./ImageSlider/ImageSlider";

import { CardSlider, HomeBoxContainer } from "../../components";

import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/product/productAPI";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  // Build a list of 20+ fallback products when DB products are few
  const ensureMinProducts = (dbProducts, minCount = 20) => {
    if (!dbProducts || dbProducts.length === 0) {
      // Generate fallback data from static data
      return productsData.map((item, idx) => ({
        product_id: idx + 1,
        product_name: `Product ${idx + 1}`,
        main_image_url: item.img,
        price: item.price,
        discount_price: Math.round(item.price * 0.8),
      }));
    }
    // Duplicate products to reach minCount
    const result = [...dbProducts];
    let i = 0;
    while (result.length < minCount) {
      result.push({ ...dbProducts[i % dbProducts.length], product_id: `dup-${result.length}` });
      i++;
    }
    return result;
  };

  const allProducts = ensureMinProducts(products, 20);
  const electronicsProducts = ensureMinProducts(
    products.filter(p => p.category_id === 3 || p.category_id === 1), 
    20
  );

  return (
    <div className="home-page-wrapper">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">🔥 Trending Now</span>
          <h1 className="hero-title">Discover Amazing Deals</h1>
          <p className="hero-subtitle">Up to 70% off on top brands. Shop the latest trends in fashion, electronics & more.</p>
          <div className="hero-buttons">
            <button className="hero-btn primary" onClick={() => navigate('/product-list')}>Shop Now</button>
            <button className="hero-btn secondary" onClick={() => navigate('/product-list?search=electronics')}>Explore Electronics</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Brands</span>
          </div>
        </div>
      </div>

      {/* Marquee Promo Strip */}
      <div className="promo-strip">
        <div className="promo-marquee">
          <span>🎉 FREE SHIPPING on orders over ₹500 &nbsp;&nbsp;•&nbsp;&nbsp; 💳 Extra 10% off on UPI Payments &nbsp;&nbsp;•&nbsp;&nbsp; 🎁 Daily Surprise Deals &nbsp;&nbsp;•&nbsp;&nbsp; 🔄 Easy 30-Day Returns</span>
        </div>
      </div>

      <div className="home-container">
        {/* Popular Products */}
        <div className="grid-container">
          <CardSlider
            cardSliderTitle="🔥 Popular Products"
            data={allProducts}
            isButtonVisible={true}
            isDraggable={true}
          />
        </div>

        {/* Laptops Section */}
        <div className="grid-container">
          <CardSlider
            cardSliderTitle="💻 High-Performance Laptops"
            data={ensureMinProducts(products.filter(p => p.category_id === 2), 20)}
            isButtonVisible={true}
            isDraggable={true}
          />
        </div>

        {/* Mobile Phones Section */}
        <div className="grid-container">
          <CardSlider
            cardSliderTitle="📱 Latest Smartphones"
            data={ensureMinProducts(products.filter(p => p.category_id === 1), 20)}
            isButtonVisible={true}
            isDraggable={true}
          />
        </div>

        {/* Fashion Section */}
        <div className="grid-container">
          <CardSlider
            cardSliderTitle="👔 Trendy Fashion"
            data={ensureMinProducts(products.filter(p => p.category_id === 3), 20)}
            isButtonVisible={true}
            isDraggable={true}
          />
        </div>

        {/* Home & Furniture Section */}
        <div className="grid-container">
          <CardSlider
            cardSliderTitle="🏠 Home & Furniture Essentials"
            data={ensureMinProducts(products.filter(p => p.category_id === 5), 20)}
            isButtonVisible={true}
            isDraggable={true}
          />
        </div>

        {/* Beauty & Health Section */}
        <div className="grid-container">
          <CardSlider
            cardSliderTitle="✨ Beauty & Personal Care"
            data={ensureMinProducts(products.filter(p => p.category_id === 6), 20)}
            isButtonVisible={true}
            isDraggable={true}
          />
        </div>

        {/* Wide Banner with Image */}
        <div className="wide-promo-banner">
          <img className="wide-promo-bg" src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=300&fit=crop" alt="Sale Banner" />
          <div className="wide-promo-overlay">
            <h2>🛍️ Mega Sale is Live!</h2>
            <p>Get exclusive discounts on 1000+ products. Don't miss out!</p>
            <button className="wide-promo-btn" onClick={() => navigate('/product-list')}>View All Deals</button>
          </div>
        </div>

        {/* Best of Electronics - Already defined above but keep it here if you like */}
        <div className="grid-container">
          <CardSlider
            cardSliderTitle="⚡ Best Of Electronics"
            data={electronicsProducts}
            isButtonVisible={true}
            isDraggable={true}
          />
        </div>

        <div className="grid-container grid-9">
          <div className="home-image-banner-container">
            <a href="#" className="image-bannner">
              <div className="image-container">
                <img src={bannerImage.imagebanner} alt="Promo banner" />
              </div>
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid-container grid-10">
          <div className="shopping-feature">
            <div className="feature">
              <div className="image-con">{icons.shiping}</div>
              <div className="feature-details">
                <h1>Free Shipping</h1>
                <span>From all orders over ₹500</span>
              </div>
            </div>
            <div className="feature">
              <div className="image-con">{icons.offer}</div>
              <div className="feature-details">
                <h1>Daily Surprise Offers</h1>
                <span>Save up to 25% off</span>
              </div>
            </div>
            <div className="feature">
              <div className="image-con">{icons.discount}</div>
              <div className="feature-details">
                <h1>Affordable Prices</h1>
                <span>Get Factory direct price</span>
              </div>
            </div>
            <div className="feature">
              <div className="image-con">{icons.payment}</div>
              <div className="feature-details">
                <h1>Secure Payments</h1>
                <span>100% Protected Payments</span>
              </div>
            </div>
            <div className="feature">
              <div className="image-con">{icons.headset}</div>
              <div className="feature-details">
                <h1>Support 24/7</h1>
                <span>Shop with an expert</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay in the Loop</h2>
          <p>Subscribe for exclusive deals, new arrivals, and insider-only discounts.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" className="newsletter-input" />
            <button className="newsletter-btn">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
