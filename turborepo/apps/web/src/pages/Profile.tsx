/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { useState } from "react";
import { useGetProfileQuery } from "../redux/profile/profileApiSlice";
import PageSkeleton from "../utils/PageSkeleton";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "../components/misc/Modal";
import ProfileModal from "../components/profile/ProfileModal";
import LoadingSpinner from "../components/misc/LoadingSpinner";
import { useNavigate } from "react-router-dom";

// Package Imports

// Component Imports

// Asset Imports

/**
 * Profile renders a React page.
 */
const Profile = () => {
  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
    isSuccess: profileSuccess,
    refetch: refetchProfile,
  } = useGetProfileQuery({});

  console.log("profileData: ", profileData);
  const [activeModal, setActiveModal] = useState<string>("");

  const navigate = useNavigate();

  return (
    <PageSkeleton heading="Profile">
      <div className="grid w-full h-full max-w-6xl grid-cols-4 gap-8 mt-8">
        <button
          className="flex flex-col items-center justify-center col-span-2 px-4 py-8 transition-shadow bg-white shadow-lg gap-y-4 rounded-2xl hover:shadow-xl text-uos-gray"
          onClick={() => {
            !profileLoading && setActiveModal("edit_profile");
          }}
        >
          <AnimatePresence mode="wait">
            {profileLoading ? (
              <LoadingSpinner key="loading" />
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center h-full gap-y-4"
                key="loaded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-row items-center justify-center w-full gap-x-4 ">
                  <p className="text-3xl font-light ">
                    {profileSuccess &&
                    profileData &&
                    (Object.keys(profileData).length === 0 ||
                      (Object.keys(profileData).length < 7 &&
                        profileData.education &&
                        profileData.education.length === 0 &&
                        profileData.workExperience.length === 0 &&
                        profileData.savedResources.length === 0))
                      ? "Add"
                      : "Update"}{" "}
                    Profile Information
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-search text-uos-lightgray"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
                  </svg>
                </div>
                <div className="max-w-sm">
                  <p className="text-sm font-light text-uos-gray">
                    {profileSuccess &&
                    profileData &&
                    (Object.keys(profileData).length === 0 ||
                      (Object.keys(profileData).length < 7 &&
                        profileData.education &&
                        profileData.education.length === 0 &&
                        profileData.workExperience.length === 0 &&
                        profileData.savedResources.length === 0))
                      ? "Complete your profile to speed up applying for new positions!"
                      : "Make sure your information's up to date for future applications!"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        <button
          className="flex flex-col items-center col-span-2 px-4 py-8 transition-shadow bg-white shadow-lg gap-y-4 rounded-2xl hover:shadow-xl text-uos-gray"
          onClick={() => {
            navigate("/applications");
          }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-y-4">
            <div className="flex flex-row items-center justify-center w-full gap-x-4 ">
              <p className="text-3xl font-light ">Your Applications</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-search text-uos-lightgray"
                viewBox="0 0 16 16"
              >
                <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5" />
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z" />
              </svg>
            </div>
            <div className="max-w-sm">
              <p className="text-sm font-light text-uos-gray">
                Keep track of your active applications and their status.
              </p>
            </div>
          </div>
        </button>
      </div>
      <AnimatePresence>
        {activeModal === "edit_profile" && profileData && (
          <Modal
            onClick={() => {
              setActiveModal("");
            }}
            modalTitle="Edit Profile"
            key="edit_profile"
          >
            <ProfileModal
              closeModal={() => {
                setActiveModal("");
                refetchProfile();
              }}
              targetProfile={profileData}
            />
          </Modal>
        )}
      </AnimatePresence>
    </PageSkeleton>
  );
};

export default Profile;
