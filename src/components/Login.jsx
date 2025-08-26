import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useLoginStore from "../../store/useLoginStore"
import sukuIcon from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const loginUser = useLoginStore((state) => state.loginUser);
  const loading = useLoginStore((state) => state.loading); // get loading state

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState(""); // maps to ID

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Start toast loading feedback
    const toastId = toast.loading("Signing in...");

    const user = await loginUser(fullName, password);

    if (!user) {
      toast.error("Login failed. Check your credentials.", { id: toastId });
      return;
    }

    // Check admin role
    if (user.attendee?.role === "admin") {
      toast.success("Login successful! Redirecting...", { id: toastId });
      navigate("/insight-center");
    } else {
      toast.error("You do not have access to this page.", { id: toastId });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black px-4 py-6">
      <div className="w-full flex flex-row items-center justify-between">
        <Link to="/" className="self-start mb-6">
          <div className="flex items-center text-white gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M5 12l4 4" />
              <path d="M5 12l4 -4" />
            </svg>
            <p className="text-sm md:text-base">Back</p>
          </div>
        </Link>
        <div className="w-[50%] flex justify-end items-start -mt-6">
          <img src={sukuIcon} alt="sukuIcon" className="w-50" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#111] p-6 md:p-8 rounded-2xl shadow-lg min-h-[500px] flex flex-col justify-center"
      >
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">
          Sign In to Your Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm text-gray-400 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-zinc-900 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your Full Name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-400 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="ID"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-zinc-900 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-500" : "bg-indigo-600 hover:bg-indigo-700"
            } transition-colors text-white font-medium py-2 px-4 rounded-md`}
            type="submit"
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
