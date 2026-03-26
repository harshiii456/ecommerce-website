import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, sendOTP, userStatus } from "../../../features/auth/authAPI";
import { clearErrorsMassage } from "../../../features/auth/authSlice";
import { MdShoppingCart, MdEmail, MdLock, MdArrowForward } from "react-icons/md";
import toast from "react-hot-toast";

const CustomerLogin = ({ showSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading: authLoading, error, message } = useSelector((state) => state.auth);

  const handleUserStatus = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await dispatch(userStatus({ email_id: email })).unwrap();
      
      if (response && (response.data?.userStatus === 'NOT_FOUND' || response.message === 'NOT_FOUND')) {
        toast.error("User not found, please sign up");
        return;
      }
      
      await dispatch(sendOTP({ email_id: email })).unwrap();
      setShowOtp(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter email");
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(sendOTP({ email_id: email })).unwrap();
      toast.success("OTP sent to your email");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(LogIn({ email_id: email, password, otp })).unwrap();
      
      // Redirect customers to home page
      const userData = result.data?.user || result.data || {};
      if (userData.role === 'customer' || !userData.role || userData.user_role_id !== 2) {
        navigate("/");
      } else {
        toast.error("Admin users should use the admin login page.");
        dispatch(logOut());
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    dispatch(clearErrorsMassage());
  }, [dispatch]);

  React.useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(typeof error === 'string' ? error : (error?.message || "An error occurred"));
    }
  }, [message, error]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '32rem', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            margin: '0 auto', 
            height: '4rem', 
            width: '4rem', 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <MdShoppingCart style={{ height: '2rem', width: '2rem', color: 'white' }} />
          </div>
          <h2 style={{ marginTop: '1.5rem', fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem' }}>
            Sign in to your shopping account
          </p>
        </div>

        {/* Form */}
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem', 
          padding: '2.5rem', 
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
        }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={showOtp ? handleLogin : handleUserStatus}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)', paddingLeft: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <MdEmail style={{ height: '1.25rem', width: '1.25rem', color: '#6B7280' }} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ 
                    appearance: 'none', 
                    display: 'block', 
                    width: '100%', 
                    paddingLeft: '3rem', 
                    paddingRight: '1rem', 
                    paddingTop: '0.75rem', 
                    paddingBottom: '0.75rem', 
                    border: '2px solid #E5E7EB', 
                    borderRadius: '0.5rem', 
                    fontSize: '1rem',
                    backgroundColor: showOtp ? '#F9FAFB' : 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  placeholder="customer@example.com"
                  disabled={showOtp}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>

            {/* OTP Field */}
            {showOtp && (
              <div>
                <label htmlFor="otp" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  One-Time Password
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ 
                    marginTop: '0.25rem', 
                    appearance: 'none', 
                    display: 'block', 
                    width: '100%', 
                    paddingLeft: '1rem', 
                    paddingRight: '1rem', 
                    paddingTop: '0.75rem', 
                    paddingBottom: '0.75rem', 
                    border: '2px solid #E5E7EB', 
                    borderRadius: '0.5rem', 
                    fontSize: '1rem',
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  placeholder="Enter 4-digit OTP"
                  maxLength={4}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || authLoading}
                style={{
                  position: 'relative', 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  paddingTop: '0.875rem', 
                  paddingBottom: '0.875rem', 
                  paddingLeft: '1rem', 
                  paddingRight: '1rem', 
                  border: 'none', 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  borderRadius: '0.5rem', 
                  color: 'white', 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  outline: 'none', 
                  cursor: (isLoading || authLoading) ? 'not-allowed' : 'pointer',
                  opacity: (isLoading || authLoading) ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (!isLoading && !authLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                }}
              >
                {(isLoading || authLoading) ? (
                  <div style={{ 
                    borderRadius: '50%', 
                    height: '1.25rem', 
                    width: '1.25rem', 
                    border: '2px solid white', 
                    borderTop: '2px solid transparent', 
                    animation: 'spin 1s linear infinite' 
                  }}></div>
                ) : showOtp ? (
                  "Sign In"
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>

            {/* Send OTP Button */}
            {showOtp && (
              <div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || authLoading}
                  style={{
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    paddingTop: '0.75rem', 
                    paddingBottom: '0.75rem', 
                    paddingLeft: '1rem', 
                    paddingRight: '1rem', 
                    border: '2px solid #E5E7EB', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    borderRadius: '0.5rem', 
                    color: '#6B7280', 
                    backgroundColor: 'white', 
                    outline: 'none', 
                    cursor: (isLoading || authLoading) ? 'not-allowed' : 'pointer',
                    opacity: (isLoading || authLoading) ? 0.7 : 1,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading && !authLoading) {
                      e.target.style.backgroundColor = '#F9FAFB';
                      e.target.style.borderColor = '#D1D5DB';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#E5E7EB';
                  }}
                >
                  Resend OTP
                </button>
              </div>
            )}
          </form>

          {/* Links */}
          <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {showSignup && (
              <button
                onClick={showSignup}
                style={{
                  fontSize: '0.875rem', 
                  color: '#10b981', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '0.5rem'
                }}
              >
                Don't have an account? Sign Up
              </button>
            )}
            
            <Link
              to="/admin/login"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '0.875rem', 
                color: '#6B7280', 
                textDecoration: 'none',
                gap: '0.5rem'
              }}
            >
              Admin Login
              <MdArrowForward style={{ height: '1rem', width: '1rem' }} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
