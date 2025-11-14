import React, { useEffect, useState, useRef } from "react";
import { useMenuStore } from "../store/useMenuStore";
import MenuCard from "../components/MenuCard";
import MenuDialog from "../components/MenuDialog";

// Safe normalize
const normalize = (text) =>
  typeof text === "string"
    ? text.toLowerCase().replace(/_/g, "").replace(/\s+/g, "")
    : "";

const MenuShow = () => {
  const { menus, fetchMenus, loading } = useMenuStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const categoryRefs = useRef({});

  useEffect(() => {
    fetchMenus();
  }, []);

  if (menus.length === 0) return null;

  const allCategories = menus[0].categories.map((cat) => cat.category);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null); // reset subcategory
    const ref = categoryRefs.current[category];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="px-4 md:px-10 py-6">
      {/* Sticky Category Tabs */}
      <div className="sticky top-0 z-20 bg-white py-4 border-b border-gray-300 flex gap-3 overflow-x-auto">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-2 rounded-full border flex-shrink-0 ${
              selectedCategory === cat
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-lg text-gray-700 mt-6">Loading menus...</p>
      ) : (
        menus[0].categories.map((cat) => {
          const hasSubcategories =
            cat.subcategories && cat.subcategories.length > 0;
          const categoryItems = cat.items || [];

          // Determine which items to show
          let itemsToShow = categoryItems;
          if (hasSubcategories && selectedSubcategory) {
            const sub = cat.subcategories.find(
              (s) => normalize(s.subcategory) === normalize(selectedSubcategory)
            );
            itemsToShow = sub ? sub.items : [];
          }

          return (
            <div
              key={cat.category}
              ref={(el) => (categoryRefs.current[cat.category] = el)}
              className="mt-10"
            >
              <h2 className="text-2xl font-semibold mb-4">{cat.category}</h2>

              {/* Subcategory dropdown */}
              {hasSubcategories && (
                <select
                  value={selectedSubcategory || ""}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="mb-6 border rounded px-3 py-2"
                >
                  <option value="">Select Subcategory</option>
                  {cat.subcategories.map((sub) => (
                    <option key={sub.subcategory} value={sub.subcategory}>
                      {sub.subcategory}
                    </option>
                  ))}
                </select>
              )}

              {itemsToShow.length === 0 ? (
                <p className="text-gray-500">No items found.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {itemsToShow.map((item) => (
                    <MenuCard
                      key={item._id || item.category || Math.random()}
                      item={item}
                      onClick={() => {
                        setActiveItem(item);
                        setOpenDialog(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      <MenuDialog
        open={openDialog}
        item={activeItem}
        onClose={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default MenuShow;
