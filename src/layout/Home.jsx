import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import CategoryList from "../components/CategoryList";
import MenuItemList from "../components/MenuItemList";
import SingleMenuModal from "../components/SingleMenuModal";

const Home = () => {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sectionObserverRef = useRef(null);

  // ==========================
  // FETCH CATEGORIES
  // ==========================
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/category`
      );
      const result = await res.json();
      if (result.success) {
        setCategories(result.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ==========================
  // FETCH MENU ITEMS
  // ==========================
  const fetchMenus = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/menus`);
      const result = await res.json();
      if (result.success) {
        setMenuItems(result.items);
      }
    } catch (err) {
      console.error("Error fetching menus:", err);
    }
  };

  // Load data on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCategories(), fetchMenus()]).finally(() => {
      setLoading(false);
    });
  }, []);

  // Scroll state for category nav adjustments (only active on home page)
  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Auto-select first category with items
  useEffect(() => {
    if (categories.length > 0 && menuItems.length > 0 && !selectedCategory) {
      const firstWithItems = categories.find((cat) =>
        menuItems.some((item) => item.category?._id === cat._id)
      );
      if (firstWithItems) {
        setSelectedCategory(firstWithItems._id);
      }
    }
  }, [categories, menuItems, selectedCategory]);

  // Update showEmptyMessage based on selected category
  useEffect(() => {
    if (selectedCategory) {
      const hasItems = menuItems.some(
        (item) => item.category?._id === selectedCategory
      );
      setShowEmptyMessage(!hasItems);
    } else {
      setShowEmptyMessage(false);
    }
  }, [selectedCategory, menuItems]);

  // Scroll to selected category section
  useEffect(() => {
    if (selectedCategory) {
      const el = document.getElementById(`cat-${selectedCategory}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [selectedCategory]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300); // Show after scrolling 300px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-select category on scroll using IntersectionObserver
  useEffect(() => {
    if (loading || categories.length === 0) return;

    sectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const catId = entry.target.dataset.categoryId;
            setSelectedCategory(catId);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: "-20% 0px -70% 0px", // Adjust to prioritize the upper section in viewport
      }
    );

    const sections = document.querySelectorAll("[data-category-section]");
    sections.forEach((section) => {
      sectionObserverRef.current.observe(section);
    });

    return () => {
      if (sectionObserverRef.current) {
        sectionObserverRef.current.disconnect();
      }
    };
  }, [categories, menuItems, loading]);

  // Category select
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const visibleCategories = useMemo(
    () =>
      categories.filter((cat) =>
        menuItems.some((item) => item.category?._id === cat._id)
      ),
    [categories, menuItems]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading menu...</div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen transition-all duration-300 ${
        isScrolled ? "pt-0" : "pt-[30px]"
      }`}
    >
      <div className="mx-auto">
        <div className="w-11/12 mx-auto animate-fade-in pb-4">
          <h2 className="text-2xl font-bold -gray-800">Menu</h2>
          <p className="text-lg font-semibold text-gray-600">
            Explore by categories
          </p>
        </div>
        <div className="flex flex-col gap-8 ">
          {/* Sticky Category Navigation */}
          <div
            className={`sticky border-b border-gray-200 z-40 py-3 transition-all duration-300  ${
              isScrolled
                ? "top-0 bg-white/95 backdrop-blur-md shadow-sm"
                : "top-[70px]"
            }`}
          >
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              refreshCategories={fetchCategories}
              refreshMenus={fetchMenus}
            />
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No categories available.
            </div>
          ) : (
            <>
              {visibleCategories.map((category) => {
                const categoryItems = menuItems.filter(
                  (item) => item.category?._id === category._id
                );
                return (
                  <section
                    key={category._id}
                    id={`cat-${category._id}`}
                    data-category-section
                    data-category-id={category._id}
                    className={`${
                      isScrolled
                        ? "scroll-mt-0 w-11/12"
                        : "scroll-mt-[120px] w-11/12"
                    } first:scroll-mt-[70px]`} // Adjust offset dynamically
                  >
                    <div className="pt-4 mb-4 w-11/12 mx-auto">
                      <h3 className="text-xl font-bold mb-2 text-gray-800">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <MenuItemList
                      menuItems={categoryItems}
                      onViewDetails={handleViewDetails}
                    />
                  </section>
                );
              })}
              {showEmptyMessage &&
                selectedCategory &&
                (() => {
                  const category = categories.find(
                    (c) => c._id === selectedCategory
                  );
                  if (!category) return null;
                  return (
                    <section
                      key={`empty-${selectedCategory}`}
                      id={`cat-${selectedCategory}`}
                      className={`${
                        isScrolled
                          ? "scroll-mt-0 w-11/12"
                          : "scroll-mt-[120px] w-11/12"
                      }`}
                    >
                      <div className="p-6 mb-4 w-11/12">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 w-11/12 mx-auto flex">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <div className="text-center py-12 text-gray-500">
                        No menu items available in this category.
                      </div>
                    </section>
                  );
                })()}
            </>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-20 bg-[#E6034B] hover:bg-[#ae0d40] text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      )}

      {/* Single Menu Modal */}
      <SingleMenuModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        item={selectedItem}
      />
    </div>
  );
};

export default Home;
