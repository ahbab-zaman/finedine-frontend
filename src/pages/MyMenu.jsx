import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Edit2, Trash2, Plus, Heart, Loader2, X } from "lucide-react";
import EditMenuModal from "../components/EditMenuModal";
import SingleMenuModal from "../components/SingleMenuModal";
import Loading from "../components/Loading";
import { useToast } from "../components/ToastProvider";
import AddCategoryModal from "../components/AddCategoryModal";

const PLACEHOLDER_SVG = "data:image/svg+xml;base64,...";

const MyMenu = ({ categories = [], refreshCategories, refreshMenus }) => {
  const [items, setItems] = useState([]);
  const [cartIds, setCartIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const { token } = useAuthStore();
  const navigate = useNavigate();
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
  const toast = useToast();
  const [allCategories, setAllCategories] = useState([]);

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

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchMyItems = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/menus/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await res.json();
        if (result.success) {
          setItems(result.items);
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
      }
    };

    const fetchCart = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/cart`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await res.json();
        if (result.success) {
          setCartIds(result.cart.items.map((i) => i.menuItem._id));
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    Promise.all([fetchMyItems(), fetchCart()]);
  }, [token, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/category`
        );

        const data = await res.json();

        if (data.success) {
          setAllCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteId) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/menus/${selectedDeleteId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      if (result.success) {
        setItems((prevItems) =>
          prevItems.filter((i) => i._id !== selectedDeleteId)
        );
        setShowDeleteConfirm(false);
        setSelectedDeleteId(null);
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleDelete = (id) => {
    setSelectedDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const toggleCart = async (menuId, item) => {
    const inCart = cartIds.includes(menuId);
    try {
      if (inCart) {
        // Remove
        const cartRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/cart`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const cartData = await cartRes.json();
        const found = cartData.cart.items.find(
          (c) => c.menuItem._id === menuId
        );
        if (found) {
          await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/cart/${found._id}`,
            { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
          );
        }
        setCartIds((prev) => prev.filter((id) => id !== menuId));
      } else {
        // Add
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ menuItemId: menuId, quantity: 1 }),
        });
        setCartIds((prev) => [...prev, menuId]);
      }
    } catch (err) {
      console.error("Error toggling cart:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      <div className=" bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <div className="flex justify-between items-center py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
                <Heart className="text-pink-500" size={36} />
                My Menu Items
              </h1>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={() => setOpenAddCategory(true)}
                className="w-full md:w-auto text-white border border-pink-600 px-4 md:px-2 py-2 rounded-lg bg-[#e6034b] font-medium transition-all hover:bg-[#c30c46]"
              >
                + Add Category
              </button>
              <button
                onClick={() => setOpenAddMenu(true)}
                className="w-full md:w-auto text-white border border-pink-600 px-4 md:px-2 py-2 rounded-lg bg-[#e6034b] font-medium transition-all hover:bg-[#c30c46]"
              >
                + Add Menu
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <Heart size={80} className="mx-auto mb-6 text-gray-300" />
              <p className="text-2xl md:text-3xl text-gray-500 font-medium mb-4">
                No menu items yet
              </p>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Get started by creating your first delicious menu item!
              </p>
              <button
                onClick={() => navigate("/create-menu")}
                className="px-8 py-3 bg-[#e6034bs] text-white rounded-xl hover:bg-pink-400 shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
                aria-label="Create your first menu item"
              >
                Create Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <article
                  key={item._id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer animate-slide-up border border-gray-100"
                  onClick={() => {
                    setSelectedItem(item);
                    setViewOpen(true);
                  }}
                  role="article"
                  aria-label={`Menu item: ${item.item_name}`}
                >
                  {/* Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCart(item._id, item);
                    }}
                    className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group-hover:scale-110"
                    aria-label={`${
                      cartIds.includes(item._id) ? "Remove" : "Add"
                    } ${item.item_name} to cart`}
                  >
                    <Heart
                      size={20}
                      className={`transition-all duration-200 ${
                        cartIds.includes(item._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>

                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${
                        item.images?.[0] || PLACEHOLDER_SVG
                      }`}
                      alt={item.item_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                      {item.item_name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2 leading-relaxed">
                      {item.short_description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        ${item.price}
                      </span>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setEditOpen(true);
                          }}
                          className="p-2.5 text-blue-500 hover:text-blue-700 bg-blue-50 rounded-xl transition-all duration-200 hover:bg-blue-100"
                          aria-label="Edit menu item"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item._id);
                          }}
                          className="p-2.5 text-red-500 hover:text-red-700 bg-red-50 rounded-xl transition-all duration-200 hover:bg-red-100"
                          aria-label="Delete menu item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <EditMenuModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            item={selectedItem}
            token={token}
            onUpdated={() => {
              // Refresh the page or refetch data for better UX
              window.location.reload();
            }}
          />

          <SingleMenuModal
            open={viewOpen}
            onClose={() => setViewOpen(false)}
            item={selectedItem}
            inCart={!!selectedItem && cartIds.includes(selectedItem._id)}
            toggleCart={toggleCart}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 transform animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Delete Menu Item?
              </h2>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedDeleteId(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>
            <div className="text-gray-600 mb-6">
              <p className="text-sm">
                This action cannot be undone. The item "
                {items.find((i) => i._id === selectedDeleteId)?.item_name}" will
                be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedDeleteId(null);
                }}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      <AddCategoryModal
        open={openAddCategory}
        onClose={() => setOpenAddCategory(false)}
        onCategoryAdded={refreshCategories}
      />
      {/* MENU MODAL */}
      {openAddMenu && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-70 animate-fadeIn"
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
                    className="border p-2 w-full rounded"
                    required
                  >
                    <option value="">Select Category</option>

                    {allCategories.map((cat) => (
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

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleUp {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-scaleUp {
          animation: scaleUp 0.3s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </>
  );
};

export default MyMenu;
