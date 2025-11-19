import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assuming React Router for navigation
import { useToast } from "../components/ToastProvider"; // Adjust path as needed
import {
  X,
  User,
  Mail,
  Phone,
  Cake,
  Settings,
  Trash2,
  AlertTriangle,
} from "lucide-react";

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState("personal"); // 'personal' or 'settings'
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // Mobile sidebar toggle
  const navigate = useNavigate();
  const { push: toast } = useToast();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setUser(response.data.user);
        setFormData({
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          phone: response.data.user.phone || "",
          birthdate: response.data.user.birthdate
            ? new Date(response.data.user.birthdate).toISOString().split("T")[0]
            : "",
        });
      }
    } catch (err) {
      setError("Failed to load user data");
      toast({ message: "Failed to load user data", type: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_BASE}/api/auth/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setUser(response.data.user);
        setIsEditing(false);
        toast({ message: "Profile updated successfully!", type: "success" });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update profile";
      setError(errorMsg);
      toast({ message: errorMsg, type: "error" });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { password: deletePassword },
      });
      localStorage.removeItem("token");
      navigate("/login"); // Redirect to login
      toast({ message: "Account deleted successfully.", type: "success" });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete account";
      setError(errorMsg);
      toast({ message: errorMsg, type: "error" });
    } finally {
      setShowDeleteModal(false);
      setDeletePassword("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          User not found. Please log in again.
        </div>
      </div>
    );
  }

  const getInitial = () => user.name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/50 backdrop-blur-sm"
          onClick={() => setShowSidebar(false)}
        />
      )}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed h-full w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-0 z-50 transform transition-all duration-300 ease-in-out md:static md:translate-x-0 md:w-72 md:pt-16 md:h-screen md:inset-auto md:top-auto md:left-auto ${
            showSidebar ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          } md:shadow-none`}
        >
          {/* Mobile close button */}
          <button
            className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => setShowSidebar(false)}
          >
            <X size={24} />
          </button>
          <div className="px-6 pb-6 text-center">
            <div className="w-20 h-20 bg-[#E6034B] rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold shadow-lg">
              <span>{getInitial()}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {user.name}
            </h2>
            <p className="text-gray-500 text-sm">Hello there!</p>
          </div>

          <nav className="flex-1 flex flex-col px-2">
            <button
              className={`flex items-center p-4 rounded-xl text-left cursor-pointer transition-all duration-200 text-sm font-medium border-r-2 ${
                activeSection === "personal"
                  ? "bg-[#E6034B] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 border-transparent"
              }`}
              onClick={() => {
                setActiveSection("personal");
                setShowSidebar(false);
              }}
              aria-label="Personal Information"
            >
              <User className="mr-3 h-5 w-5" />
              Personal Information
            </button>

            <button
              className={`flex items-center p-4 rounded-xl text-left cursor-pointer transition-all duration-200 text-sm font-medium border-r-2 mt-2 ${
                activeSection === "settings"
                  ? "bg-[#E6034B] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 border-transparent"
              }`}
              onClick={() => {
                setActiveSection("settings");
                setShowSidebar(false);
              }}
              aria-label="Settings"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {activeSection === "personal" && (
            <section className="p-4 sm:p-6 md:p-8">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <User className="h-6 w-6 text-[#E6034B]" />
                    Personal Information
                  </h2>
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#E6034B] text-white rounded-xl font-medium hover:bg-[#be144a] transition-all duration-200 shadow-sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        disabled={!isEditing}
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base transition-all duration-200 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100/50 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        disabled={!isEditing}
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base transition-all duration-200 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100/50 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        disabled={!isEditing}
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base transition-all duration-200 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100/50 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="birthdate"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Cake className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base transition-all duration-200 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100/50 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed shadow-sm"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#E6034B] text-white rounded-xl font-semibold hover:bg-[#d71150] transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Save Changes</span>
                    </button>
                  )}
                </form>
              </div>
            </section>
          )}

          {activeSection === "settings" && (
            <section className="p-4 sm:p-6 md:p-8">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="h-5 w-5 text-gray-500" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Account Settings
                  </h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Trash2 className="h-5 w-5 text-red-500" />
                      Delete Account
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      This action cannot be undone. All your data, including
                      profile information and any associated content, will be
                      permanently removed.
                    </p>
                    <button
                      className="w-full py-3 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium hover:bg-red-100 transition-all duration-200 flex items-center justify-center gap-2"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete My Account
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Are you absolutely sure? This action cannot be undone. Enter your
              password to confirm.
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-6 text-base focus:border-red-500 focus:ring-2 focus:ring-red-100/50 transition-all duration-200 shadow-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                }}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!deletePassword}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Time - Optional, for exact match, but dynamic */}
      <div className="absolute bottom-2 right-4 text-gray-400 text-xs">
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
};

export default ProfilePage;
