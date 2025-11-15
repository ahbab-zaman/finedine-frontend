import React, { useState, useEffect } from "react";
import CategoryList from "../components/CategoryList";
import MenuItemList from "../components/MenuItemList";
import SingleMenuModal from "../components/SingleMenuModal";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartItems, setCartItems] = useState({}); // Track items in cart

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/category`
        );
        const result = await res.json();
        if (result.success) {
          setCategories(result.categories);
          setSelectedCategory(result.categories[0]?._id || null);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch all menu items
  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/menus`
        );
        const result = await res.json();
        if (result.success) {
          setMenuItems(result.items || []);
        }
      } catch (err) {
        console.error("Error fetching menus:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const handleCategorySelect = (catId) => setSelectedCategory(catId);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const handleCloseModal = () => {
    setViewOpen(false);
    setSelectedItem(null);
  };

  const toggleCart = (id, item) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[id]) delete updated[id];
      else updated[id] = item;
      return updated;
    });
  };

  // Filter menus by selected category
  const filteredMenus = selectedCategory
    ? menuItems.filter((item) => item.category?._id === selectedCategory)
    : menuItems;

  if (loading) {
    return (
      <div className="pt-[70px] flex justify-center items-center h-64">
        <div className="text-xl">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="pt-[70px] bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Menu</h2>
          <p className="text-lg font-semibold mb-2 text-gray-600">
            Explore by categories
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="lg:w-1/4">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>

          {/* Menu Items */}
          <div className="lg:w-3/4">
            {filteredMenus.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No menu items available in this category.
              </div>
            ) : (
              <MenuItemList
                menuItems={filteredMenus}
                onViewDetails={handleViewDetails}
              />
            )}
          </div>
        </div>

        {/* Details Modal */}
        <SingleMenuModal
          open={viewOpen}
          onClose={handleCloseModal}
          item={selectedItem}
          inCart={selectedItem && !!cartItems[selectedItem._id]}
          toggleCart={toggleCart}
        />
      </div>
    </div>
  );
};

export default Home;
