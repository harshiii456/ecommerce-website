import React from 'react';
import './CustomerCare.css';
import { icons } from '../../common/Path';

const CustomerCare = () => {
    return (
        <div className="customer-care-page">
            <div className="hero-section">
                <h1>How can we help you today?</h1>
                <p>Search our support topics or contact our specialist team.</p>
                <div className="search-bar">
                    <input type="text" placeholder="Search help articles..." />
                    <button>{icons.search}</button>
                </div>
            </div>

            <div className="main-content">
                <div className="quick-stats">
                    <div className="stat-card">
                        <div className="icon-box blue">{icons.truck}</div>
                        <h3>Track Order</h3>
                        <p>Check the status of your current shipments.</p>
                    </div>
                    <div className="stat-card">
                        <div className="icon-box green">{icons.undo}</div>
                        <h3>Returns & Refunds</h3>
                        <p>Initiate a return or check refund status.</p>
                    </div>
                    <div className="stat-card">
                        <div className="icon-box purple">{icons.shield}</div>
                        <h3>Account & Safety</h3>
                        <p>Manage your profile and security settings.</p>
                    </div>
                </div>

                <div className="support-sections">
                    <div className="contact-channels">
                        <h2>Contact Us</h2>
                        <div className="channel">
                            <div className="channel-icon">{icons.message}</div>
                            <div className="channel-info">
                                <h3>Live Chat</h3>
                                <p>Average wait time: <span className="highlight">2 mins</span></p>
                                <button className="chat-btn">Start Chat</button>
                            </div>
                        </div>
                        <div className="channel">
                            <div className="channel-icon">{icons.phone}</div>
                            <div className="channel-info">
                                <h3>Phone Support</h3>
                                <p>Call us at: <span className="highlight">+1 (800) RSHOP-NOW</span></p>
                                <p>Available 24/7</p>
                            </div>
                        </div>
                        <div className="channel">
                            <div className="channel-icon">{icons.mail}</div>
                            <div className="channel-info">
                                <h3>Email Support</h3>
                                <p>Response within <span className="highlight">24 hours</span></p>
                                <button className="email-btn">Send Email</button>
                            </div>
                        </div>
                    </div>

                    <div className="faq-section">
                        <h2>Frequently Asked Questions</h2>
                        <div className="faq-item">
                            <h3>When will my order arrive?</h3>
                            <p>Most orders are delivered within 3-5 business days. You can track your package using the tracking ID sent to your email.</p>
                        </div>
                        <div className="faq-item">
                            <h3>How do I return an item?</h3>
                            <p>You can return any item within 30 days of delivery. Visit your "My Orders" page and click on "Return Item" for the specific product.</p>
                        </div>
                        <div className="faq-item">
                            <h3>What payment methods are accepted?</h3>
                            <p>We accept all major credit cards, UPI, and net banking options. Secure checkout is guaranteed.</p>
                        </div>
                        <button className="view-all-faq">View All FAQs</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerCare;
