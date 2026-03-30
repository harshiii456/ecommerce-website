import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../../features/cart/cartSlice';
import { icons } from '../../common/Path';
import useToastNotification from '../../hooks/useToastNotification';
import './Checkout.css';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { cartItems, isLoading } = useSelector((state) => state.cart);
    const { notificationComponent, triggerNotification } = useToastNotification();
    
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: ''
    });
    
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [razorpayOrder, setRazorpayOrder] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }
        dispatch(getCart());
    }, [dispatch, isAuthenticated, navigate]);

    const items = cartItems?.cartItems || [];
    const subtotal = items.reduce((acc, item) => acc + (item.product.discount_price || item.product.price) * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 40;
    const total = subtotal + shipping;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateAddress = () => {
        if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || 
            !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
            alert('Please fill in all required fields');
            return false;
        }
        if (shippingAddress.phone.length !== 10) {
            alert('Please enter a valid 10-digit phone number');
            return false;
        }
        if (shippingAddress.pincode.length !== 6) {
            alert('Please enter a valid 6-digit pincode');
            return false;
        }
        return true;
    };

    const createRazorpayOrder = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    amount: total,
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`
                })
            });

            const data = await response.json();
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to create payment order');
            }
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            throw error;
        }
    };

    const handleRazorpayPayment = async () => {
        if (!validateAddress()) return;

        setIsProcessing(true);
        try {
            const orderData = await createRazorpayOrder();
            
            const options = {
                key: 'rzp_test_SWBt10uxXsXQCq', // Your Razorpay test key
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'RShop Ecommerce',
                description: 'Purchase from RShop',
                order_id: orderData.razorpay_order_id,
                handler: async function (response) {
                    // Verify payment on backend
                    try {
                        console.log("Sending payment verification...");
                        const verifyResponse = await fetch('http://localhost:8000/api/v1/payment/verify-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                shipping_address: shippingAddress
                            })
                        });

                        const verifyData = await verifyResponse.json();
                        if (verifyData.success) {
                            // Clear cart in Redux store
                            dispatch(getCart());
                            
                            // Show success toast notification
                            triggerNotification({
                                type: 'success',
                                message: 'Payment successful! Order placed successfully.',
                                duration: 3000
                            });
                            
                            // Redirect to dashboard after a short delay
                            setTimeout(() => {
                                navigate('/customer/dashboard');
                            }, 1500);
                        } else {
                            triggerNotification({
                                type: 'error',
                                message: 'Payment verification failed. Please contact support.',
                                duration: 3000
                            });
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        triggerNotification({
                            type: 'error',
                            message: 'Payment verification failed. Please contact support.',
                            duration: 3000
                        });
                    }
                },
                prefill: {
                    name: shippingAddress.fullName,
                    contact: shippingAddress.phone,
                    email: ''
                },
                theme: {
                    color: '#3399cc'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                alert('Payment failed. Please try again.');
            });

            rzp.open();
        } catch (error) {
            console.error('Payment error:', error);
            alert('Failed to initiate payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCashOnDelivery = async () => {
        if (!validateAddress()) return;

        setIsProcessing(true);
        try {
            const response = await fetch('http://localhost:8000/api/v1/order/place-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    shipping_address: shippingAddress,
                    payment_method: 'COD'
                })
            });

            const data = await response.json();
            if (data.success) {
                // Clear cart in Redux store
                dispatch(getCart());
                
                // Show success toast notification
                triggerNotification({
                    type: 'success',
                    message: 'Order placed successfully! You will pay on delivery.',
                    duration: 3000
                });
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    navigate('/customer/dashboard');
                }, 1500);
            } else {
                triggerNotification({
                    type: 'error',
                    message: 'Failed to place order. Please try again.',
                    duration: 3000
                });
            }
        } catch (error) {
            console.error('COD order error:', error);
            triggerNotification({
                type: 'error',
                message: 'Failed to place order. Please try again.',
                duration: 3000
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePlaceOrder = () => {
        if (paymentMethod === 'razorpay') {
            handleRazorpayPayment();
        } else {
            handleCashOnDelivery();
        }
    };

    if (isLoading) {
        return <div className="loader-container"><div className="loader"></div></div>;
    }

    if (items.length === 0) {
        return (
            <div className="checkout-empty">
                <h1>Your cart is empty</h1>
                <button onClick={() => navigate('/product-list')}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-sections">
                    <div className="shipping-section">
                        <h2>Shipping Address</h2>
                        <form className="address-form">
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name*"
                                    value={shippingAddress.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number*"
                                    value={shippingAddress.phone}
                                    onChange={handleInputChange}
                                    maxLength="10"
                                    required
                                />
                            </div>
                            <input
                                type="text"
                                name="address"
                                placeholder="Street Address*"
                                value={shippingAddress.address}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City*"
                                    value={shippingAddress.city}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State*"
                                    value={shippingAddress.state}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="Pincode*"
                                    value={shippingAddress.pincode}
                                    onChange={handleInputChange}
                                    maxLength="6"
                                    required
                                />
                                <input
                                    type="text"
                                    name="landmark"
                                    placeholder="Landmark (Optional)"
                                    value={shippingAddress.landmark}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </form>
                    </div>

                    <div className="payment-section">
                        <h2>Payment Method</h2>
                        <div className="payment-methods">
                            <label className="payment-option">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="razorpay"
                                    checked={paymentMethod === 'razorpay'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div className="payment-card">
                                    <div className="payment-info">
                                        <span className="payment-icon">💳</span>
                                        <div>
                                            <strong>Razorpay</strong>
                                            <p>UPI, Credit Card, Debit Card, Net Banking</p>
                                        </div>
                                    </div>
                                </div>
                            </label>
                            <label className="payment-option">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div className="payment-card">
                                    <div className="payment-info">
                                        <span className="payment-icon">💵</span>
                                        <div>
                                            <strong>Cash on Delivery</strong>
                                            <p>Pay when you receive the order</p>
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="order-summary-section">
                    <div className="summary-card">
                        <h2>Order Summary</h2>
                        <div className="order-items">
                            {items.map((item) => (
                                <div key={item.cart_item_id} className="order-item">
                                    <img src={item.product.main_image_url} alt={item.product.product_name} />
                                    <div className="item-info">
                                        <h4>{item.product.product_name}</h4>
                                        <p>Qty: {item.quantity}</p>
                                    </div>
                                    <div className="item-price">
                                        ₹{(item.product.discount_price || item.product.price) * item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        <button 
                            className="place-order-btn" 
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : `Place Order • ₹${total.toFixed(2)}`}
                        </button>
                        <div className="secure-checkout">
                            {icons.shield} <span>100% Secure Transaction</span>
                        </div>
                    </div>
                </div>
            </div>
            {notificationComponent}
        </div>
    );
};

export default Checkout;
