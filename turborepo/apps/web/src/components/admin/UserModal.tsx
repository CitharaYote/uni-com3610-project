/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { useState } from "react";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/users/usersApiSlice";
import ToggleSwitch from "../misc/ToggleSwitch";
import { AnimatePresence, motion } from "framer-motion";
import LoadingSpinner from "../misc/LoadingSpinner";

// Package Imports

// Component Imports

// Asset Imports

export type UserModalProps = {
  className?: string;
};

/**
 * UserModal renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const UserModal = (p: UserModalProps) => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch: refetchUsers,
  } = useGetUsersQuery({});
  const [
    updateUser,
    { data: updateData, isLoading: isUpdating, error: updateError },
  ] = useUpdateUserMutation();

  const [originalFocusedUser, setOriginalFocusedUser] = useState(null);
  const [focusedUser, setFocusedUser] = useState(null);

  console.log(users);

  const handleUpdateUser = async () => {
    console.log("Update User");
    console.log(focusedUser);
    const res = await updateUser(focusedUser);
    if (res && !updateError) {
      setOriginalFocusedUser(focusedUser);
      refetchUsers();
    }
  };

  return (
    <div className={`${p.className} w-full h-full`}>
      <AnimatePresence mode="wait">
        {isLoading && (
          //   <motion.svg
          //     xmlns="http://www.w3.org/2000/svg"
          //     width="64"
          //     height="64"
          //     fill="currentColor"
          //     className="w-16 h-16 m-auto overflow-hidden bi bi-arrow-repeat animate-spin text-uos-lightgray"
          //     viewBox="0 0 16 16"
          //     initial={{ opacity: 0 }}
          //     animate={{ opacity: 1 }}
          //     exit={{ opacity: 0 }}
          //     key="spinner-loading"
          //   >
          //     <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
          //     <path
          //       fillRule="evenodd"
          //       d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"
          //     />
          //   </motion.svg>
          <LoadingSpinner className="mt-12" />
        )}
        {isError && (
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="currentColor"
            className="w-16 h-16 m-auto bi bi-exclamation-triangle"
            viewBox="0 0 16 16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="error-icon"
          >
            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
          </motion.svg>
        )}
        {isSuccess && users && (
          <motion.div
            className="flex flex-row w-full h-full p-4 gap-x-4"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <div className="w-1/2 p-2 border bg-gray-50 rounded-xl ">
              {users.map((user) => (
                <button
                  key={user._id}
                  className="flex flex-row items-center justify-between w-full p-2 transition-colors border-t text-uos-gray hover:bg-white first:border-none first:rounded-t-lg last:rounded-b-lg"
                  onClick={() => {
                    setFocusedUser(user);
                    setOriginalFocusedUser(user);
                  }}
                >
                  <p>{user.username}</p>
                </button>
              ))}
            </div>
            <div className="flex flex-col items-center justify-between w-1/2 p-2 border bg-gray-50 rounded-xl">
              {focusedUser && focusedUser.roles && (
                <>
                  <div className="flex flex-col items-center w-full mt-2 gap-y-4 text-uos-gray">
                    <div className="flex flex-col items-center">
                      <h1 className="text-xl font-semibold text-uos-darkgray">
                        {focusedUser.username}
                      </h1>
                      <p className="italic text-uos-gray">
                        ID:{" "}
                        <span className="ml-1 not-italic text-uos-lightgray">
                          {focusedUser._id}
                        </span>
                      </p>
                      <p className="italic text-uos-gray">
                        Account Created:{" "}
                        <span className="ml-1 not-italic text-uos-lightgray">
                          {focusedUser.createdAt}
                        </span>
                      </p>
                      <p className="italic text-uos-gray">
                        Last Updated:{" "}
                        <span className="ml-1 not-italic text-uos-lightgray">
                          {focusedUser.updatedAt}
                        </span>
                      </p>
                    </div>
                    <hr className="w-full " />
                    <div className="flex flex-col items-start w-full px-4 gap-y-4">
                      <h2 className="text-lg font-semibold">Roles</h2>
                      <div className="flex flex-row items-center justify-between w-full">
                        <p>User</p>
                        <ToggleSwitch
                          state={focusedUser.roles.User === 2001}
                          setState={() => {
                            if (focusedUser.roles.User === 2001) {
                              setFocusedUser({
                                ...focusedUser,
                                roles: { ...focusedUser.roles, User: 0 },
                              });
                            } else {
                              setFocusedUser({
                                ...focusedUser,
                                roles: { ...focusedUser.roles, User: 2001 },
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-row items-center justify-between w-full">
                        <p>Staff</p>
                        <ToggleSwitch
                          state={focusedUser.roles.Editor === 1984}
                          setState={() => {
                            if (focusedUser.roles.Editor === 1984) {
                              setFocusedUser({
                                ...focusedUser,
                                roles: { ...focusedUser.roles, Editor: 0 },
                              });
                            } else {
                              setFocusedUser({
                                ...focusedUser,
                                roles: { ...focusedUser.roles, Editor: 1984 },
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-row items-center justify-between w-full">
                        <p>Admin</p>
                        <ToggleSwitch
                          state={focusedUser.roles.Admin === 5150}
                          setState={() => {
                            if (focusedUser.roles.Admin === 5150) {
                              setFocusedUser({
                                ...focusedUser,
                                roles: { ...focusedUser.roles, Admin: 0 },
                              });
                            } else {
                              setFocusedUser({
                                ...focusedUser,
                                roles: { ...focusedUser.roles, Admin: 5150 },
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <AnimatePresence>
                      {updateError && (
                        <motion.p
                          className="w-full p-2 overflow-hidden text-red-700 rounded-lg"
                          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            marginBottom: 8,
                          }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          key="error-message"
                        >
                          Error updating user: {JSON.stringify(updateError)}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <div className="flex flex-row items-center w-full gap-2 justify-evenly">
                      <button
                        className="w-full px-8 py-2 text-white transition-colors bg-red-700 rounded-lg hover:bg-red-600 disabled:bg-uos-lightgray"
                        disabled={
                          JSON.stringify(focusedUser) ===
                          JSON.stringify(originalFocusedUser)
                        }
                        onClick={() => {
                          setFocusedUser(originalFocusedUser);
                        }}
                      >
                        Revert
                      </button>
                      <button
                        className="flex flex-row items-center justify-center w-full px-8 py-2 text-white transition-colors rounded-lg bg-uos-purple hover:bg-uos-purple-hover disabled:bg-uos-lightgray"
                        disabled={
                          JSON.stringify(focusedUser) ===
                          JSON.stringify(originalFocusedUser)
                        }
                        onClick={handleUpdateUser}
                      >
                        <p className="">Save</p>
                        <AnimatePresence mode="wait">
                          {isUpdating && (
                            <motion.svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="overflow-hidden bi bi-arrow-repeat animate-spin"
                              viewBox="0 0 16 16"
                              initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                              animate={{ opacity: 1, width: 16, marginLeft: 8 }}
                              exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                              key="spinner-loading"
                            >
                              <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                              <path
                                fillRule="evenodd"
                                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"
                              />
                            </motion.svg>
                          )}
                          {updateError && (
                            <motion.svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-exclamation-triangle"
                              viewBox="0 0 16 16"
                              initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                              animate={{ opacity: 1, width: 16, marginLeft: 8 }}
                              exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                              key="error-icon"
                            >
                              <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                              <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                            </motion.svg>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserModal;
