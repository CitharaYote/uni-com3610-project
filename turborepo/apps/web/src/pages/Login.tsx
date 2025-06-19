/**
 * @file Login page for the app
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import PageSkeleton from "../utils/PageSkeleton";

// Package Imports
import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/auth/authSlice";
import { useLoginMutation } from "../redux/auth/authApiSlice";

// Component Imports

// Asset Imports

/**
 * Login renders a React page.
 */
const Login = () => {
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
    errorMessage: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || { pathname: "/" };

  const usernameRef = useRef<HTMLInputElement>(null);
  const [login, { isLoading, error }] = useLoginMutation();

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setLoginDetails((prev) => ({
      ...prev,
      errorMessage: "",
    }));
  }, [loginDetails.username, loginDetails.password]);

  useEffect(() => {
    console.log("loginDetails.error changed: ", loginDetails.errorMessage);
  }, [loginDetails.errorMessage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("logging in");
      console.log(loginDetails);

      const userData = await login({
        user: loginDetails.username,
        pwd: loginDetails.password,
      }).unwrap();
      dispatch(
        setCredentials({
          token: userData.accessToken,
          user: loginDetails.username,
          userId: userData.userId,
          roles: userData.roles,
        })
      );
      console.log("res: ", userData.accessToken);

      setLoginDetails(() => ({
        username: "",
        password: "",
        errorMessage: "",
      }));
      navigate(from);
    } catch (error) {
      console.log(error);

      if (!error) {
        setLoginDetails((prev) => ({
          ...prev,
          errorMessage: "An error occurred. Please try again later.",
        }));
      } else if (error?.originalStatus === 401) {
        setLoginDetails((prev) => ({
          ...prev,
          errorMessage: "Incorrect username or password",
        }));
      } else {
        setLoginDetails((prev) => ({
          ...prev,
          errorMessage: "An error occurred. Please try again later.",
        }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [usernameFocusError, setUsernameFocusError] = useState(false);
  const [passwordFocusError, setPasswordFocusError] = useState(false);

  return (
    <PageSkeleton heading="Login">
      <div className="flex flex-col items-center col-span-4 px-8 py-8 mt-8 transition-shadow bg-white shadow-lg gap-y-4 rounded-2xl hover:shadow-xl text-uos-gray">
        <p className="text-lg font-light">Login</p>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col items-center gap-4"
          autoComplete="off"
        >
          <input
            type="text"
            name="username"
            value={loginDetails.username}
            onChange={handleChange}
            placeholder="Username"
            disabled={isLoading}
            className={`w-full px-2 py-2 transition-colors border rounded-md  focus:outline-none focus:border-uos-purple peer ${usernameFocusError ? "border-red-600" : "border-uos-gray"}`}
            onBlur={(e) => {
              if (e.target.value === "") {
                setUsernameFocusError(true);
              } else {
                setUsernameFocusError(false);
              }
            }}
            ref={usernameRef}
          />
          <input
            type="password"
            name="password"
            value={loginDetails.password}
            onChange={handleChange}
            placeholder="Password"
            disabled={isLoading}
            className={`w-full px-2 py-2 transition-colors border rounded-md  focus:outline-none focus:border-uos-purple peer ${passwordFocusError ? "border-red-600" : "border-uos-gray"}`}
            onBlur={(e) => {
              if (e.target.value === "") {
                setPasswordFocusError(true);
              } else {
                setPasswordFocusError(false);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-1/2 p-2 text-white transition rounded-md bg-uos-purple hover:bg-uos-purple-hover disabled:bg-gray-300 disabled:cursor-not-allowed hover:drop-shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </PageSkeleton>
  );
};

export default Login;
