import React, { useState, useEffect } from "react";

const EditMenuModal = ({ open, onClose, item, token, onUpdated }) => {
  const [form, setForm] = useState({
    category: "",
    item_name: "",
    short_description: "",
    price: "",
    price_per_calorie: "",
    calories: "",
    ingredients: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (item) {
      setForm({
        category: item.category?._id || "",
        item_name: item.item_name,
        short_description: item.short_description,
        price: item.price,
        price_per_calorie: item.price_per_calorie || "",
        calories: item.calories,
        ingredients: item.ingredients?.join(", ") || "",
      });

      setExistingImages(item.images || []);
    }
  }, [item]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    newImages.forEach((file) => fd.append("images", file));

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/menus/${item._id}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      }
    );

    const result = await res.json();

    if (result.success) {
      onUpdated();
      onClose();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div
        className="
        bg-white 
        w-full 
        max-w-2xl 
        max-h-[90vh] 
        overflow-y-auto 
        rounded-2xl 
        p-6 
        shadow-xl 
        animate-[scaleIn_0.2s_ease]"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold">Edit Menu Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="item_name"
            value={form.item_name}
            onChange={handleChange}
            placeholder="Item Name"
            className="w-full border p-2 rounded-lg"
          />

          <textarea
            name="short_description"
            value={form.short_description}
            onChange={handleChange}
            placeholder="Short Description"
            className="w-full border p-2 rounded-lg"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border p-2 rounded-lg"
            />

            <input
              type="number"
              name="price_per_calorie"
              value={form.price_per_calorie}
              onChange={handleChange}
              placeholder="Price Per Calorie"
              className="w-full border p-2 rounded-lg"
            />
          </div>

          <input
            type="number"
            name="calories"
            value={form.calories}
            onChange={handleChange}
            placeholder="Calories"
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="text"
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            placeholder="Ingredients (comma separated)"
            className="w-full border p-2 rounded-lg"
          />

          {/* Existing Images */}
          <div>
            <p className="text-gray-600 mb-2">Current Images</p>
            <div className="flex gap-2 flex-wrap">
              {existingImages.map((img, i) => (
                <img
                  key={i}
                  src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${img}`}
                  className="w-20 h-20 rounded-lg object-cover border"
                  alt="preview"
                />
              ))}
            </div>
          </div>

          {/* New Images Upload */}
          <div>
            <p className="text-gray-600 mb-2">Upload New Images</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuModal;
