import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Edit2, Trash2, Plus, Heart } from "lucide-react";
import EditMenuModal from "../components/EditMenuModal";
import SingleMenuModal from "../components/SingleMenuModal";

const PLACEHOLDER_SVG = "data:image/svg+xml;base64,..."; // fallback placeholder

const MyMenu = () => {
  const [items, setItems] = useState([]);
  const [cartIds, setCartIds] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/menus/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await res.json();
        if (result.success) setItems(result.items);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCart = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/cart`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await res.json();
        if (result.success) {
          setCartIds(result.cart.items.map((i) => i.menuItem._id));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyItems();
    fetchCart();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/menus/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      if (result.success) setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCart = async (menuId, item) => {
    const inCart = cartIds.includes(menuId);
    try {
      if (inCart) {
        // Remove
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
            { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
          );
        }
        setCartIds(cartIds.filter((id) => id !== menuId));
      } else {
        // Add
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ menuItemId: menuId, quantity: 1 }),
        });
        setCartIds([...cartIds, menuId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-[70px] bg-gray-50 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Menu Items</h1>
          <button
            onClick={() => navigate("/create-menu")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            <Plus size={20} className="mr-2" />
            Add New
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No menu items yet.{" "}
            <button
              onClick={() => navigate("/create-menu")}
              className="text-blue-600 underline"
            >
              Create one!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-lg p-4 animate-slide-up cursor-pointer relative"
                onClick={() => {
                  setSelectedItem(item);
                  setViewOpen(true);
                }}
              >
                {/* Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCart(item._id, item);
                  }}
                  className="absolute top-3 right-3 z-20 p-2 bg-white/80 backdrop-blur rounded-full shadow-md hover:bg-white"
                >
                  <Heart
                    size={20}
                    className={`${
                      cartIds.includes(item._id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>

                <div className="relative h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${
                      item.images[0] || PLACEHOLDER_SVG
                    }`}
                    alt={item.item_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-xl font-bold mb-2">{item.item_name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {item.short_description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-green-600">
                    ${item.price}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                        setEditOpen(true);
                      }}
                      className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <EditMenuModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          item={selectedItem}
          token={token}
          onUpdated={() => window.location.reload()}
        />

        <SingleMenuModal
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          item={selectedItem}
          inCart={cartIds.includes(selectedItem?._id)}
          toggleCart={toggleCart}
        />
      </div>
    </div>
  );
};

export default MyMenu;
