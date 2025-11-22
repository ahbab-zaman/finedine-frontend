import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  Edit2,
  Trash2,
  Plus,
  Heart,
  Loader2,
  X,
  ChevronDown,
  Upload,
  Search,
  Menu,
  Signal,
  Wifi,
  Battery,
  MessageCircle,
} from "lucide-react";
import EditMenuModal from "../components/EditMenuModal";
import SingleMenuModal from "../components/SingleMenuModal";
import Loading from "../components/Loading";
import { useToast } from "../components/ToastProvider";
import AddCategoryModal from "../components/AddCategoryModal";

const PLACEHOLDER_SVG = "data:image/svg+xml;base64,...";

const MyMenu = ({ categories = [], refreshCategories, refreshMenus }) => {
  const [items, setItems] = useState([]);
  const [cartIds, setCartIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const { token, user } = useAuthStore(); // Assuming user is available in store with _id
  const navigate = useNavigate();
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openAddMenu, setOpenAddMenu] = useState(false);
  const [menuForm, setMenuForm] = useState({
    category: "",
    item_name: "",
    short_description: "",
    price: "",
    calories: "",
    ingredients: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const toast = useToast();
  const [allCategories, setAllCategories] = useState([]);

  // New states for dynamic menu creation
  const [language, setLanguage] = useState("English");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Section Title",
      description: "Section Description",
      image: null,
      expanded: true,
      items: [],
    }
  ]);

  const updateSection = (sectionId, field, value) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, [field]: value } : s))
    );
  };

  const toggleSection = (sectionId) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, expanded: !s.expanded } : s
      )
    );
  };

  const updateItem = (sectionId, itemId, field, value) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            items: s.items.map((i) =>
              i.id === itemId ? { ...i, [field]: value } : i
            ),
          };
        }
        return s;
      })
    );
  };

  const handleSectionImageChange = (sectionId, e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateSection(sectionId, "image", url);
    }
  };

  const handleItemImageChange = (sectionId, itemId, e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateItem(sectionId, itemId, "image", url);
    }
  };

  const addItemToSection = (sectionId) => {
    const newId = Date.now();
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: [
                ...s.items,
                {
                  id: newId,
                  name: "Item Title",
                  desc: "Item Description",
                  price: 0.0,
                  calories: 0,
                  image: null,
                },
              ],
            }
          : s
      )
    );
  };

  const createCategoryIfNeeded = async (title, description) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: title,
            description: description || "",
            createdBy: user?._id || "", // Assuming user._id from store
          }),
        }
      );
      const result = await res.json();
      if (result.success) {
        return result.category._id;
      } else {
        throw new Error(result.message || "Failed to create category");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleNext = async () => {
    const allItems = sections.flatMap((section) =>
      section.items.map((item) => ({
        category: selectedCategory,
        item_name: item.name,
        short_description: item.desc,
        price: item.price.toString(),
        calories: item.calories.toString(),
        ingredients: "",
        images: [], // Skip images for now
      }))
    );

    if (allItems.length === 0) {
      toast.push({ message: "Please add at least one item", type: "error" });
      return;
    }

    setLoading(true);
    try {
      if (selectedCategory) {
        // Use selected category for all items
        for (const itemData of allItems) {
          const data = new FormData();
          Object.keys(itemData).forEach((key) => {
            if (itemData[key]) {
              data.append(key, itemData[key]);
            }
          });

          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/menus`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: data,
            }
          );

          const result = await res.json();
          if (!result.success) {
            throw new Error(result.message || "Failed to create menu item");
          }
        }
      } else {
        // Create category per section with items
        for (const section of sections) {
          if (section.items.length > 0) {
            const catId = await createCategoryIfNeeded(
              section.title,
              section.description
            );
            for (const item of section.items) {
              const itemData = {
                category: catId,
                item_name: item.name,
                short_description: item.desc,
                price: item.price.toString(),
                calories: item.calories.toString(),
                ingredients: "",
                images: [],
              };
              const data = new FormData();
              Object.keys(itemData).forEach((key) => {
                if (itemData[key]) {
                  data.append(key, itemData[key]);
                }
              });

              const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/menus`,
                {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` },
                  body: data,
                }
              );

              const result = await res.json();
              if (!result.success) {
                throw new Error(result.message || "Failed to create menu item");
              }
            }
          }
        }
      }

      toast.push({
        message: "Menu items created successfully!",
        type: "success",
      });

      // Refresh and navigate
      refreshMenus && refreshMenus();
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.push({
        message: err.message || "Failed to create menu items",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Existing handlers...
  const handleInputChange = (e) => {
    setMenuForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const resetForm = () => {
    setMenuForm({
      category: "",
      item_name: "",
      short_description: "",
      price: "",
      calories: "",
      ingredients: "",
    });
    setImages([]);
    setImagePreviews([]);
  };

  const handleSubmitMenu = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.push({ message: "Please login first", type: "error" });
      return;
    }

    setLoading(true);
    const data = new FormData();

    Object.keys(menuForm).forEach((key) => {
      if (menuForm[key]) data.append(key, menuForm[key]);
    });

    images.forEach((img) => data.append("images", img));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/menus`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );

      const result = await res.json();

      if (result.success) {
        toast.push({
          message: "Menu item created successfully",
          type: "success",
        });

        resetForm();
        setOpenAddMenu(false);

        refreshMenus && refreshMenus();

        navigate("/", { replace: true });
      } else {
        toast.push({
          message: result.message || "Failed to create menu item",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      toast.push({ message: "Failed to create menu", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchMyItems = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/menus/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await res.json();
        if (result.success) {
          setItems(result.items);
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
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
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    Promise.all([fetchMyItems(), fetchCart()]);
  }, [token, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/category`
        );

        const data = await res.json();

        if (data.success) {
          setAllCategories(data.categories);
          if (data.categories.length > 0) {
            setSelectedCategory(data.categories[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteId) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/menus/${selectedDeleteId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      if (result.success) {
        setItems((prevItems) =>
          prevItems.filter((i) => i._id !== selectedDeleteId)
        );
        setShowDeleteConfirm(false);
        setSelectedDeleteId(null);
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleDelete = (id) => {
    setSelectedDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const toggleCart = async (menuId, item) => {
    const inCart = cartIds.includes(menuId);
    try {
      if (inCart) {
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
        setCartIds((prev) => prev.filter((id) => id !== menuId));
      } else {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ menuItemId: menuId, quantity: 1 }),
        });
        setCartIds((prev) => [...prev, menuId]);
      }
    } catch (err) {
      console.error("Error toggling cart:", err);
    }
  };

  const isCategorySelected = !!selectedCategory;

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex lg:flex-row flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Left Side - Editor */}
        <div className="p-6 mx-auto w-[70%]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hello Ahbab Zaman! Let’s create your menu
            </h1>
            <p className="text-gray-600 text-sm">
              Bring your menu to life. Define your sections and items with
              images, names, descriptions, prices. Don’t worry, you can add more
              sections and items later.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm">Menu Language:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="ml-2 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>English</option>
                </select>
              </div>
              <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors">
                <img
                  src="https://media.finedinemenu.com/filters:strip_exif()/filters:format(webp)/14x14/JTMY8AYcI/a348c6d2-6ecd-4264-99de-1c396c4b6012.png"
                  alt="Auto Generate"
                  className="w-3.5 h-3.5"
                />
                <span>Auto Generate</span>
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Select Category (Optional)
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">
                  No Category (Use Sections as Categories)
                </option>
                {allCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-gray-600 text-sm italic mb-4">
              Example: Sections; “Starters”, “Salads”. Items; “Humus”,
              “Gazpacho”, “Cheese Plate”
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {sections.map((section) => (
                <div key={section.id}>
                  {/* Section Header */}
                  <div
                    className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleSection(section.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <ChevronDown
                      className={`w-4 h-4 mr-2 text-gray-500 transition-transform duration-200 ${
                        section.expanded ? "rotate-180" : ""
                      }`}
                    />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <label className="flex-shrink-0">
                        <div className="w-12 h-12 border-2 border-dashed border-gray-300 bg-gray-50 rounded flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
                          <Upload className="w-4 h-4 text-purple-600" />
                          <input
                            type="file"
                            accept="image/png,image/jpg,image/jpeg"
                            className="hidden"
                            onChange={(e) =>
                              handleSectionImageChange(section.id, e)
                            }
                          />
                        </div>
                      </label>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) =>
                            updateSection(section.id, "title", e.target.value)
                          }
                          className={`border-0 bg-transparent text-base font-semibold w-full focus:outline-none ${
                            isCategorySelected
                              ? "text-gray-400 cursor-not-allowed"
                              : ""
                          }`}
                          placeholder="Section Title"
                          readOnly={isCategorySelected}
                        />
                        <input
                          type="text"
                          value={section.description}
                          onChange={(e) =>
                            updateSection(
                              section.id,
                              "description",
                              e.target.value
                            )
                          }
                          className={`border-0 bg-transparent text-sm text-gray-500 w-full focus:outline-none ${
                            isCategorySelected
                              ? "text-gray-400 cursor-not-allowed"
                              : ""
                          }`}
                          placeholder="Section Description"
                          readOnly={isCategorySelected}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Section Content */}
                  {section.expanded && (
                    <div className="p-4 space-y-4 bg-gray-50">
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-2 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-2">
                            <label className="flex-shrink-0">
                              <div className="w-12 h-12 border-2 border-dashed border-gray-300 bg-gray-50 rounded flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt="Item"
                                    className="w-full h-full object-cover rounded"
                                  />
                                ) : (
                                  <Upload className="w-4 h-4 text-purple-600" />
                                )}
                                <input
                                  type="file"
                                  accept="image/png,image/jpg,image/jpeg"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleItemImageChange(
                                      section.id,
                                      item.id,
                                      e
                                    )
                                  }
                                />
                              </div>
                            </label>
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) =>
                                  updateItem(
                                    section.id,
                                    item.id,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="border-0 bg-transparent font-semibold text-sm w-full focus:outline-none"
                                placeholder="Item Title"
                              />
                              <input
                                type="text"
                                value={item.desc}
                                onChange={(e) =>
                                  updateItem(
                                    section.id,
                                    item.id,
                                    "desc",
                                    e.target.value
                                  )
                                }
                                className="border-0 bg-transparent text-sm text-gray-500 w-full focus:outline-none"
                                placeholder="Item Description"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-4 ml-14">
                            <div className="flex-1">
                              <label className="block text-xs text-gray-500 mb-1">
                                Calories *
                              </label>
                              <input
                                type="number"
                                value={item.calories}
                                onChange={(e) =>
                                  updateItem(
                                    section.id,
                                    item.id,
                                    "calories",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                min="0"
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="0"
                                required
                              />
                            </div>
                            <div className="w-28 flex-shrink-0">
                              <label className="block text-xs text-gray-500 mb-1">
                                Price
                              </label>
                              <div className="flex rounded overflow-hidden border border-gray-300">
                                <span className="bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700 flex items-center">
                                  Tk
                                </span>
                                <input
                                  type="number"
                                  value={item.price}
                                  onChange={(e) =>
                                    updateItem(
                                      section.id,
                                      item.id,
                                      "price",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  min="0"
                                  step="0.01"
                                  className="border-0 px-2 py-1 w-full focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addItemToSection(section.id)}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium ml-14"
                      >
                        <Plus className="w-4 h-4" />
                        Add Item
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleNext}
                disabled={
                  loading || sections.flatMap((s) => s.items).length === 0
                }
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="flex-shrink-0 w-[30%] p-4">
          <div
            className="bg-white rounded-t-3xl border border-gray-300 shadow-lg overflow-hidden"
            
          >
            {/* Phone Header */}
            <div className="bg-purple-500 text-white h-10 flex items-center justify-between px-3 sticky top-0 z-10">
              <span className="text-xs font-mono">02:31</span>
              <div className="flex items-center gap-1">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-4 h-4" />
                <Battery className="w-5 h-5" />
              </div>
            </div>

            {/* App Content */}
            <div
              className="overflow-y-auto"
              style={{ height: "calc(594px - 40px)" }}
            >
              {/* App Header */}
              <div className="bg-purple-500 px-3.5 py-2.5 flex items-center justify-between">
                <div className="w-5 h-5 bg-transparent"></div>
                <span className="text-white text-xs font-bold">zaman</span>
                <Menu className="w-5 h-5 text-white" />
              </div>

              {/* Page Title */}
              <div className="flex items-center justify-center bg-white py-7 px-5">
                <span className="text-gray-900 text-base font-bold">Menu</span>
              </div>

              {/* Search Bar */}
              <div className="flex items-center px-3.5 gap-3.5 bg-white">
                <div className="flex-1 flex items-center px-2.5 py-1.5 border border-purple-900/10 rounded-full">
                  <Search className="w-4 h-4 text-purple-900/50 mr-2" />
                  <span className="text-purple-900/50 text-xs">Search</span>
                </div>
                <MessageCircle className="w-5 h-5 text-gray-900" />
              </div>

              {/* Section Tabs */}
              <div className="flex px-3.5 py-3.5 gap-1.5 overflow-x-auto bg-white">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`px-3.5 py-1.5 rounded text-xs font-bold whitespace-nowrap flex-shrink-0 cursor-pointer transition-colors ${
                      index === 0
                        ? "bg-purple-500 text-white"
                        : "bg-white text-purple-500 border border-purple-900/10 hover:bg-purple-50"
                    }`}
                  >
                    {section.title}
                  </div>
                ))}
              </div>

              {/* Sections Content */}
              <div className="space-y-3.5 px-0">
                {sections.map((section) => (
                  <div key={section.id} className="w-full space-y-3.5">
                    {/* Section Banner */}
                    <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                      {section.image ? (
                        <img
                          src={section.image}
                          alt="Section"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z" />
                          <path d="m10 14-1-1-3 4h12l-5-7z" />
                        </svg>
                      )}
                    </div>

                    {/* Section Title & Description */}
                    <div className="text-center space-y-1">
                      <h3 className="text-base font-bold text-gray-900">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>

                    {/* Items */}
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="w-full p-2.5 pl-3.5 bg-white rounded shadow-sm border border-gray-100"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt="Item"
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <svg
                                className="w-8 h-8 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z" />
                                <path d="m10 14-1-1-3 4h12l-5-7z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 space-y-1.5 pt-1">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                            <p className="text-sm font-semibold text-purple-600">
                              ৳{item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Modals */}
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
        inCart={!!selectedItem && cartIds.includes(selectedItem._id)}
        toggleCart={toggleCart}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Delete Menu Item?
              </h2>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedDeleteId(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="text-gray-600 mb-6">
              <p className="text-sm">
                This action cannot be undone. The item "
                {items.find((i) => i._id === selectedDeleteId)?.item_name}" will
                be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedDeleteId(null);
                }}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      <AddCategoryModal
        open={openAddCategory}
        onClose={() => setOpenAddCategory(false)}
        onCategoryAdded={refreshCategories}
      />

      {openAddMenu && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-70 animate-fadeIn"
          onClick={() => setOpenAddMenu(false)}
        >
          <div
            className="bg-white rounded-2xl w-11/12 mx-auto shadow-2xl p-6 relative overflow-y-auto max-h-[90vh] custom-scrollbar animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Add New Menu Item
            </h2>
            <form className="space-y-5" onSubmit={handleSubmitMenu}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={menuForm.category}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded"
                    required
                  >
                    <option value="">Select Category</option>
                    {allCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="item_name"
                    value={menuForm.item_name}
                    onChange={handleInputChange}
                    placeholder="Item Name"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 transition-all"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={menuForm.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Calories <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={menuForm.calories}
                    onChange={handleInputChange}
                    placeholder="Calories"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Short Description
                </label>
                <textarea
                  name="short_description"
                  value={menuForm.short_description}
                  onChange={handleInputChange}
                  placeholder="Describe the menu item"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 transition-all resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Ingredients (comma-separated)
                </label>
                <input
                  type="text"
                  name="ingredients"
                  value={menuForm.ingredients}
                  onChange={handleInputChange}
                  placeholder="e.g., tomato, cheese, basil"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Upload Images (Max 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none"
                />
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {imagePreviews.map((src, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                      >
                        <img
                          src={src}
                          alt={`preview-${i}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setOpenAddMenu(false)}
                  className="px-5 py-2 rounded-xl bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-xl bg-[#E6034B] text-white font-semibold hover:bg-[#c30c46] transition-all shadow-md flex items-center gap-2 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  Add Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleUp {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-scaleUp {
          animation: scaleUp 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </>
  );
};

export default MyMenu;
