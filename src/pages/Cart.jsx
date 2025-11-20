import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  Loader2,
  X,
} from "lucide-react";
import { useToast } from "../components/ToastProvider";
import Loading from "../components/Loading";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(new Set());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { push: toast } = useToast();
  const isAuth = !!token;

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/cart`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await res.json();
        if (result.success) {
          const validItems = result.cart.items.filter((i) => i.menuItem);
          setCart({ ...result.cart, items: validItems });
          setTotal(
            validItems.reduce(
              (sum, item) => sum + item.menuItem.price * item.quantity,
              0
            )
          );
          toast({
            message: "Cart loaded successfully",
            type: "success",
            duration: 2000,
          });
        } else {
          toast({
            message: "Failed to load cart",
            type: "error",
            duration: 3000,
          });
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        toast({
          message: "Error fetching cart. Please try again.",
          type: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuth, token, navigate, toast]);

  const updateQuantity = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    setUpdating((prev) => new Set([...prev, cartItemId]));
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
        const validItems = result.cart.items.filter((i) => i.menuItem);
        setCart({ ...result.cart, items: validItems });
        setTotal(
          validItems.reduce(
            (sum, item) => sum + item.menuItem.price * item.quantity,
            0
          )
        );
        toast({ message: "Quantity updated", type: "success", duration: 2000 });
      } else {
        toast({
          message: "Failed to update quantity",
          type: "error",
          duration: 3000,
        });
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast({
        message: "Error updating quantity. Please try again.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setUpdating((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const removeItem = async (cartItemId) => {
    if (!window.confirm("Remove this item from cart?")) return;
    setUpdating((prev) => new Set([...prev, cartItemId]));
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/${cartItemId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await res.json();
      if (result.success) {
        const validItems = result.cart.items.filter((i) => i.menuItem);
        setCart({ ...result.cart, items: validItems });
        setTotal(
          validItems.reduce(
            (sum, item) => sum + item.menuItem.price * item.quantity,
            0
          )
        );
        toast({
          message: "Item removed from cart",
          type: "success",
          duration: 2000,
        });
      } else {
        toast({
          message: "Failed to remove item",
          type: "error",
          duration: 3000,
        });
      }
    } catch (err) {
      console.error("Error removing item:", err);
      toast({
        message: "Error removing item. Please try again.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setUpdating((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleClearCartConfirm = async () => {
    setShowClearConfirm(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/clear`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await res.json();
      if (result.success) {
        setCart({ items: [] });
        setTotal(0);
        toast({
          message: "Cart cleared successfully",
          type: "success",
          duration: 2000,
        });
      } else {
        toast({
          message: "Failed to clear cart",
          type: "error",
          duration: 3000,
        });
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast({
        message: "Error clearing cart. Please try again.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const clearCart = () => {
    setShowClearConfirm(true);
  };

  if (!isAuth) return null;

  if (loading) return <Loading />;

  return (
    <>
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen pt-6 pb-20">
        <div className="w-11/12 mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 flex items-center gap-3">
            <ShoppingBag size={32} className="text-[#E6034B]" />
            Your Cart
          </h1>

          {cart.items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={80} className="mx-auto mb-6 text-gray-300" />
              <p className="text-xl md:text-2xl text-gray-500 font-medium mb-6">
                Your cart is empty
              </p>
              <p className="text-gray-400 mb-8">
                Start by browsing our delicious menu!
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-[#E6034B] text-white rounded-xl hover:bg-[#d41350] shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#E6034B] focus:ring-offset-2"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cart.items.map((cartItem) => {
                  const menu = cartItem.menuItem;
                  return (
                    <article
                      key={cartItem._id}
                      className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
                      role="listitem"
                      aria-label={`Cart item: ${
                        menu?.item_name || "Item deleted"
                      }`}
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${
                            menu?.images?.[0] || ""
                          }`}
                          alt={menu?.item_name || "Deleted item"}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-sm flex-shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base md:text-lg font-semibold text-gray-800 truncate">
                            {menu?.item_name || "Item no longer available"}
                          </h3>
                          <p className="text-gray-600 text-sm md:text-base font-medium mt-1">
                            ${menu?.price?.toFixed(2) || "0.00"}
                          </p>
                          {menu?.description && (
                            <p className="text-gray-500 text-xs mt-2 line-clamp-2">
                              {menu.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-6">
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full shadow-inner min-w-[120px] justify-center">
                          <button
                            onClick={() =>
                              updateQuantity(
                                cartItem._id,
                                cartItem.quantity - 1
                              )
                            }
                            disabled={updating.has(cartItem._id)}
                            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updating.has(cartItem._id) ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Minus size={16} />
                            )}
                          </button>
                          <span className="w-8 text-center font-bold text-gray-800 text-sm">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                cartItem._id,
                                cartItem.quantity + 1
                              )
                            }
                            disabled={updating.has(cartItem._id)}
                            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updating.has(cartItem._id) ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Plus size={16} />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeItem(cartItem._id)}
                            disabled={updating.has(cartItem._id)}
                            className="p-2 text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            {updating.has(cartItem._id) ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors relative">
                            <Heart size={18} className="transition-colors" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Subtotal & Actions */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky bottom-0 md:static">
                <div className="flex justify-between items-center mb-6 text-lg md:text-xl">
                  <span className="font-bold text-gray-800">Subtotal:</span>
                  <span className="font-bold text-2xl text-[#E6034B]">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={cart.items.length === 0 || loading}
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="flex-1 px-6 py-3 bg-[#E6034B] text-white rounded-xl hover:bg-[#d41350] shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#E6034B] focus:ring-offset-2"
                  >
                    Continue Shopping
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Shipping and taxes calculated at checkout
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Clear Cart Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 transform animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Clear Cart?</h2>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="text-gray-600 mb-6">
              <p className="text-sm">
                This action cannot be undone. All items will be removed from
                your cart.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCartConfirm}
                className="flex-1 px-4 py-2.5 bg-[#E6034B] text-white rounded-xl hover:bg-red-700 shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#E6034B] focus:ring-offset-2"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
