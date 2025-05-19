import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { apiCall } from "../utils/apiCall";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      let data = await apiCall("/auth/login", "POST", form);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
      setUser(data);
      toast.success("Login successful!");
    } catch (err) {
      toast.error("Login failed. Please check your credentials!");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.email) newErrors.email = "Email is required";

    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-12 rounded-lg shadow-lg w-[450px] space-y-6"
      >
        <div className="flex justify-center">
          <img
            src="/thaalam-logo.png"
            alt="Thaalam summer festival logo"
            className="w-36 h-36 object-contain mb-2"
          />
        </div>
        <h2 className="text-3xl font-medium text-center text-secondary-400">
          Welcome
        </h2>
        <div className="relative">
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder=" "
            className={`peer w-full border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } p-3 pt-5 rounded focus:outline-none focus:ring-1 ${
              errors.email ? "focus:ring-red-800" : "focus:ring-red-500"
            }`}
          />
          <label
            htmlFor="email"
            className={`absolute left-3 top-4 text-md transition-all ${
              errors.email ? "text-red-500" : "text-gray-500"
            } peer-focus:top-1 peer-focus:text-xs peer-focus:${
              errors.email ? "text-red-500" : "text-gray-500"
            }  peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs`}
          >
            Email
          </label>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder=" "
            className={`peer w-full border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } p-3 pt-5 rounded focus:outline-none focus:ring-1 ${
              errors.password ? "focus:ring-red-800" : "focus:ring-red-500"
            }`}
          />
          <label
            htmlFor="password"
            className={`absolute left-3 top-4 text-md transition-all ${
              errors.password ? "text-red-500" : "text-gray-500"
            } peer-focus:top-1 peer-focus:text-xs peer-focus:${
              errors.password ? "text-red-500" : "text-gray-500"
            }  peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs`}
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-5 focus:outline-none text-gray-600"
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </button>

          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <p className="text-right text-sm">
          <Link
            to="/forgot-password"
            className="text-primary-500 hover:underline"
          >
            Forgot Password ?
          </Link>
        </p>

        <button
          type="submit"
          className="w-full bg-primary-500 text-white p-2 rounded hover:bg-primary-400"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
