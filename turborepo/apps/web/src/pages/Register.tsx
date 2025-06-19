/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import PageSkeleton from "../utils/PageSkeleton";

// Package Imports
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../redux/auth/authApiSlice";
import { setCredentials } from "../redux/auth/authSlice";

// Component Imports

// Asset Imports

/**
 * Register renders a React page.
 */
const Register = () => {
  const [registerDetails, setRegisterDetails] = useState({
    username: "",
    password: "",
    errorMessage: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement>(null);
  const [register, { isLoading, error }] = useRegisterMutation();
  const [login, { isLoadingLogin, errorLogin }] = useLoginMutation();

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setRegisterDetails((prev) => ({
      ...prev,
      errorMessage: "",
    }));
  }, [registerDetails.username, registerDetails.password]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!registerDetails.username || !registerDetails.password) {
      setRegisterDetails((prev) => ({
        ...prev,
        errorMessage: "Please enter your username and password",
      }));
      return;
    }

    console.log(registerDetails);

    try {
      const userData = await register({
        user: registerDetails.username,
        pwd: registerDetails.password,
      }).unwrap();
      dispatch(setCredentials(userData));
      setRegisterDetails((prev) => ({
        username: "",
        password: "",
        errorMessage: "",
      }));
      navigate("/");
      try {
        console.log("logging in");
        console.log(registerDetails);

        const userData = await login({
          user: registerDetails.username,
          pwd: registerDetails.password,
        }).unwrap();
        dispatch(
          setCredentials({
            token: userData.accessToken,
            user: registerDetails.username,
            roles: userData.roles,
          })
        );
        console.log("res: ", userData.accessToken);

        setRegisterDetails(() => ({
          username: "",
          password: "",
          errorMessage: "",
        }));
        navigate("/");
      } catch (error) {
        console.log(error);

        if (!error) {
          setRegisterDetails((prev) => ({
            ...prev,
            errorMessage: "An error occurred. Please try again later.",
          }));
        } else if (error?.originalStatus === 401) {
          setRegisterDetails((prev) => ({
            ...prev,
            errorMessage: "Incorrect username or password",
          }));
        } else {
          setRegisterDetails((prev) => ({
            ...prev,
            errorMessage: "An error occurred. Please try again later.",
          }));
        }
      }
    } catch (error) {
      if (!error) {
        setRegisterDetails((prev) => ({
          ...prev,
          errorMessage: "An error occurred. Please try again later.",
        }));
      } else if (error?.originalStatus === 401) {
        setRegisterDetails((prev) => ({
          ...prev,
          errorMessage: "How tf did you manage to get this error?",
        }));
      } else {
        setRegisterDetails((prev) => ({
          ...prev,
          errorMessage: "An error occurred. Please try again later.",
        }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [usernameFocusError, setUsernameFocusError] = useState(false);
  const [passwordFocusError, setPasswordFocusError] = useState(false);

  return (
    <PageSkeleton heading="Register">
      <div className="flex flex-col items-center col-span-4 px-8 py-8 mt-8 transition-shadow bg-white shadow-lg gap-y-4 rounded-2xl hover:shadow-xl text-uos-gray">
        <p className="text-lg font-light">Register your account</p>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col items-center gap-4"
        >
          <input
            type="text"
            name="username"
            value={registerDetails.username}
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
            value={registerDetails.password}
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
            Register
          </button>
        </form>
      </div>
    </PageSkeleton>
  );
};

export default Register;
