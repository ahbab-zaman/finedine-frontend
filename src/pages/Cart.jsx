// src/pages/Cart.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const isAuth = !!token;

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
      return;
    }

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
          setCart(result.cart);
          const calcTotal = result.cart.items.reduce((sum, item) => {
            return sum + item.menuItem.price * item.quantity;
          }, 0);
          setTotal(calcTotal);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, [isAuth, token, navigate]);

  const updateQuantity = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/${cartItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQty }),
        }
      );
      const result = await res.json();
      if (result.success) {
        setCart(result.cart);
        const calcTotal = result.cart.items.reduce((sum, item) => {
          return sum + item.menuItem.price * item.quantity;
        }, 0);
        setTotal(calcTotal);
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/${cartItemId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      if (result.success) {
        setCart(result.cart);
        const calcTotal = result.cart.items.reduce((sum, item) => {
          return sum + item.menuItem.price * item.quantity;
        }, 0);
        setTotal(calcTotal);
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Clear entire cart?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/clear`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      if (result.success) {
        setCart(result.cart);
        setTotal(0);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  if (!isAuth) return null;

  return (
    <div className="pt-[70px] bg-gray-50 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <ShoppingBag size={32} className="mr-2 text-blue-600" />
          Your Cart
        </h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.items.map((cartItem) => (
                <div
                  key={cartItem._id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between animate-slide-up"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/${
                        cartItem.menuItem.images[0] || ""
                      }`}
                      alt={cartItem.menuItem.item_name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {cartItem.menuItem.item_name}
                      </h3>
                      <p className="text-gray-600">
                        ${cartItem.menuItem.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(cartItem._id, cartItem.quantity - 1)
                        }
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(cartItem._id, cartItem.quantity + 1)
                        }
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(cartItem._id)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 sticky bottom-0 animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold">
                  Total: ${total.toFixed(2)}
                </span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={clearCart}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                >
                  Clear Cart
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300">
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
