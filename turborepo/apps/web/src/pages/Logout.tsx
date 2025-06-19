/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/auth/authApiSlice";
import { setCredentials } from "../redux/auth/authSlice";
import { useEffect } from "react";

// Package Imports

// Component Imports

// Asset Imports

/**
 * Logout renders a React page.
 */
const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({});
      dispatch(setCredentials({ username: "", token: "" }));
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return <></>;
};

export default Logout;
