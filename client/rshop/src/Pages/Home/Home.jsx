import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

import { productsCardData, productsData } from "../../common/Data";
import { bannerImage, icons } from "../../common/Path";

import CategoryBar from "./CategoryBar/CategoryBar";
import ImageSlider from "./ImageSlider/ImageSlider";

import { CardSlider, HomeBoxContainer } from "../../components";

import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/product/productAPI";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        product_name: item.name,
        price: item.price,
        discount_price: item.discountPrice || item.price,
        description: item.description,
        main_image_url: item.image,
        rating: item.rating || 4.5,
        stock_quantity: item.stock || 15,
        category_id: item.categoryId || 12,
      }));
    }
    return dbProducts;
  };

  const allProducts = ensureMinProducts(products);

  // Filter products for different sections
  const electronicsProducts = allProducts.filter(item => item.category_id === 3);
  const fashionProducts = allProducts.filter(item => item.category_id === 8);
  const groceryProducts = allProducts.filter(item => item.category_id === 12);
  const mobileProducts = allProducts.filter(item => item.category_id === 1);
  const tvApplianceProducts = allProducts.filter(item => item.category_id === 15);
  const furnitureProducts = allProducts.filter(item => item.category_id === 10);
  const toysProducts = allProducts.filter(item => item.category_id === 16);

  // Sample data for sliders
  const sampleElectronics = electronicsProducts.slice(0, 5);
  const sampleFashion = fashionProducts.slice(0, 5);
  const sampleGrocery = groceryProducts.slice(0, 5);
  const sampleMobile = mobileProducts.slice(0, 5);

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/grocery-store?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (isLoading) {
    return (
      <div className="home-page-wrapper">
        <div className="loading-container">
          <div className="loader"></div>
          <span>Finding amazing products for you...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page-wrapper">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">🔥 Trending Now</span>
          <h1 className="hero-title">Discover Amazing Deals</h1>
          <p className="hero-subtitle">Up to 70% off on top brands. Shop the latest trends in fashion, electronics & more.</p>
          <div className="hero-buttons">
            <Link to="/grocery-store" className="btn-primary">Shop Grocery</Link>
            <button className="hero-btn secondary" onClick={() => navigate('/grocery-store')}>Explore Electronics</button>
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

      {/* Category Bar */}
      <CategoryBar />

      {/* Best of Electronics */}
      <div className="grid-container full-width-section">
        <CardSlider
          cardSliderTitle="⚡ Best Of Electronics"
          data={sampleElectronics}
          isButtonVisible={true}
          isDraggable={true}
          buttonText="View All"
          buttonLink="/electronics"
        />
      </div>

      {/* Fashion Trends */}
      <div className="grid-container full-width-section">
        <CardSlider
          cardSliderTitle="🛍️ Fashion Trends"
          data={sampleFashion}
          isButtonVisible={true}
          isDraggable={true}
          buttonText="View All"
          buttonLink="/fashion"
        />
      </div>

      {/* Grocery Essentials */}
      <div className="grid-container full-width-section">
        <CardSlider
          cardSliderTitle="🛒 Grocery Essentials"
          data={sampleGrocery}
          isButtonVisible={true}
          isDraggable={true}
          buttonText="View All"
          buttonLink="/grocery-store"
        />
      </div>

      {/* Mobile Phones */}
      <div className="grid-container full-width-section">
        <CardSlider
          cardSliderTitle="📱 Mobile Phones"
          data={sampleMobile}
          isButtonVisible={true}
          isDraggable={true}
          buttonText="View All"
          buttonLink="/mobile-phone-store"
        />
      </div>

      {/* Wide Banner with Image */}
      <div className="wide-promo-banner">
        <img className="wide-promo-bg" src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=300&fit=crop" alt="Sale Banner" />
        <div className="wide-promo-overlay">
          <h2>🛍️ Mega Sale is Live!</h2>
          <p>Get exclusive discounts on 1000+ products. Don't miss out!</p>
          <button className="wide-promo-btn" onClick={() => navigate('/grocery-store')}>View All Deals</button>
        </div>
      </div>

      {/* Best of Fashion */}
      <div className="grid-container full-width-section">
        <CardSlider
          cardSliderTitle="💄 Best of Fashion"
          data={fashionProducts.slice(0, 10)}
          isButtonVisible={true}
          isDraggable={true}
          buttonText="View All"
          buttonLink="/fashion"
        />
      </div>

      {/* Home & Furniture */}
      <div className="grid-container full-width-section">
        <CardSlider
          cardSliderTitle="🏠 Home & Furniture"
          data={furnitureProducts.slice(0, 10)}
          isButtonVisible={true}
          isDraggable={true}
          buttonText="View All"
          buttonLink="/home-furniture"
        />
      </div>

      {/* TVs & Appliances */}
      <div className="grid-container full-width-section">
        <CardSlider
          cardSliderTitle="📺 TVs & Appliances"
          data={tvApplianceProducts.slice(0, 10)}
          isButtonVisible={true}
          isDraggable={true}
          buttonText="View All"
          buttonLink="/tv-appliances"
        />
      </div>

      {/* Toys & Games */}
      <div className="grid-container full-width-section">
        <CardSlider
          cardSliderTitle="🎮 Toys & Games"
          data={toysProducts.slice(0, 10)}
          isButtonVisible={true}
          isDraggable={true}
          buttonText="View All"
          buttonLink="/toys"
        />
      </div>

      <HomeBoxContainer />
    </div>
  );
};

export default Home;
