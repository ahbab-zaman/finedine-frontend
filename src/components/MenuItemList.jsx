// src/components/MenuItemList.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

const MenuItemList = ({ menuItems }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-500 group"
        >
          <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            {item.images && item.images.length > 0 ? (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/${item.images[0]}`}
                alt={item.item_name}
                className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
              />
            ) : (
              <span className="text-white text-lg font-semibold">No Image</span>
            )}
            <button className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
            <Link
              to={`/menu/${item._id}`}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              View Details
              <ShoppingCart size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItemList;
