/**
 * @file Main navbar for the app
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

// Package Imports
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// Component Imports

// Asset Imports
import { logos } from "../../assets";
import { useSelector } from "react-redux";
import {
  selectCurrentRoles,
  selectCurrentUser,
  selectCurrentUserId,
} from "../../redux/auth/authSlice";
import { Link } from "react-router-dom";
import RenderWithAuth from "../auth/RenderWithAuth";
import { useGetNotificationsQuery } from "../../redux/profile/profileApiSlice";
import LoadingSpinner from "../misc/LoadingSpinner";

const NotificationDropdown = () => {
  const { data: notifications, isLoading } = useGetNotificationsQuery({});
  return (
    <div className="flex flex-col items-center w-full mt-1 min-h-7">
      {isLoading && <LoadingSpinner className="w-4 h-4" />}
      {notifications &&
        notifications.map((notification: any, i: number) => (
          <div
            key={i}
            className="flex flex-row items-center justify-between w-full px-2 py-1 transition hover:bg-uos-lightgray"
          >
            <h1 className="text-sm font-bold">{notification.type}</h1>
            <h1 className="text-sm">{notification.message}</h1>
          </div>
        ))}
      {notifications && notifications.length === 0 && (
        <div className="flex flex-row items-center justify-between w-full px-2 py-1 transition hover:bg-uos-lightgray">
          <h1 className="text-sm">No Notifications</h1>
        </div>
      )}
    </div>
  );
};

export type NavbarProps = {
  className?: string;
};
/**
 * Navbar renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const Navbar = (p: NavbarProps) => {
  //   const [active, setActive] = useState(false);

  const user = useSelector(selectCurrentUser);
  const roles = useSelector(selectCurrentRoles);
  const userId = useSelector(selectCurrentUserId);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);

  // console.log("user: ", user);
  // console.log("roles: ", roles);

  return (
    // <AnimatePresence>
    //   {active && (
    <motion.nav
      className={`${p.className} flex flex-col items-center justify-center w-full bg-white `}
      // initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
    >
      <div className="flex flex-row items-center justify-center w-full h-10 bg-uos-gray">
        <div className="flex flex-row items-center justify-between w-full max-w-6xl ">
          <div></div>
          <div className="flex flex-row items-center">
            {user ? (
              <div className="relative flex flex-row items-center gap-x-2">
                <button
                  className="mr-2"
                  onClick={() => {
                    setAuthDropdownOpen(false);
                    setNotificationDropdownOpen(!notificationDropdownOpen);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-bell-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                  </svg>
                </button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-person-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                </svg>
                <h1 className="text-lg font-bold">{user}</h1>
                <button
                  className="p-2"
                  onClick={() => {
                    setNotificationDropdownOpen(false);
                    setAuthDropdownOpen(!authDropdownOpen);
                  }}
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chevron-down"
                    viewBox="0 0 16 16"
                    initial={{ scaleY: 1 }}
                    animate={{
                      scaleY: authDropdownOpen ? -1 : 1,
                    }}
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.2,
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                    />
                  </motion.svg>
                </button>
                <AnimatePresence mode="wait">
                  {authDropdownOpen && (
                    <motion.div
                      className="absolute right-0 w-full overflow-hidden bg-uos-gray top-8 max-w-36"
                      initial={{
                        // opacity: 0,
                        height: 0,
                        zIndex: 30,
                      }}
                      animate={{
                        // opacity: 1,
                        height: "auto",
                        zIndex: 30,
                      }}
                      exit={{
                        // opacity: 0,
                        height: 0,
                        zIndex: 30,
                      }}
                      key="authDropdown"
                    >
                      <div className="flex flex-col items-center w-full mt-1">
                        <RenderWithAuth requiredRoles={[5150]}>
                          <Link
                            to="/admin"
                            className="w-full py-1 font-bold text-center transition hover:bg-uos-lightgray"
                          >
                            Admin
                          </Link>
                        </RenderWithAuth>
                        <RenderWithAuth requiredRoles={[1984]}>
                          <Link
                            to="/staff"
                            className="w-full py-1 font-bold text-center transition hover:bg-uos-lightgray"
                          >
                            Staff
                          </Link>
                        </RenderWithAuth>
                        <Link
                          to="/profile"
                          className="w-full py-1 text-center transition hover:bg-uos-lightgray"
                        >
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="w-full py-1 text-center transition hover:bg-uos-lightgray"
                        >
                          Settings
                        </Link>
                        <Link
                          to="/auth/logout"
                          className="w-full py-1 text-center transition hover:bg-uos-lightgray"
                        >
                          Logout
                        </Link>
                      </div>
                    </motion.div>
                  )}
                  {notificationDropdownOpen && (
                    <motion.div
                      className="absolute left-0 w-full overflow-hidden bg-uos-gray top-8 max-w-72"
                      initial={{
                        // opacity: 0,
                        height: 0,
                        zIndex: 30,
                      }}
                      animate={{
                        // opacity: 1,
                        height: "auto",
                        zIndex: 30,
                      }}
                      exit={{
                        // opacity: 0,
                        height: 0,
                        zIndex: 30,
                      }}
                      key="notificationDropdown"
                    >
                      <NotificationDropdown />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-row items-center space-x-4">
                <Link to="/auth/login">Login</Link>
                <Link to="/auth/register">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full max-w-6xl h-28">
        <div className="w-full h-full ">
          <img
            src={logos.uos_purple}
            alt="uos_purple"
            className="h-full py-5"
          />
        </div>
      </div>
    </motion.nav>
    //   )}
    // </AnimatePresence>
  );
};

export default Navbar;
