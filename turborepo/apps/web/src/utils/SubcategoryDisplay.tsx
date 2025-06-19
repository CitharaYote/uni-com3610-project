/**
 * @file Displays subcategories for a page
 * @note This is the point I gave up trying to make pretty code
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Subcategory } from "./PageSkeleton";
import SubcategoryDropdown from "./SubcategoryDropdown";
import SubcategoryLink from "./SubcategoryLink";
import { useState } from "react";
import RenderWithAuth from "../components/auth/RenderWithAuth";

// Package Imports

// Component Imports

// Asset Imports

export type SubcategoryDisplayProps = {
  className?: string;
  subcategories: Subcategory[];
};

/**
 * SubcategoryDisplay renders a React component.
 * @param {string} className - The class name to apply to the component.
 * @param {Subcategory[]} subcategories - The subcategories to display.
 */
const SubcategoryDisplay = (p: SubcategoryDisplayProps) => {
  const [activeDropdownKey, setActiveDropdownKey] = useState("");
  const [activeHoverKey, setActiveHoverKey] = useState("");

  return (
    <motion.div
      className={`${p.className} w-full bg-uos-darkgray h-12 relative`}
    >
      <AnimatePresence>
        {activeDropdownKey && (
          <>
            <motion.div
              className="fixed top-0 bottom-0 left-0 w-full h-auto bg-uos-darkgray bg-opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
              onClick={() => setActiveDropdownKey("")}
            />
            <motion.div
              className="absolute left-0 w-full overflow-hidden top-full bg-uos-darkgray"
              initial={{ height: 0 }}
              animate={{
                height: "auto",
              }}
              exit={{ height: "0%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
            >
              <motion.div
                className="flex flex-col items-start justify-start w-full h-full max-w-6xl mx-auto mb-8 space-y-2"
                // initial={{ opacity: 0 }}
                // animate={{ opacity: 1 }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
              >
                <motion.p className="mt-4 font-bold text-white">
                  {
                    p.subcategories.find(
                      (subcategory) => subcategory.key === activeDropdownKey
                    )?.displayName
                  }
                </motion.p>
                {p.subcategories
                  .find((subcategory) => subcategory.key === activeDropdownKey)
                  ?.children?.map((subcategory, index) =>
                    subcategory.requiredRoles ? (
                      <RenderWithAuth
                        requiredRoles={subcategory.requiredRoles}
                        key={index}
                        inverted={subcategory.inverted}
                      >
                        <motion.a
                          className={`relative flex flex-row items-center justify-center hover:underline text-white`}
                          href={subcategory.url}
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            type: "tween",
                            ease: "easeInOut",
                            duration: 0.2,
                            delay: 0.1 + index * 0.05,
                          }}
                        >
                          <motion.p className="">
                            {subcategory.displayName}
                          </motion.p>
                        </motion.a>
                      </RenderWithAuth>
                    ) : (
                      <motion.a
                        className={`relative flex flex-row items-center justify-center hover:underline text-white`}
                        href={subcategory.url}
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "tween",
                          ease: "easeInOut",
                          duration: 0.2,
                          delay: 0.1 + index * 0.05,
                        }}
                      >
                        <motion.p className="">
                          {subcategory.displayName}
                        </motion.p>
                      </motion.a>
                    )
                  )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <motion.div
        className="z-20 flex flex-row items-center justify-start w-full h-full max-w-6xl mx-auto"
        animate={{ opacity: 1 }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
      >
        {p.subcategories.map((subcategory, index) =>
          subcategory.requiredRoles ? (
            subcategory.children ? (
              // <SubcategoryDropdown
              //   key={subcategory.key}
              //   subcategory={subcategory}
              //   onClick={() => console.log("clicked")}
              // />
              <RenderWithAuth
                requiredRoles={subcategory.requiredRoles}
                key={index}
                inverted={subcategory.inverted}
              >
                <motion.button
                  className={`${p.className} ${activeDropdownKey === "" || activeDropdownKey === subcategory.key || activeHoverKey === subcategory.key ? "text-white" : "text-uos-lightgray"} transition-colors relative h-full flex flex-row items-center justify-center mr-8`}
                  onHoverStart={() => setActiveHoverKey(subcategory.key)}
                  onHoverEnd={() => {
                    if (activeDropdownKey === "") {
                      setActiveHoverKey("");
                    } else {
                      setActiveHoverKey(activeDropdownKey);
                    }
                  }}
                  onClick={() => {
                    setActiveDropdownKey(
                      activeDropdownKey === subcategory.key
                        ? ""
                        : subcategory.key
                    );
                  }}
                  //   href={p.subcategory.url}
                  key={index}
                >
                  <motion.span
                    className="absolute top-0 h-0.5 bg-white"
                    animate={{
                      width: activeHoverKey === subcategory.key ? "100%" : "0%",
                    }}
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.2,
                    }}
                  />
                  <motion.p className="flex flex-row items-center gap-2 text-lg">
                    {subcategory.displayName}
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-chevron-down"
                      viewBox="0 0 16 16"
                      animate={{
                        scaleY: activeDropdownKey === subcategory.key ? -1 : 1,
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
                  </motion.p>
                </motion.button>
              </RenderWithAuth>
            ) : (
              <RenderWithAuth
                requiredRoles={subcategory.requiredRoles}
                key={index}
                inverted={subcategory.inverted}
              >
                <Link to={subcategory.url} key={index} className="h-full mr-8">
                  <motion.div
                    className={`${p.className} ${activeDropdownKey === "" || activeDropdownKey === subcategory.key || activeHoverKey === subcategory.key ? "text-white" : "text-uos-lightgray"} transition-colors relative h-full flex flex-row items-center justify-center hover:underline`}
                    onHoverStart={() => setActiveHoverKey(subcategory.key)}
                    onHoverEnd={() => {
                      if (activeDropdownKey === "") {
                        setActiveHoverKey("");
                      } else {
                        setActiveHoverKey(activeDropdownKey);
                      }
                    }}
                  >
                    <motion.span
                      className="absolute top-0 h-0.5 bg-white"
                      animate={{
                        width:
                          activeHoverKey === subcategory.key ? "100%" : "0%",
                      }}
                      transition={{
                        type: "tween",
                        ease: "easeInOut",
                        duration: 0.2,
                      }}
                    />
                    <motion.p className="text-lg">
                      {subcategory.displayName}
                    </motion.p>
                  </motion.div>
                </Link>
              </RenderWithAuth>
            )
          ) : subcategory.children ? (
            // <SubcategoryDropdown
            //   key={subcategory.key}
            //   subcategory={subcategory}
            //   onClick={() => console.log("clicked")}
            // />
            <motion.button
              className={`${p.className} ${activeDropdownKey === "" || activeDropdownKey === subcategory.key || activeHoverKey === subcategory.key ? "text-white" : "text-uos-lightgray"} transition-colors relative h-full flex flex-row items-center justify-center mr-8`}
              onHoverStart={() => setActiveHoverKey(subcategory.key)}
              onHoverEnd={() => {
                if (activeDropdownKey === "") {
                  setActiveHoverKey("");
                } else {
                  setActiveHoverKey(activeDropdownKey);
                }
              }}
              onClick={() => {
                setActiveDropdownKey(
                  activeDropdownKey === subcategory.key ? "" : subcategory.key
                );
              }}
              //   href={p.subcategory.url}
              key={index}
            >
              <motion.span
                className="absolute top-0 h-0.5 bg-white"
                animate={{
                  width: activeHoverKey === subcategory.key ? "100%" : "0%",
                }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
              />
              <motion.p className="flex flex-row items-center gap-2 text-lg">
                {subcategory.displayName}
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-down"
                  viewBox="0 0 16 16"
                  animate={{
                    scaleY: activeDropdownKey === subcategory.key ? -1 : 1,
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
              </motion.p>
            </motion.button>
          ) : (
            <Link to={subcategory.url} key={index} className="h-full mr-8">
              <motion.div
                className={`${p.className} ${activeDropdownKey === "" || activeDropdownKey === subcategory.key || activeHoverKey === subcategory.key ? "text-white" : "text-uos-lightgray"} transition-colors relative h-full flex flex-row items-center justify-center hover:underline`}
                onHoverStart={() => setActiveHoverKey(subcategory.key)}
                onHoverEnd={() => {
                  if (activeDropdownKey === "") {
                    setActiveHoverKey("");
                  } else {
                    setActiveHoverKey(activeDropdownKey);
                  }
                }}
              >
                <motion.span
                  className="absolute top-0 h-0.5 bg-white"
                  animate={{
                    width: activeHoverKey === subcategory.key ? "100%" : "0%",
                  }}
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.2,
                  }}
                />
                <motion.p className="text-lg">
                  {subcategory.displayName}
                </motion.p>
              </motion.div>
            </Link>
          )
        )}
      </motion.div>
    </motion.div>
  );
};

export default SubcategoryDisplay;
