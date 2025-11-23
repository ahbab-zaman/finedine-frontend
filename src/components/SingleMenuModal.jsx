import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";

const getIngredientIcon = (ingredient) => {
  const lower = ingredient.toLowerCase().trim();
  const icons = {
    tomatoes: "https://www.svgrepo.com/show/447187/tomato-organic.svg",
    lemon: "",
    garlic: "https://www.svgrepo.com/download/218306.svg",
    shrimp: "https://www.svgrepo.com/download/489697.svg",
    basil: "https://www.svgrepo.com/download/417245.svg",
    cheese: "https://www.svgrepo.com/download/505201.svg",
    onion: "https://www.svgrepo.com/download/37669.svg",
    mushroom: "https://www.svgrepo.com/download/492648.svg",
    carrot: "https://www.svgrepo.com/download/506711.svg",
    lettuce: "https://www.svgrepo.com/download/311567.svg",
    romaine: "https://www.svgrepo.com/download/311567.svg",
    herbs: "https://www.svgrepo.com/download/198458.svg",
    "olive oil": "https://www.svgrepo.com/download/223265.svg",
    butter: "https://www.svgrepo.com/download/1091.svg",
    chicken: "https://www.svgrepo.com/download/530224.svg",
    beef: "https://www.svgrepo.com/download/530206.svg",
    pasta: "https://www.svgrepo.com/download/24257.svg",
    rice: "https://www.svgrepo.com/download/505200.svg",
    egg: "https://www.svgrepo.com/download/505209.svg",
    milk: "https://www.svgrepo.com/download/486303.svg",
    flour: "https://www.svgrepo.com/download/86109.svg",
    // Add more mappings as needed
  };
  return (
    icons[lower] || icons.herbs || "https://www.svgrepo.com/download/198458.svg"
  ); // Default to herbs
};

const SingleMenuModal = ({
  open,
  onClose,
  item,
  inCart,
  toggleCart,
  isLoading,
}) => {
  // ✅ All hooks at top
  const [isBouncing, setIsBouncing] = useState(false);

  // Handle heart click
  const handleHeartClick = () => {
    if (isLoading) return;
    toggleCart(item._id, item.item_name);
    setIsBouncing(true);
  };

  // Reset bounce animation
  useEffect(() => {
    if (isBouncing) {
      const timer = setTimeout(() => setIsBouncing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isBouncing]);

  // If modal not open or no item, render nothing
  if (!open || !item) return null;

  let ingredientsStr = "";
  if (typeof item.ingredients === "string") {
    ingredientsStr = item.ingredients;
  } else if (Array.isArray(item.ingredients)) {
    ingredientsStr = item.ingredients.join(", ");
  } else if (item.ingredients) {
    ingredientsStr = String(item.ingredients);
  }
  const ingredientsList = ingredientsStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl animate-slide-up overflow-y-auto max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left: Image */}
          <div className="relative md:w-1/2 bg-gray-100">
            <img
              src={
                item.images?.length
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                      item.images[0]
                    }`
                  : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop"
              }
              alt={item.item_name}
              className="w-full h-full object-cover min-h-[300px] md:min-h-[500px]"
            />

            {/* Close Button */}
            <button
              className="absolute top-4 left-4 bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-all"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg
                xmlns="https://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 8.586l4.95-4.95a1 1 0 011.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95a1 1 0 011.414-1.414L10 8.586z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Right: Content Section */}
          <div className="md:w-1/2 p-8 flex flex-col">
            <div className="flex-1 space-y-4">
              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900">
                {item.item_name}
              </h2>

              {/* Category */}
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {item.category?.name}
              </span>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {item.long_description || item.short_description}
              </p>

              {/* Price */}
              <div className="text-3xl font-bold text-red-600">
                BD {item.price}
              </div>

              {/* Calories & Ingredients */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Calories */}
                <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium w-fit">
                  <span>🔥</span>
                  <span>{item.calories ?? "N/A"} kcal</span>
                </div>

                {/* Ingredients */}
                <div className="flex flex-wrap gap-2">
                  {ingredientsList.map((ing, idx) => (
                    <span
                      key={idx}
                      className="relative inline-block p-2 bg-pink-100 rounded-full flex items-center justify-center"
                    >
                      <img
                        src={getIngredientIcon(ing)}
                        alt={ing}
                        title={ing}
                        className="w-6 h-6 object-cover rounded-full"
                        loading="lazy"
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Heart Icon Add to Cart */}
            <div className="mt-6 flex justify-end">
              <button
                className={`p-4 rounded-full shadow-lg transition-all transform ${
                  isBouncing ? "animate-bounce-heart" : ""
                } ${
                  inCart
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-pink-500 hover:bg-pink-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={handleHeartClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Heart
                    size={24}
                    className={
                      inCart ? "fill-white stroke-white" : "stroke-white"
                    }
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations & Scrollbar */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in .25s ease-out; }
        .animate-slide-up { animation: slide-up .35s ease-out; }

        /* Heart bounce animation */
        @keyframes bounce-heart {
          0% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(0.9); }
          75% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-bounce-heart {
          animation: bounce-heart 0.3s ease-out;
        }

        /* Thinner scroll for webkit browsers */
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default SingleMenuModal;
