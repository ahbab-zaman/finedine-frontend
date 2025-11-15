// src/pages/CreateMenuItem.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Upload, Image, Save } from "lucide-react";

const CreateMenuItem = () => {
  const [formData, setFormData] = useState({
    category: "",
    item_name: "",
    short_description: "",
    price: "",
    price_per_calorie: "",
    calories: "",
    ingredients: "",
  });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuthStore();

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/category`
        );
        const result = await res.json();
        if (result.success) {
          setCategories(result.categories);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });
    images.forEach((image) => data.append("images", image));

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
        navigate("/my-menu");
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[70px] bg-gray-50 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Create New Menu Item
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto animate-slide-up"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-semibold mb-2">
                Item Name
              </label>
              <input
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Calories
              </label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">
                Short Description
              </label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">
                Ingredients (comma-separated)
              </label>
              <input
                type="text"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., tomato, cheese, basil"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 flex items-center">
                <Upload size={16} className="mr-2" />
                Images (up to 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 border rounded-lg focus:outline-none"
              />
              {images.length > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  {images.length} images selected
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            <Save size={20} className="mr-2" />
            {loading ? "Creating..." : "Create Menu Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMenuItem;
