import React from "react";
import { X, Heart } from "lucide-react";

const SingleMenuModal = ({ open, onClose, item, inCart, toggleCart }) => {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-slide-up">
        {/* Image */}
        <div className="relative">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${
              item.images[0]
            }`}
            alt={item.item_name}
            className="w-full h-64 object-cover"
          />
          <button
            className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow"
            onClick={() => toggleCart(item._id, item)}
          >
            <Heart
              size={24}
              className={`${
                inCart ? "fill-red-500 text-red-500" : "text-gray-700"
              }`}
            />
          </button>
          <button
            className="absolute top-4 left-4 bg-white p-2 rounded-full shadow"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <h2 className="text-2xl font-bold">{item.item_name}</h2>
          <p className="text-gray-600">
            {item.long_description || item.short_description}
          </p>
          <p className="text-xl font-semibold text-green-600">${item.price}</p>
          <button
            className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => toggleCart(item._id, item)}
          >
            {inCart ? "Remove from Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleMenuModal;
