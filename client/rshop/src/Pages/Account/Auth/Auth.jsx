import React, { useState } from "react";
import { useSelector } from "react-redux";

import "./Auth.css"
import { Login, SignUp } from "../../../components";
import CustomerLogin from "./CustomerLogin";
import AdminLogin from "./AdminLogin";
import { Navigate } from "react-router-dom";

const Auth = () => {
    const [signup, setSignup] = useState(false);
    const [loginType, setLoginType] = useState("customer"); // "customer" or "admin"
    const { message, isLoading, isAuthenticated } = useSelector((state) => state.auth);

    const showSignup = () => {
        setSignup(!signup)
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="auth-wrapper">
            {signup ? (
                <SignUp showSignup={showSignup} />
            ) : (
                <div className="login-type-selector">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '4px' }}>
                            <button
                                onClick={() => setLoginType("customer")}
                                style={{
                                    padding: '8px 24px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    backgroundColor: loginType === "customer" ? '#059669' : 'transparent',
                                    color: loginType === "customer" ? 'white' : '#4B5563',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Customer Login
                            </button>
                            <button
                                onClick={() => setLoginType("admin")}
                                style={{
                                    padding: '8px 24px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    backgroundColor: loginType === "admin" ? '#2563EB' : 'transparent',
                                    color: loginType === "admin" ? 'white' : '#4B5563',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Admin Login
                            </button>
                        </div>
                    </div>

                    {loginType === "customer" ? (
                        <CustomerLogin showSignup={showSignup} />
                    ) : (
                        <AdminLogin />
                    )}
                </div>
            )}
        </div>
    )
}

export default Auth