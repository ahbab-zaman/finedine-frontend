import React, { useState, useEffect } from "react";
import AddCategoryModal from "./AddCategoryModal";

const CategoryList = ({ categories, selectedCategory, onSelectCategory }) => {
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 animate-slide-in-left">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
        <button
          onClick={() => setOpenAdd(true)}
          className="text-blue-600 font-semibold hover:underline"
        >
          + Add
        </button>
      </div>
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

      <AddCategoryModal open={openAdd} onClose={() => setOpenAdd(false)} />
    </div>
  );
};

export default CategoryList;
