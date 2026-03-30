import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../features/product/productAPI';
import { addToCart } from '../../features/cart/cartSlice';
import { toggleWishlistTask } from '../../features/wishlist/wishlistSlice';
import { icons } from '../../common/Path';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProduct, isLoading, error } = useSelector((state) => state.product);
    const { wishlistItems } = useSelector((state) => state.wishlist);
    const [quantity, setQuantity] = useState(1);

    const isInWishlist = wishlistItems?.wishlistItems?.some(item => String(item.product_id) === String(id));

    useEffect(() => {
        dispatch(fetchProductById(id));
        window.scrollTo(0, 0);
    }, [dispatch, id]);

    const handleAddToCart = () => {
        dispatch(addToCart({ productId: id, quantity }));
    };

    const handleWishlist = () => {
        dispatch(toggleWishlistTask(id));
    };

    if (isLoading) return <div className="loader-container"><div className="loader"></div></div>;
    if (error) return <div className="error-container">{error}</div>;
    if (!currentProduct) return <div className="error-container">Product not found</div>;

    const discountAmount = currentProduct.price - currentProduct.discount_price;
    const discountPercentage = Math.round((discountAmount / currentProduct.price) * 100);

    return (
        <div className="product-details-page">
            <div className="product-details-container">
                <div className="image-section">
                    <div className="main-image-wrapper">
                        <img src={currentProduct.main_image_url} alt={currentProduct.product_name} />
                    </div>
                </div>

                <div className="info-section">
                    <nav className="breadcrumb">
                        <span>Home</span> {icons.arrowright} <span>Products</span> {icons.arrowright} <span className="active">{currentProduct.product_name}</span>
                    </nav>

                    <h1 className="product-title">{currentProduct.product_name}</h1>
                    
                    <div className="rating-row">
                        <div className="stars">
                            {icons.star} {icons.star} {icons.star} {icons.star} {icons.star}
                        </div>
                        <span className="review-count">(128 Reviews)</span>
                    </div>

                    <div className="price-container">
                        <span className="current-price">₹{currentProduct.discount_price || currentProduct.price}</span>
                        {currentProduct.discount_price && (
                            <>
                                <span className="original-price">₹{currentProduct.price}</span>
                                <span className="discount-badge">{discountPercentage}% OFF</span>
                            </>
                        )}
                    </div>

                    <p className="description">
                        {currentProduct.description || "Experience premium quality with this state-of-the-art product. Designed for excellence and built to last, it's the perfect addition to your collection."}
                    </p>

                    <div className="stock-info">
                        <span className={`status ${currentProduct.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {currentProduct.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {currentProduct.stock_quantity > 0 && currentProduct.stock_quantity < 10 && (
                            <span className="limited">Only {currentProduct.stock_quantity} units left!</span>
                        )}
                    </div>

                    <div className="actions-wrapper">
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(Math.min(currentProduct.stock_quantity, quantity + 1))}>+</button>
                        </div>

                        <button 
                            className="add-btn" 
                            disabled={currentProduct.stock_quantity === 0}
                            onClick={handleAddToCart}
                        >
                            {icons.cart} Add to Cart
                        </button>

                        <button 
                            className={`wish-btn ${isInWishlist ? 'active' : ''}`}
                            onClick={handleWishlist}
                        >
                            {icons.heart}
                        </button>
                    </div>

                    <div className="features-grid">
                        <div className="feature-item">
                            {icons.truck}
                            <span>Free Shipping</span>
                        </div>
                        <div className="feature-item">
                            {icons.shield}
                            <span>1 Year Warranty</span>
                        </div>
                        <div className="feature-item">
                            {icons.arrowLeft}
                            <span>7 Day Return</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
