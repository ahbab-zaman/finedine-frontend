import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import AddCategoryModal from "./AddCategoryModal";
import { Upload, Save } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const CategoryList = ({ categories, selectedCategory, onSelectCategory }) => {
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

  const handleInputChange = (e) => {
    setMenuForm({ ...menuForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmitMenu = async (e) => {
    e.preventDefault();
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
        alert("Menu item created!");
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
        setOpenAddMenu(false);
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full animate-slide-in-left">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-xl font-semibold text-gray-800">Categories</h3>
      </div>

      {/* Category Buttons */}
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
            className="text-white border border-pink-600 p-2 rounded-lg bg-[#e6034b] transition-colors duration-500 font-semibold hover:text-pink-600 hover:bg-white"
          >
            + Add Category
          </button>
          <button
            onClick={() => setOpenAddMenu(true)}
            className="text-white border border-pink-600 p-2 rounded-lg bg-[#e6034b] transition-colors duration-500 font-semibold hover:text-pink-600 hover:bg-white"
          >
            + Add Menu
          </button>
        </div>
      </div>

      <AddCategoryModal
        open={openAddCategory}
        onClose={() => setOpenAddCategory(false)}
      />

      {/* Add Menu Modal */}
      {openAddMenu && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setOpenAddMenu(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6 animate-scaleUp relative overflow-y-auto max-h-[90vh] custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Add New Menu Item
            </h2>

            <form className="space-y-5" onSubmit={handleSubmitMenu}>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={menuForm.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
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
                  Item Name
                </label>
                <input
                  type="text"
                  name="item_name"
                  value={menuForm.item_name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={menuForm.price}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
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
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Short Description
                </label>
                <textarea
                  name="short_description"
                  value={menuForm.short_description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Ingredients (comma-separated)
                </label>
                <input
                  type="text"
                  name="ingredients"
                  value={menuForm.ingredients}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  placeholder="e.g., tomato, cheese, basil"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                  <Upload size={16} className="mr-2" />
                  Images (up to 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none"
                />
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagePreviews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`preview-${i}`}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-4">
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
                  className={`px-5 py-2 rounded-xl bg-[#E6034B] text-white font-semibold hover:bg-[#c30c46] transition-all shadow-md flex items-center justify-center gap-2 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  <Save size={16} />
                  Add Menu
                </button>
              </div>
            </form>

            <button
              onClick={() => setOpenAddMenu(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <style>{`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
              .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
              .animate-scaleUp { animation: scaleUp 0.3s ease-out; }

              /* Thin custom scrollbar */
              .custom-scrollbar::-webkit-scrollbar { width: 6px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.2); border-radius: 3px; }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(0,0,0,0.35); }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
