import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, removeFromCart, addToCart, updateCartItem } from '../../features/cart/cartSlice';
import { icons } from '../../common/Path';
import shopCart from "../../assets/images/shop-cart.png";
import './Cart.css';

const Cart = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { cartItems, isLoading } = useSelector((state) => state.cart);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getCart());
        }
    }, [dispatch, isAuthenticated]);

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        dispatch(addToCart({ productId, quantity: newQuantity - 1 })); // API adds to existing
        // Wait, our API 'addProductToCart' adds QUANTITY to existing.
        // If we want to SET quantity, we should check updateCartItem which I saw in controller.
    };

    if (!isAuthenticated) {
        return (
            <div className="cart-page-empty">
                <div className="empty-content">
                    <img src={shopCart} alt="Empty Cart" />
                    <h1>Missing Cart items?</h1>
                    <p>Login to see the items you added previously</p>
                    <button className="auth-btn" onClick={() => window.location.href = '/auth'}>Login</button>
                </div>
            </div>
        );
    }

    // Process cart data
    const items = cartItems?.cartItems || [];
    const subtotal = items.reduce((acc, item) => {
        const price = parseFloat(item.product.price) || 0;
        const discountPrice = parseFloat(item.product.discount_price) || price;
        return acc + discountPrice * item.quantity;
    }, 0);
    const shipping = subtotal > 500 ? 0 : 40;
    const total = subtotal + shipping;

    if (isLoading && items.length === 0) {
        return <div className="loader-container"><div className="loader"></div></div>;
    }

    if (items.length === 0) {
        return (
            <div className="cart-page-empty">
                <div className="empty-content">
                    <img src={shopCart} alt="Empty Cart" />
                    <h1>Your Cart is Empty!</h1>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <button className="auth-btn" onClick={() => window.location.href = '/grocery-store'}>Shop Now</button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-grid">
                <div className="cart-items-section">
                    <div className="section-header">
                        <h1>Shopping Cart ({items.length} items)</h1>
                    </div>

                    <div className="items-list">
                        {items.map((item) => {
                            const price = parseFloat(item.product.price) || 0;
                            const discountPrice = parseFloat(item.product.discount_price) || price;
                            
                            return (
                            <div key={item.cart_item_id} className="cart-item">
                                <div className="item-image">
                                    <img src={item.product.main_image_url} alt={item.product.product_name} />
                                </div>
                                <div className="item-details">
                                    <div className="item-main-info">
                                        <h3>{item.product.product_name}</h3>
                                        <p className="brand">RShop Brand</p>
                                        <div className="item-price">
                                            <span className="current">₹{discountPrice.toFixed(2)}</span>
                                            {discountPrice < price && (
                                                <span className="original">₹{price.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        <div className="qty-controls">
                                            <button 
                                                onClick={() => dispatch(updateCartItem({ productId: item.product_id, quantity: item.quantity - 1 }))} 
                                                disabled={item.quantity <= 1}
                                            >-</button>
                                            <span>{item.quantity}</span>
                                            <button 
                                                onClick={() => dispatch(updateCartItem({ productId: item.product_id, quantity: item.quantity + 1 }))}
                                                disabled={item.quantity >= item.product.stock_quantity}
                                            >+</button>
                                        </div>
                                        <button className="remove-btn" onClick={() => handleRemove(item.product_id)}>
                                            {icons.delete} Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>

                <div className="cart-summary-section">
                    <div className="summary-card">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className={shipping === 0 ? 'free' : ''}>
                                {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="summary-row divider">
                            <span>Total</span>
                            <span className="total-amount">₹{total.toFixed(2)}</span>
                        </div>
                        <button className="checkout-btn" onClick={() => window.location.href = '/checkout'}>Proceed to Checkout</button>
                        <div className="secure-checkout">
                            {icons.shield} <span>100% Secure Transaction</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;