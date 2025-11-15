// src/pages/MyMenu.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Edit2, Trash2, Plus } from "lucide-react";

const MyMenu = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
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
        console.error(err);
      }
    };
    fetchMyItems();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/menus/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      if (result.success) {
        setItems(items.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-[70px] bg-gray-50 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Menu Items</h1>
          <button
            onClick={() => navigate("/create-menu")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            <Plus size={20} className="mr-2" />
            Add New
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg p-4 animate-slide-up"
            >
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/${
                  item.images[0] || ""
                }`}
                alt={item.item_name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{item.item_name}</h3>
              <p className="text-gray-600 mb-4">{item.short_description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-green-600">
                  ${item.price}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => navigate(`/edit-menu/${item._id}`)}
                    className="p-2 text-blue-500 hover:text-blue-700"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyMenu;
