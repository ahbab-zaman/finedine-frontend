import React, { useState } from "react";

const AddCategoryModal = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/category`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description: desc }),
        }
      );
      const result = await res.json();
      if (result.success) {
        alert("Category added!");
        setName("");
        setDesc("");
        onClose();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error adding category");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-scaleIn">
        <h2 className="text-xl font-semibold mb-4">Add Category</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
