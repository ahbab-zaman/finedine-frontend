import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import SingleMenuModal from "./SingleMenuModal";
import { useToast } from "./ToastProvider";

const MenuItemList = ({ menuItems = [] }) => {
  const [cartIds, setCartIds] = useState([]);
  const [adding, setAdding] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bouncingIds, setBouncingIds] = useState([]); // For bounce effect
  const { token } = useAuthStore();
  const isAuth = !!token;
  const toast = useToast();

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuth) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/cart`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 401 || res.status === 403) {
          console.error("Session expired");
          return;
        }
        const result = await res.json();
        if (result.success) {
          setCartIds(result.cart.items.map((i) => i.menuItem._id));
        }
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        toast.push({ message: "Failed to load cart", type: "error" });
      }
    };
    fetchCart();
  }, [token, isAuth, toast]);

  const toggleCart = async (menuId, itemName) => {
    if (!isAuth) {
      toast.push({
        message: "Please login to add items to cart",
        type: "error",
      });
      return;
    }

    const inCart = cartIds.includes(menuId);
    setAdding((prev) => ({ ...prev, [menuId]: true }));

    try {
      if (inCart) {
        // Remove from cart
        const cartRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/cart`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const cartData = await cartRes.json();
        const found = cartData.cart.items.find(
          (c) => c.menuItem._id === menuId
        );
        if (found) {
          await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/cart/${found._id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
        setCartIds((prev) => prev.filter((id) => id !== menuId));
        toast.push({
          message: `${itemName} removed from cart`,
          type: "success",
        });
        // Dispatch event to update cart count in Navbar
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else {
        // Add to cart
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/cart`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ menuItemId: menuId, quantity: 1 }),
          }
        );
        const result = await res.json();
        if (result.success) {
          setCartIds((prev) => [...prev, menuId]);
          toast.push({
            message: `${itemName} added to cart!`,
            type: "success",
          });

          // Trigger bounce animation
          setBouncingIds((prev) => [...prev, menuId]);
          setTimeout(() => {
            setBouncingIds((prev) => prev.filter((id) => id !== menuId));
          }, 300);

          // Dispatch event to update cart count in Navbar
          window.dispatchEvent(new CustomEvent("cartUpdated"));
        } else {
          toast.push({
            message: result.message || "Failed to add to cart",
            type: "error",
          });
        }
      }
    } catch (err) {
      console.error("Cart operation failed:", err);
      toast.push({
        message: "Failed to update cart. Please try again.",
        type: "error",
      });
    } finally {
      setAdding((prev) => ({ ...prev, [menuId]: false }));
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <div className="w-11/12 mx-auto py-6">
      {/* Single Menu Modal */}
      <SingleMenuModal
        open={modalOpen}
        onClose={closeModal}
        item={selectedItem}
        inCart={selectedItem ? cartIds.includes(selectedItem._id) : false}
        toggleCart={toggleCart}
        isLoading={selectedItem ? adding[selectedItem._id] : false}
      />

      {/* Menu Grid */}
      {menuItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {menuItems.map((item) => {
            const inCart = cartIds.includes(item._id);
            const isLoading = adding[item._id];
            const isBouncing = bouncingIds.includes(item._id);

            return (
              <article
                key={item._id}
                className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200"
                onClick={() => openModal(item)}
              >
                <div className="flex items-start p-4 sm:p-6 gap-4 sm:gap-6">
                  {/* Left Content Section */}
                  <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors line-clamp-2">
                      {item.item_name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-2">
                      {item.short_description}
                    </p>
                    <div className="text-xl sm:text-2xl font-semibold text-red-500">
                      BD {item.price}
                    </div>
                    <div className="flex gap-2">
                      {item.isVegetarian && (
                        <div
                          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full border-2 border-gray-300"
                          title="Vegetarian"
                        >
                          <span className="text-base sm:text-lg">🌾</span>
                        </div>
                      )}
                      {item.isVegan && (
                        <div
                          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full border-2 border-gray-300"
                          title="Vegan"
                        >
                          <span className="text-base sm:text-lg">🌿</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Image Section */}
                  <div className="relative flex-shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-lg overflow-hidden shadow-md">
                      <img
                        src={
                          item.images?.length
                            ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                                item.images[0]
                              }`
                            : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"
                        }
                        alt={item.item_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCart(item._id, item.item_name);
                      }}
                      disabled={isLoading}
                      className={`absolute -top-2 -right-2 z-10 p-1.5 sm:p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform ${
                        isBouncing ? "animate-bounce-heart" : ""
                      } border border-gray-200`}
                      aria-label={inCart ? "Remove from cart" : "Add to cart"}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Heart
                          size={18}
                          className={`sm:w-5 sm:h-5 transition-all ${
                            inCart
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <span className="text-4xl">🍽️</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No menu items available
          </h3>
          <p className="text-gray-600 text-lg">
            Check back later for delicious options!
          </p>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }

        @keyframes bounce-heart {
          0% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(0.9); }
          75% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-bounce-heart { animation: bounce-heart 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default MenuItemList;
