const MenuDialog = ({ open, onClose, item }) => {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white max-w-lg w-full rounded-xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 text-xl"
        >
          ✕
        </button>

        <img
          src={item.image}
          className="w-full h-56 object-cover rounded-lg mb-4"
          alt=""
        />

        <h2 className="text-2xl font-semibold">{item.name}</h2>
        <p className="text-gray-600 mt-2">{item.description}</p>

        <p className="mt-4 text-red-600 text-lg font-bold">
          BD {item.price}
        </p>

        {item.category && (
          <p className="text-sm text-gray-500 mt-1">
            Category: {item.category}
          </p>
        )}
      </div>
    </div>
  );
};

export default MenuDialog;
