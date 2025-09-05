import { useState } from "react";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../features/auth/authSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("admin@sms.com");
  const [password, setPassword] = useState("Admin@123");
  const dispatch = useDispatch();
   const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch(setAuth({ token: data.token, user: data.user }));

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 ">
          Sign in to SMS
        </h2>
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-xl shadow-md hover:bg-blue-700 transition">
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?
          <Link to="/register" className="text-blue-600 hover:underline pl-1">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
