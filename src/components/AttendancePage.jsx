import React, { useEffect } from "react";
import NavBar from "./NavBar";
import sukuLogo from "../assets/logo.png";
import sukuLogo1 from "../assets/bellLogo.jpg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

const AttendancePage = () => {
  const greetingTime = () => {
    const getTime = new Date().getHours();
    if (getTime < 12) return "Good Morning";
    if (getTime < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    greetingTime();
  }, []);

  return (
    <div className="bg-black min-h-screen flex flex-col p-4">
      <NavBar />

      {/* Responsive Flex Container */}
      <motion.div
        className="flex flex-col md:flex-row w-full flex-grow gap-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Image Section */}
        <motion.div
          className="hidden md:flex w-full md:w-1/2 h-auto md:h-[80%] md:max-h-[530px] items-center justify-center rounded-lg overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          <motion.img
            src={sukuLogo1}
            alt="Attendance Illustration"
            className="w-full h-[90%] object-cover rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="w-full md:w-1/2 h-80 flex flex-col justify-between gap-6"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white pb-2">
            <img
              src={sukuLogo}
              alt="suku-logo"
              className="h-24 md:h-28 w-auto rounded-lg object-contain"
            />
            <p className="text-white font-bold text-2xl md:text-3xl">
              Front Desk
            </p>
          </div>

          {/* Greeting and Buttons */}
          <div className="flex flex-col gap-6">
            <motion.p
              className="text-white font-bold text-xl md:text-2xl text-center md:text-left"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {greetingTime()}! Why are you here?
            </motion.p>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Deliver Packages */}
              <MotionLink
                to=""
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                className="w-full hidden md:w-1/2 flex-1 min-h-[130px] bg-zinc-800 text-white p-4 rounded-lg font-bold flex-col justify-between"
              >
                <p>Deliver Packages</p>
                <div className="flex justify-end">
                  <div className="w-9 h-9 border border-gray-400 flex items-center justify-center rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ff6b22"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21l-8 -4.5v-9l8 -4.5l8 4.5v4.5" />
                      <path d="M12 12l8 -4.5" />
                      <path d="M12 12v9" />
                      <path d="M12 12l-8 -4.5" />
                      <path d="M15 18h7" />
                      <path d="M19 15l3 3l-3 3" />
                    </svg>
                  </div>
                </div>
              </MotionLink>

              {/* Check into Workspace */}
              <MotionLink
                to="/identityCheck"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                className="w-full md:w-1/2 flex-1 min-h-[130px] bg-zinc-800 text-white p-4 rounded-lg font-bold flex flex-col justify-between"
              >
                <p>Check into Workspace</p>
                <div className="flex justify-end">
                  <div className="w-9 h-9 border border-gray-400 flex items-center justify-center rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ff6b22"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.942 13.021a9 9 0 1 0 -9.407 7.967" />
                      <path d="M12 7v5l3 3" />
                      <path d="M15 19l2 2l4 -4" />
                    </svg>
                  </div>
                </div>
              </MotionLink>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AttendancePage;
