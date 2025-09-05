import { Routes, Route, Navigate, Link, NavLink } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import Dashboard from "./pages/Dashboard";
import StudentsList from "./pages/Students/List";
import StudentView from "./pages/Students/View";
import ImportExport from "./pages/ImportExport";
import AuditLogs from "./pages/AuditLogs";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./features/auth/authSlice";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function App() {
  const { token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />{" "}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/students", label: "Students" },
    { to: "/import-export", label: "Excel" },
    { to: "/audit", label: "Audit Logs" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
        <div className="text-xl font-semibold text-gray-800">
          📚 Student Management
        </div>

        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `hover:text-blue-600 transition ${
                  isActive ? "text-blue-600 font-medium" : "text-gray-700"
                }`
              }>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            onClick={() => dispatch(logout())}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition">
            Logout
          </button>
        </div>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {menuOpen && (
        <div
          className="md:hidden fixed top-16 left-0 w-full bg-white shadow-lg px-6 py-4 space-y-4 
                  animate-slideDown max-h-[80vh] overflow-y-auto rounded-b-lg z-[1000]">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block hover:text-blue-600 transition ${
                  isActive ? "text-blue-600 font-medium" : "text-gray-700"
                }`
              }
              onClick={() => setMenuOpen(false)} 
            >
              {link.label}
            </NavLink>
          ))}

          <button
            onClick={() => {
              dispatch(logout());
              setMenuOpen(false);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition">
            Logout
          </button>
        </div>
      )}

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentsList />} />
          <Route path="/students/:id" element={<StudentView />} />
          <Route path="/import-export" element={<ImportExport />} />
          <Route path="/audit" element={<AuditLogs />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
