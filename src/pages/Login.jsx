import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../../context/context.js";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Attempt:", form);
    api
      .post("/auth/login", form)
      .then((response) => {
        console.log("Login successful:", response.data);
        setUser(response.data.user);
        console.log(response.data.user);

        localStorage.setItem("user", JSON.stringify(response.data.user));

        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Login failed:", error.response?.data || error.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Login to continue your journey.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 
              focus:ring-green-500 outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 
              focus:ring-green-500 outline-none transition"
              placeholder="•••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold
            hover:bg-green-700 transition active:scale-95"
          >
            Login
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-green-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
