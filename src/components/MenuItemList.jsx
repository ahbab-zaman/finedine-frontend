import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Heart, ShoppingCart, Plus } from "lucide-react";

const MenuItemList = ({ menuItems }) => {
  const [adding, setAdding] = useState({});
  const { token } = useAuthStore();
  const isAuth = !!token;

  const handleAddToCart = async (itemId) => {
    if (!isAuth) {
      alert("Please login to add to cart");
      return;
    }

    setAdding((prev) => ({ ...prev, [itemId]: true }));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ menuItemId: itemId, quantity: 1 }),
      });
      const result = await res.json();
      if (result.success) {
        alert("Added to cart!");
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart");
    } finally {
      setAdding((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-500 group"
        >
          <div className="relative h-48 bg-gray-200">
            {" "}
            {/* Changed bg to neutral gray for better visibility */}
            {item.images && item.images.length > 0 ? (
              <>
                {console.log(
                  "Attempting to load image for",
                  item.item_name,
                  ":",
                  `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                    item.images[0]
                  }`
                )}{" "}
                {/* Temp debug log */}
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${
                    item.images[0]
                  }`}
                  alt={item.item_name}
                  className="w-full h-full object-cover" // Removed group-hover for now
                  onLoad={() => console.log("✅ Image loaded:", item.images[0])} // Success log
                  onError={(e) => {
                    console.error(
                      "❌ Image failed:",
                      e.target.src,
                      "- Likely CORS or 404"
                    ); // Enhanced error log
                    // Fallback to online placeholder (no local file needed)
                    e.target.src =
                      "https://via.placeholder.com/300x200/CCCCCC/666666?text=No+Image+Available";
                  }}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <span className="text-gray-500 text-lg font-semibold">
                  No Image
                </span>
              </div>
            )}
            <button className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:scale-110">
              <Heart size={20} className="text-red-500" />
            </button>
          </div>
          <div className="p-4">
            <h4 className="text-xl font-bold mb-1 text-gray-800">
              {item.item_name}
            </h4>
            <p className="text-gray-600 mb-2 line-clamp-2">
              {item.short_description}
            </p>
            <div className="flex justify-between items-center mb-3">
              <span className="text-2xl font-bold text-green-600">
                ${item.price}
              </span>
              <span className="text-sm text-gray-500">{item.calories} cal</span>
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/menu/${item._id}`}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-sm"
              >
                View Details
              </Link>
              <button
                onClick={() => handleAddToCart(item._id)}
                disabled={adding[item._id]}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center"
                title="Add to Cart"
              >
                {adding[item._id] ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShoppingCart size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItemList;
