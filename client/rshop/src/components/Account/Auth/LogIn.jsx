import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./style.css";

import toast from "react-hot-toast";
import {Input} from "../../index";

import { sendOTP, userStatus } from "../../../features/auth/authAPI";
import { clearErrorsMassage } from "../../../features/auth/authSlice";

import ClipLoader from "react-spinners/ClipLoader";

const LogIn = ({ showSignup }) => {
  const [proceed, setProcced] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const { state } = useLocation();

  const dispatch = useDispatch();
  const { message, isLoading } = useSelector((state) => state.auth);



  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    setFocus,
  } = useForm();

  useEffect(() => {
    setFocus("email");
  }, [showSignup]);

  useEffect(() => {
    if (proceed) {
      setTimeout(() => {
        navigate("/otp-verification", {
          state: { email_id: email, action: "login" },
        });
      }, 2000);
    }
  }, [proceed]);

  const handleLogin = async (data, e) => {
    e.preventDefault();
    const { email } = data;
    const userData = {
      email_id: email,
    };
    try {
      dispatch(clearErrorsMassage());
      const userStatusResult = await dispatch(userStatus(userData)).unwrap();
      if (userStatusResult.message === "VERIFIED") {
        dispatch(clearErrorsMassage());
        const sendOtpResult = await dispatch(sendOTP(userData)).unwrap();

        if (!sendOtpResult.success) {
          return false;
        }

        toast.success(sendOtpResult.message);

        setProcced(true);
        setEmail(email);
      }

      if (userStatusResult.message === "NOT_FOUND") {
        toast.error("You are not register with us,please sign up");
        setValue("email", "");
        showSignup();
        return false;
      }
    } catch (error) {
      toast.error(typeof error === 'string' ? error : (error?.message || "Login failed"));
    }
  };
  return (
    <div className="login-container">
      <h1 className="title">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
        <div className="input-container">
          <Input
            type="text"
            {...register("email", {
              required: { value: true, message: "Email Address is required" },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter Valid Email",
              },
            })}
            aria-invalid={errors.email ? "true" : "false"}
            className={`input-box${errors.email ? " error" : ""}`}
            required
            autoComplete="off"
          />
          <label className="label-txt">Enter Email</label>
        </div>

        {errors.email && (
          <span className="error-msg">{errors.email?.message}</span>
        )}

        <button type="submit" className="login-signup-btn">
          {!isLoading ? (
            "Request OTP"
          ) : (
            <ClipLoader
              color="#fff"
              loading={true}
              size={16}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          )}
        </button>
      </form>

      <div className="link-container">
        <Link to={"/auth"} className="link" onClick={showSignup}>
          New to Rshop? Create an account
        </Link>
      </div>
    </div>
  );
};

export default LogIn;
