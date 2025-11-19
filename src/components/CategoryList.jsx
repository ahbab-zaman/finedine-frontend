import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
const CategoryList = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-11/12 mx-auto animate-slide-in-left md:sticky md:top-0 md:z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 gap-2 md:gap-0">
        <div className="w-full md:w-auto">
          {/* Desktop: Horizontal Button Tabs */}
          <div className="hidden md:flex flex-wrap gap-3">
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

          {/* Mobile: Dropdown Select */}
          <select
            value={selectedCategory || ""}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="md:hidden w-full px-5 py-2 rounded-lg border border-pink-500 text-pink-600 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#e6034b] focus:border-transparent transition-all hover:bg-pink-50"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
