import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, sendOTP, userStatus, logOut } from "../../../features/auth/authAPI";
import { clearErrorsMassage } from "../../../features/auth/authSlice";
import { MdAdminPanelSettings, MdEmail, MdLock, MdArrowBack, MdWarning } from "react-icons/md";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading: authLoading, error, message } = useSelector((state) => state.auth);

  // Define admin email
  const ADMIN_EMAIL = "harshita@gmail.com";

  const handleUserStatus = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter email");
      return;
    }

    // Check if email matches admin email
    if (email !== ADMIN_EMAIL) {
      toast.error("Access denied. This login is restricted to administrators only.");
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(userStatus({ email_id: email })).unwrap();
      setShowOtp(true);
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

    // Final check for admin email before login
    if (email !== ADMIN_EMAIL) {
      toast.error("Access denied. Only authorized administrators can access this portal.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(LogIn({ email_id: email, password, otp })).unwrap();
      
      // Check if user is admin
      const userData = result?.data?.user || result?.data || result;
      if (userData?.role === 'admin' || userData?.user_role_id === 2) {
        navigate("/admin/dashboard");
      } else {
        toast.error("Access denied. This login is for administrators only.");
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a8a 0%, #2d3748 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '32rem', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            margin: '0 auto', 
            height: '4rem', 
            width: '4rem', 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <MdAdminPanelSettings style={{ height: '2rem', width: '2rem', color: 'white' }} />
          </div>
          <h2 style={{ marginTop: '1.5rem', fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
            Admin Portal
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem' }}>
            Secure access to management dashboard
          </p>
        </div>

        {/* Form */}
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem', 
          padding: '2.5rem', 
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
        }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={showOtp ? handleLogin : handleUserStatus}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Admin Email
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
                  placeholder={ADMIN_EMAIL}
                  disabled={showOtp}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>

            {/* OTP Field */}
            {showOtp && (
              <div>
                <label htmlFor="otp" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Verification Code
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
                  placeholder="Enter 4-digit code"
                  maxLength={4}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
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
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                  outline: 'none', 
                  cursor: (isLoading || authLoading) ? 'not-allowed' : 'pointer',
                  opacity: (isLoading || authLoading) ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (!isLoading && !authLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
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
                  "Access Dashboard"
                ) : (
                  "Send Code"
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
                  Resend Code
                </button>
              </div>
            )}
          </form>

          {/* Links */}
          <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link
              to="/auth"
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
              <MdArrowBack style={{ height: '1rem', width: '1rem' }} />
              Customer Login
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem', 
            fontSize: '0.75rem', 
            color: 'rgba(255, 255, 255, 0.7)' 
          }}>
            <MdWarning style={{ height: '1rem', width: '1rem', color: '#EF4444' }} />
            <span>Unauthorized access will be logged</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
