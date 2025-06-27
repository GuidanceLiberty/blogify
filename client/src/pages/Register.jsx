import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFormik } from 'formik';
import { registerSchema } from '../schema';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaEnvelope, FaImage, FaUnlockAlt, FaUserPlus } from "react-icons/fa";
import { Loader } from 'lucide-react';

import authBG from "../assets/images/auth-bg.jpg";
import avatar from "../assets/images/user.png";

const Register = () => {
  const URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(avatar);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPhoto(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const onSubmit = async (values, actions) => {
    handleUpload();

    try {
      const response = await fetch(`${URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, photo }),
      });

      const res = await response.json();

      if (res.success) {
        toast.success(res.message);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        actions.resetForm();
        return navigate("/verify-email");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error occurred while creating account.");
      console.error("Error occurred while creating account:", error.message);
    }
  };

  const {
    values,
    touched,
    isSubmitting,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      photo: "",
    },
    validationSchema: registerSchema,
    onSubmit,
  });

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side image */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={authBG}
          alt="auth background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-primary mb-8">
            Create New Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                <FaUserPlus className="inline mr-2" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter Fullname"
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.name && errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                <FaEnvelope className="inline mr-2" />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                <FaUnlockAlt className="inline mr-2" />
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter Password"
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.password && errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Upload */}
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                <FaImage className="inline mr-2" />
                Profile Photo
              </label>
              <input
                type="file"
                id="photo"
                accept=".png, .jpeg, .jpg, .gif"
                className="mt-1 w-full text-sm"
                onChange={handleFileChange}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition duration-200 flex justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader className="animate-spin" />
              ) : (
                <span>Sign Up</span>
              )}
            </button>

            {/* Login link */}
            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium">
                Login now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;
