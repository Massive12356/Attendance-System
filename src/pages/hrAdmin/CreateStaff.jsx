import React, { useState } from "react";
import { UserPlus, Save, X } from "lucide-react";
import useAttendanceStore from "../../../store/useAttendanceStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const CreateAttendee = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    email: "",
    position: "",
    workID: "",
    contact: "",
  });
  const [errors, setErrors] = useState({});
  const {loading, registerAttendee,}= useAttendanceStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.role) {
      newErrors.role = "Department is required";
    }

    if (!formData.position) {
      newErrors.position = "Position is required";
    }

    if (!formData.workID) {
      newErrors.workID = "Staff ID is required";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.contact)) {
      newErrors.contact = "Phone number is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await registerAttendee(formData)
      toast.success("Staff Registered Successfully")
      setFormData({
          fullName: "",
          role: "",
          email: "",
          position: "",
          workID: "",
          contact: "",
        });
    } catch (err) {
      console.error("Error creating attendee:", err);
      toast.error(err.message || "Failed to Register Staff");
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      role: "",
      email: "",
      position: "",
      workID: "",
      contact: "",
    });
    setErrors({});
    setSuccess(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 ">
          Create New Attendee
        </h1>
        <p className="text-gray-600  mt-1">
          Add a new staff member to the attendance system
        </p>
      </div>

      {/* Staff Information Section */}
      <div className="bg-white border border-gray-200  rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 ">
          <div className="flex items-center">
            <UserPlus className="w-6 h-6 text-blue-600  mr-3" />
            <h2 className="text-lg font-semibold text-gray-900 ">
              Staff Information
            </h2>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  name="fullName"
                  onChange={handleChange}
                  value={formData.fullName}
                  placeholder="Enter full name"
                  className={`block w-full px-3 py-2 border border-gray-300  rounded-lg shadow-sm 
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          bg-white text-gray-900  transition-colors duration-200 
          ${errors.fullName ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          bg-white  text-gray-900 transition-colors duration-200 
          ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      bg-white text-gray-900 transition-colors duration-200
      hover:border-blue-400 cursor-pointer"
                >
                  <option value="" disabled className="text-gray-400">
                    Select Role
                  </option>
                  <option value="admin" className="hover:bg-blue-50">
                    Admin
                  </option>
                  <option value="member" className="hover:bg-blue-50">
                    Member
                  </option>
                </select>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              {/* Position */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Position *
                </label>
                <select
  name="position"
  value={formData.position}
  onChange={handleChange}
  className={`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
    bg-white text-gray-900 transition-colors duration-200 
    ${errors.position ? "border-red-500 focus:ring-red-500" : ""}`}
>
  <option value="">Select Position</option>
  <option value="CEO">CEO</option>
  <option value="OPERATIONS LEAD">OPERATIONS LEAD</option>
  <option value="CONSULTANT">CONSULTANT</option>
  <option value="MARKETING/SALES OFFICER">MARKETING/SALES OFFICER</option>
  <option value="DEVELOPER">DEVELOPER</option>
  <option value="MARKETING/SALES LEAD">MARKETING/SALES LEAD</option>
  <option value="TECHNICAL LEAD">TECHNICAL LEAD</option>
  <option value="SERVICE PERSONNEL">SERVICE PERSONNEL</option>
  <option value="INTERN">INTERN</option>
</select>

{errors.position && (
  <p className="text-sm text-red-600">{errors.position}</p>
)}
              </div>

              {/*  Date of Birth */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Staff ID *
                </label>
                <input
                  name="workID"
                  type="number"
                  value={formData.workID}
                  placeholder="Enter Staff ID"
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border border-gray-300  rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          bg-white text-gray-900 transition-colors duration-200 
          ${errors.workID ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.workID && (
                  <p className="text-sm text-red-600">{errors.workID}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  name="contact"
                  onChange={handleChange}
                  value={formData.contact}
                  placeholder="Enter phone number"
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          bg-white  text-gray-900  transition-colors duration-200 
          ${errors.contact ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.contact && (
                  <p className="text-sm text-red-600">{errors.contact}</p>
                )}
              </div>
            </div>

            {/* Date Of Birth */}
            {/* <div className="w-full md:w-1/2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Staff ID
              </label>
              <input
                name="status"
                type="Date"
                onChange={handleChange}
                placeholder="Enter Staff ID"
                className="block w-full px-3 py-2 border border-gray-300  rounded-lg shadow-sm 
        focus:outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent 
        bg-white text-gray-900 transition-colors duration-200"
              ></input>
            </div> */}

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 ">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border rounded-lg text-gray-700  hover:bg-gray-100"
              >
                <X className="w-4 h-4 mr-2 inline" />
                Reset
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className={`px-4 py-2 text-white rounded-lg shadow hover:bg-blue-700 cursor-pointer ${
                  loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600"
                }`}
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2 inline" />
                {loading ? "saving...." : "Create Staff"}
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="bg-white  border border-gray-200  rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Guidelines</h3>
        </div>
        <div className="p-6">
          <div className="space-y-2 text-sm text-gray-600">
            <p>• All fields marked with * are mandatory</p>
            <p>• Email address must be unique and valid</p>
            <p>• Phone number should include country code if applicable</p>
            <p>• Joining date should be the actual start date of employment</p>
            <p>• Staff ID will be generated automatically upon creation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAttendee;
