import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlist, toggleWishlistTask } from '../../features/wishlist/wishlistSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { icons } from '../../common/Path';
import shopCart from "../../assets/images/shop-cart.png";
import './Wishlist.css';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { wishlistItems, isLoading } = useSelector((state) => state.wishlist);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getWishlist());
        }
    }, [dispatch, isAuthenticated]);

    const handleRemove = (productId) => {
        dispatch(toggleWishlistTask(productId));
    };

    const handleMoveToCart = (productId) => {
        dispatch(addToCart({ productId, quantity: 1 }));
        // dispatch(toggleWishlistTask(productId)); // Optionally remove from wishlist after adding to cart
    };

    if (!isAuthenticated) {
        return (
            <div className="wishlist-page-empty">
                <div className="empty-content">
                    <img src={shopCart} alt="Empty Wishlist" />
                    <h1>Want to save items for later?</h1>
                    <p>Login to create your personal wishlist and track your favorite products.</p>
                    <button className="auth-btn" onClick={() => window.location.href = '/auth'}>Login</button>
                </div>
            </div>
        );
    }

    const items = wishlistItems?.wishlistItems || [];

    if (isLoading && items.length === 0) {
        return <div className="loader-container"><div className="loader"></div></div>;
    }

    if (items.length === 0) {
        return (
            <div className="wishlist-page-empty">
                <div className="empty-content">
                    <div className="empty-heart">{icons.heart}</div>
                    <h1>Your Wishlist is Empty!</h1>
                    <p>Add items that you like to your wishlist so you can find them easily later.</p>
                    <button className="auth-btn" onClick={() => window.location.href = '/product-list'}>Go Shopping</button>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="wishlist-container">
                <div className="wishlist-header">
                    <h1>My Wishlist <span>({items.length} items)</span></h1>
                </div>

                <div className="wishlist-grid">
                    {items.map((item) => (
                        <div key={item.wishlist_id} className="wishlist-card">
                            <button className="remove-card-btn" onClick={() => handleRemove(item.product_id)}>
                                {icons.close}
                            </button>
                            <div className="product-image">
                                <img src={item.product.main_image_url} alt={item.product.product_name} />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{item.product.product_name}</h3>
                                <div className="price-tag">
                                    <span className="price">₹{item.product.discount_price || item.product.price}</span>
                                    {item.product.discount_price && (
                                        <span className="old-price">₹{item.product.price}</span>
                                    )}
                                </div>
                                <div className="card-actions">
                                    <button className="add-to-cart-btn" onClick={() => handleMoveToCart(item.product_id)}>
                                        {icons.cart} Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;