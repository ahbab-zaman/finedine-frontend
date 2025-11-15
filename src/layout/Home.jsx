// const Home = () => {
//   return (
//     <div className="pt-[70px]">
//       <div className="container mx-auto py-6">
//         <div>
//           <h2 className="text-[20px] font-bold mb-2">Copy Of Sample Menu</h2>
//           <p className="text-[16px] font-semibold mb-[5px]">Your happy place</p>
//           <p className="text-[14px] font-light">
//             20% VAT included to all prices
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

// src/layout/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryList from "../components/CategoryList";
import MenuItemList from "../components/MenuItemList";
import { useAuthStore } from "../store/useAuthStore";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { user, token } = useAuthStore();
  const isAuth = !!token && !!user;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/category`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(isAuth && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        const result = await res.json();
        if (result.success) {
          setCategories(result.categories);
          if (result.categories.length > 0) {
            setSelectedCategory(result.categories[0]._id);
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchMenuItems = async (catId = null) => {
      try {
        const url = catId
          ? `${import.meta.env.VITE_API_BASE_URL}/api/menus?category=${catId}`
          : `${import.meta.env.VITE_API_BASE_URL}/api/menus`;
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(isAuth && { Authorization: `Bearer ${token}` }),
          },
        });
        const result = await res.json();
        if (result.success) {
          setMenuItems(result.items || []);
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
      }
    };

    fetchCategories();
    if (selectedCategory) {
      fetchMenuItems(selectedCategory);
    }
  }, [selectedCategory, isAuth, token]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
  };

  return (
    <div className="pt-[70px] bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Copy Of Sample Menu
          </h2>
          <p className="text-lg font-semibold mb-2 text-gray-600">
            Your happy place
          </p>
          <p className="text-sm text-gray-500">
            20% VAT included to all prices
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
            <MenuItemList menuItems={menuItems} />
          </div>
        </div>

        {isAuth && user && (
          <div className="mt-8 animate-slide-up">
            <Link
              to="/cart"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View Cart ({menuItems.filter((item) => item.inCart).length} items)
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
