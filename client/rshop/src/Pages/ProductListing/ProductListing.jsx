import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/product/productAPI";
import "./ProductListing.css";

import { sortTypes } from "../../common/Data";
import { icons } from "../../common/Path";

import { FilterCategories, ProductCard } from "../../components";

const ProductListing = ({}) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { products, isLoading, error } = useSelector((state) => state.product);
  const [selectedSortTypeIndex, setSelectedSortTypeIndex] = useState(0);

  // console.log("Products from state:", products);

  useEffect(() => {
    dispatch(fetchProducts({ search: searchQuery }));
  }, [dispatch, searchQuery]);


  return (
    <div className="product-listing-page">
      <aside className="filters-sidebar">
        <div className="heading">
          <h1>Filters</h1>
        </div>

        <div className="filter-section">
          <h1>Categories</h1>
          <div className="category-item active">
            {icons.arrowright}
            <span>All Categories</span>
          </div>
          <div className="category-item">
            <span>Electronics</span>
          </div>
          <div className="category-item">
            <span>Fashion</span>
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
              <h1>Discover All Products</h1>
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
              <span>Finding the best products for you...</span>
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
                  <h2>No products found</h2>
                  <p>Try searching for something else or browse categories.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProductListing;
