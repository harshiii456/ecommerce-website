import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/product/productAPI";
import "../ProductListing/ProductListing.css";
import { sortTypes } from "../../common/Data";
import { icons } from "../../common/Path";
import { FilterCategories, ProductCard } from "../../components";

const Electronics = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { products, isLoading, error } = useSelector((state) => state.product);
  const [selectedSortTypeIndex, setSelectedSortTypeIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts({ search: searchQuery, category_id: "3" }));
  }, [dispatch, searchQuery]);

  return (
    <div className="product-listing-page">
      <aside className="filters-sidebar">
        <div className="heading">
          <h1>Filters</h1>
        </div>

        <div className="filter-section">
          <h1>Categories</h1>
          <div className="category-item">
            <Link to="/grocery-store">
              <span>Grocery</span>
            </Link>
          </div>
          <div className="category-item">
            <Link to="/fashion">
              <span>Fashion</span>
            </Link>
          </div>
          <div className="category-item active">
            {icons.arrowright}
            <span>Electronics</span>
          </div>
          <div className="category-item">
            <Link to="/tv-appliances">
              <span>TVs & Appliances</span>
            </Link>
          </div>
          <div className="category-item">
            <Link to="/home-furniture">
              <span>Home & Furniture</span>
            </Link>
          </div>
          <div className="category-item">
            <Link to="/toys">
              <span>Toys</span>
            </Link>
          </div>
        </div>

        <FilterCategories />
      </aside>

      <main className="results-content">
        <header className="results-header">
          <div className="search-info">
            {isLoading ? (
              <h1>Searching...</h1>
            ) : searchQuery ? (
              <h1>{products.length} Results for "{searchQuery}"</h1>
            ) : (
              <h1>Discover Electronics</h1>
            )}
          </div>
          
          <div className="sorting-options">
            <span>Sort By:</span>
            {sortTypes.map((item, index) => (
              <button
                key={index}
                className={selectedSortTypeIndex === index ? "active" : ""}
                onClick={() => setSelectedSortTypeIndex(index)}
              >
                {item}
              </button>
            ))}
          </div>
        </header>

        <section className="products-grid-container">
          {isLoading ? (
            <div className="loading">
              <div className="loader"></div>
              <span>Finding best electronics for you...</span>
            </div>
          ) : error ? (
            <div className="error">{typeof error === 'string' ? error : (error?.message || "An error occurred")}</div>
          ) : (
            <div className="products-grid">
              {products.length > 0 ? (
                products.map((data, index) => (
                  <ProductCard data={data} key={index} />
                ))
              ) : (
                <div className="empty">
                  <h2>No electronics found</h2>
                  <p>Try searching for something else or browse other categories.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Electronics;
