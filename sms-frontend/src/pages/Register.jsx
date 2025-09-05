import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Min 6 characters").required("Password is required"),
  role: yup.string().oneOf(["ADMIN", "TEACHER"], "Invalid role").required("Role is required"),
});

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.post("/auth/register", data);
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              {...register("name")}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block mb-1">Role</label>
            <select {...register("role")} className="w-full border rounded px-3 py-2">
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="TEACHER">Teacher</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
