import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Upload, Save } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import AddCategoryModal from "./AddCategoryModal";
import { useToast } from "./ToastProvider";

const CategoryList = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  refreshCategories,
  refreshMenus,
}) => {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openAddMenu, setOpenAddMenu] = useState(false);
  const [menuForm, setMenuForm] = useState({
    category: "",
    item_name: "",
    short_description: "",
    price: "",
    calories: "",
    ingredients: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore();
  const toast = useToast();

  const handleInputChange = (e) => {
    setMenuForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const resetForm = () => {
    setMenuForm({
      category: "",
      item_name: "",
      short_description: "",
      price: "",
      calories: "",
      ingredients: "",
    });
    setImages([]);
    setImagePreviews([]);
  };

  // ==========================
  // ADD MENU
  // ==========================
  const handleSubmitMenu = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.push({ message: "Please login first", type: "error" });
      return;
    }

    setLoading(true);
    const data = new FormData();

    Object.keys(menuForm).forEach((key) => {
      if (menuForm[key]) data.append(key, menuForm[key]);
    });

    images.forEach((img) => data.append("images", img));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/menus`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );

      const result = await res.json();

      if (result.success) {
        toast.push({
          message: "Menu item created successfully",
          type: "success",
        });

        resetForm();
        setOpenAddMenu(false);

        // 🚀 Refresh menus instantly
        refreshMenus && refreshMenus();
      } else {
        toast.push({
          message: result.message || "Failed to create menu item",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      toast.push({ message: "Failed to create menu", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-11/12 mx-auto animate-slide-in-left">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = selectedCategory === category._id;
            return (
              <button
                key={category._id}
                onClick={() => onSelectCategory(category._id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg border transition-all font-medium ${
                  isActive
                    ? "bg-[#e6034b] text-white"
                    : "border-pink-500 text-pink-600 bg-white hover:bg-pink-50"
                }`}
              >
                {category.name.toLowerCase() === "most liked" && (
                  <FaHeart
                    className={isActive ? "text-white" : "text-pink-500"}
                  />
                )}
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOpenAddCategory(true)}
            className="text-white border border-pink-600 p-2 rounded-lg bg-[#e6034b]"
          >
            + Add Category
          </button>
          <button
            onClick={() => setOpenAddMenu(true)}
            className="text-white border border-pink-600 p-2 rounded-lg bg-[#e6034b]"
          >
            + Add Menu
          </button>
        </div>
      </div>

      {/* CATEGORY MODAL */}
      <AddCategoryModal
        open={openAddCategory}
        onClose={() => setOpenAddCategory(false)}
        onCategoryAdded={refreshCategories} // 🚀 refresh after adding
      />
      {/* MENU MODAL */}
      {openAddMenu && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setOpenAddMenu(false)}
        >
          <div
            className="bg-white rounded-2xl w-11/12 mx-auto shadow-2xl p-6 relative overflow-y-auto max-h-[90vh] custom-scrollbar animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Add New Menu Item
            </h2>

            <form className="space-y-5" onSubmit={handleSubmitMenu}>
              {/* Category & Item Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={menuForm.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 transition-all"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="item_name"
                    value={menuForm.item_name}
                    onChange={handleInputChange}
                    placeholder="Item Name"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Price & Calories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={menuForm.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={menuForm.calories}
                    onChange={handleInputChange}
                    placeholder="Calories"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Short Description
                </label>
                <textarea
                  name="short_description"
                  value={menuForm.short_description}
                  onChange={handleInputChange}
                  placeholder="Describe the menu item"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 transition-all resize-none"
                  rows={3}
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Ingredients (comma-separated)
                </label>
                <input
                  type="text"
                  name="ingredients"
                  value={menuForm.ingredients}
                  onChange={handleInputChange}
                  placeholder="e.g., tomato, cheese, basil"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Upload Images (Max 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none"
                />
                {/* Preview Thumbnails */}
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {imagePreviews.map((src, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                      >
                        <img
                          src={src}
                          alt={`preview-${i}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setOpenAddMenu(false)}
                  className="px-5 py-2 rounded-xl bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-all shadow-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-xl bg-[#E6034B] text-white font-semibold hover:bg-[#c30c46] transition-all shadow-md flex items-center gap-2 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  Add Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Add Animations Styles ===== */}
      <style>{`
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
  .animate-scaleUp { animation: scaleUp 0.3s ease-out; }

  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.2); border-radius: 3px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(0,0,0,0.35); }
`}</style>
    </div>
  );
};

export default CategoryList;
