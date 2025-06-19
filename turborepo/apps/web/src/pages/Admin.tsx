/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { useState } from "react";
import PageSkeleton from "../utils/PageSkeleton";
import Modal from "../components/misc/Modal";
import { AnimatePresence } from "framer-motion";
import { useGetUsersQuery } from "../redux/users/usersApiSlice";
import UserModal from "../components/admin/UserModal";

// Package Imports

// Component Imports

// Asset Imports

/**
 * Admin renders a React page.
 */
const Admin = () => {
  const [activeTab, setActiveTab] = useState("admin_home");
  const [activeModal, setActiveModal] = useState("");

  return (
    <PageSkeleton heading="Administrator Dashboard">
      <div className="grid w-full h-full max-w-6xl grid-cols-4 gap-8 mt-8">
        <button
          className="flex flex-col items-center col-span-4 px-4 py-8 transition-shadow bg-white shadow-lg gap-y-4 rounded-2xl hover:shadow-xl text-uos-gray"
          onClick={() => {
            setActiveModal("admin_settings");
          }}
        >
          <div className="flex flex-row items-center justify-center w-full gap-x-4 ">
            <p className="text-3xl font-light ">Manage Users</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-search text-uos-lightgray"
              viewBox="0 0 16 16"
            >
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
            </svg>
          </div>
          <div className="max-w-sm">
            <p className="text-sm font-light text-uos-gray">
              Assign roles, view user details, and more.
            </p>
          </div>
        </button>
      </div>
      <AnimatePresence>
        {activeModal === "admin_settings" && (
          <Modal
            onClick={() => {
              setActiveModal("");
            }}
            modalTitle="User List"
          >
            <UserModal />
          </Modal>
        )}
      </AnimatePresence>
    </PageSkeleton>
  );
};

export default Admin;
