import React from "react";

const MenuCard = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow-sm cursor-pointer border hover:shadow-md transition"
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="text-gray-600 mt-1 text-sm line-clamp-2">
            {item.description}
          </p>

          <p className="text-red-500 font-semibold mt-2">BD {item.price}</p>
        </div>

        <img
          src={item.image}
          className="w-20 h-20 object-cover rounded-lg ml-4"
          alt=""
        />
      </div>
    </div>
  );
};

export default MenuCard;
