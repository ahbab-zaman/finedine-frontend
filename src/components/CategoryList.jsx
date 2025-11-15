// src/components/CategoryList.jsx
import React from "react";

const CategoryList = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 animate-slide-in-left">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category._id}>
            <button
              onClick={() => onSelectCategory(category._id)}
              className={`w-full text-left px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category._id
                  ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
