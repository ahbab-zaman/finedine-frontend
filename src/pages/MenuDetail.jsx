// src/pages/MenuDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";

const MenuDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { token } = useAuthStore();
  const isAuth = !!token;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/menus/${id}`
        );
        const result = await res.json();
        if (result.success) {
          setItem(result.item);
        }
      } catch (err) {
        console.error("Error fetching menu item:", err);
      }
    };

    fetchItem();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuth) {
      alert("Please login to add to cart");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ menuItemId: id, quantity }),
      });
      const result = await res.json();
      if (result.success) {
        alert("Added to cart!");
        navigate("/cart");
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  if (!item)
    return (
      <div className="pt-[70px] flex justify-center items-center h-64">
        Loading...
      </div>
    );

  return (
    <div className="pt-[70px] bg-gray-50 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors duration-300"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Menu
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-slide-up">
          <div className="relative h-96">
            {item.images && item.images.length > 0 ? (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/${item.images[0]}`}
                alt={item.item_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">No Image</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              {item.item_name}
            </h1>
            <p className="text-gray-600 mb-4 text-lg">
              {item.short_description}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-2xl font-bold text-green-600">
                  ${item.price}
                </span>
                <p className="text-sm text-gray-500">Price</p>
              </div>
              <div>
                <span className="text-lg font-semibold">
                  {item.calories} cal
                </span>
                <p className="text-sm text-gray-500">Calories</p>
              </div>
            </div>
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {item.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-300"
                >
                  <Minus size={16} />
                </button>
                <span className="text-xl font-semibold px-4 py-2 bg-gray-100 rounded">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-300"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Add to Cart
                <ShoppingCart size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetail;
