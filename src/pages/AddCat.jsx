import React, { useEffect, useState } from "react";
import {
  Plus,
  Folder,
  FolderOpen,
  Tag,
  X,
  Edit2,
  Check,
  Trash,
} from "lucide-react";
import {
  addCategoryApi,
  addSubCategoryApi,
  deleteSubCategoryApi,
  getAllCategoriesApi,
  getSubCategoriesByCategoryIdApi,
  updateSubCategoryApi,
} from "../api/documentManagemnet.api";

const AddCat = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newSubCategory, setNewSubCategory] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingSubAdd, setLoadingSubAdd] = useState(false);

  /// add caotegory

  // const addCategory = () => {
  //     try {

  //     } catch (error) {
  //         console.error("Error adding category:", error);

  //     }
  // }
  // replaces your current addCategory

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoriesApi();
        if (res.success && Array.isArray(res.data)) {
          const withSubs = res.data.map((cat) => ({
            id: cat._id,
            name: cat.name,
            subCategories: [], // initialize with empty array
          }));
          setCategories(withSubs);
        } else {
          alert("Failed to load categories");
        }
      } catch (err) {
        alert("Error loading categories");
      }
    };

    fetchCategories();
  }, []);

  const addCategory = async () => {
    const name = newCategory.trim();
    if (!name || loadingAdd) return;

    setLoadingAdd(true);
    try {
      const res = await addCategoryApi({ name }); // backend will lowercase
      if (res?.success) {
        const saved = res.data; // Mongo doc from server
        setCategories((prev) => [
          ...prev,
          { id: saved._id, name: saved.name, subCategories: [] },
        ]);
        setNewCategory("");
      } else {
        alert(res?.message || "Error while creating Category");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoadingAdd(false);
    }
  };

  const addSubCategory = async () => {
    if (!newSubCategory.trim() || !selectedCategory || loadingSubAdd) return;

    setLoadingSubAdd(true);
    try {
      const res = await addSubCategoryApi({
        name: newSubCategory.trim(),
        categoryId: selectedCategory.id,
      });

      if (res?.success) {
        const saved = res.data;
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === selectedCategory.id
              ? {
                  ...cat,
                  subCategories: [
                    ...cat.subCategories,
                    { id: saved._id, name: saved.name },
                  ],
                }
              : cat
          )
        );
        setNewSubCategory("");
        setExpandedCategories(
          new Set([...expandedCategories, selectedCategory.id])
        );
      } else {
        alert(res?.message || "Error while creating Subcategory");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoadingSubAdd(false);
    }
  };

  const toggleCategory = async (categoryId) => {
    try {
      const res = await getSubCategoriesByCategoryIdApi(categoryId);

      if (res?.success && Array.isArray(res.data)) {
        const subCategories = res.data
          .filter((sub) => !sub.isCustom)
          .map((sub) => ({
            id: sub._id,
            name: sub.name,
          }));

        // Update subcategories for that category
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === categoryId ? { ...cat, subCategories } : cat
          )
        );

        // Toggle expanded/collapsed state
        setExpandedCategories((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(categoryId)) {
            newSet.delete(categoryId);
          } else {
            newSet.add(categoryId);
          }
          return newSet;
        });
      } else {
        alert("Failed to load subcategories");
      }
    } catch (error) {
      alert("Error loading subcategories");
      console.error("Error loading subcategories:", error);
    }
  };

  const deleteCategory = (categoryId) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId));
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null);
    }
  };

  const deleteSubCategory = async (categoryId, subCategoryId) => {
    try {
      const res = await deleteSubCategoryApi(subCategoryId);

      if (res.success) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  subCategories: cat.subCategories.filter(
                    (sub) => sub.id !== subCategoryId
                  ),
                }
              : cat
          )
        );
      } else {
        alert(res.message || "Failed to delete subcategory");
      }
    } catch (error) {
      alert("Error deleting subcategory");
      console.error("Delete error:", error);
    }
  };

  const startEditingCategory = (category) => {
    setEditingCategory(category.id);
    setEditValue(category.name);
  };

  const startEditingSubCategory = (categoryId, subCategory) => {
    setEditingSubCategory(`${categoryId}-${subCategory.id}`);
    setEditValue(subCategory.name);
  };

  const saveEdit = async () => {
    if (editingSubCategory) {
      const [categoryId, subCategoryId] = editingSubCategory.split("-");
      try {
        const res = await updateSubCategoryApi({
          id: subCategoryId,
          name: editValue.trim(),
        });

        if (res.success) {
          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === categoryId
                ? {
                    ...cat,
                    subCategories: cat.subCategories.map((sub) =>
                      sub.id === subCategoryId
                        ? { ...sub, name: res.data.name }
                        : sub
                    ),
                  }
                : cat
            )
          );
          setEditingSubCategory(null);
          setEditValue("");
        } else {
          alert(res.message || "Failed to update subcategory");
        }
      } catch (error) {
        alert("Error updating subcategory");
        console.error("Update error:", error);
      }
    } else if (editingSubCategory) {
      const [categoryId, subCategoryId] = editingSubCategory
        .split("-")
        .map(Number);
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                subCategories: cat.subCategories.map((sub) =>
                  sub.id === subCategoryId
                    ? { ...sub, name: editValue.trim() }
                    : sub
                ),
              }
            : cat
        )
      );
      setEditingSubCategory(null);
    }
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingSubCategory(null);
    setEditValue("");
  };

  return (
    <div className="p-7.5 pt-[86px] w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Document Management
          </h1>
          <p className="text-gray-600">
            Organize your content with Documents and Documents Type
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add Category Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full mr-4">
                <Folder className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Add Document Category
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Category
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter Document Category..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    onKeyDown={(e) => e.key === "Enter" && addCategory()}
                  />

                  <button
                    onClick={addCategory}
                    disabled={!newCategory.trim() || loadingAdd}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {loadingAdd ? (
                      "Saving..."
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Subcategory Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-full mr-4">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Add Document Type
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category Type
                </label>
                <select
                  value={selectedCategory?.id || ""}
                  onChange={(e) => {
                    const category = categories.find(
                      (cat) => cat.id === e.target.value // ✅ compare strings
                    );
                    setSelectedCategory(category || null);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Choose a Document...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type Name
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    placeholder="Enter Document..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    onKeyDown={(e) => e.key === "Enter" && addSubCategory()}
                    disabled={!selectedCategory || loadingSubAdd}
                  />

                  <button
                    onClick={addSubCategory}
                    disabled={
                      !newSubCategory.trim() ||
                      !selectedCategory ||
                      loadingSubAdd
                    }
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {loadingSubAdd ? (
                      "Saving..."
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full mr-3">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            Document Overview
          </h2>

          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Folder className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">
                No document yet. Start by adding your first document!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories?.map((category) => (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center">
                      {expandedCategories.has(category.id) ? (
                        <FolderOpen className="w-5 h-5 text-blue-500 mr-3" />
                      ) : (
                        <Folder className="w-5 h-5 text-gray-500 mr-3" />
                      )}
                      {editingCategory === category.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-lg font-medium"
                            onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                            autoFocus
                          />
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-lg font-medium text-gray-800">
                          {category?.name}
                        </span>
                      )}
                      {/* <span className="ml-3 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {category?.subCategories.length} subcategories
                      </span> */}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingCategory(category);
                        }}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button> */}
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCategory(category.id);
                        }}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button> */}
                    </div>
                  </div>

                  {expandedCategories.has(category.id) && (
                    <div className="bg-white">
                      {category.subCategories.length === 0 ? (
                        <div className="p-4 text-gray-500 italic">
                          No document type yet. Add some above!
                        </div>
                      ) : (
                        <div className="p-4 space-y-2">
                          {category?.subCategories.map((subCategory) => (
                            <div
                              key={subCategory.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center">
                                <Tag className="w-4 h-4 text-green-500 mr-3" />
                                {editingSubCategory ===
                                `${category.id}-${subCategory.id}` ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={editValue}
                                      onChange={(e) =>
                                        setEditValue(e.target.value)
                                      }
                                      className="px-2 py-1 border border-gray-300 rounded"
                                      onKeyPress={(e) =>
                                        e.key === "Enter" && saveEdit()
                                      }
                                      autoFocus
                                    />
                                    <button
                                      onClick={saveEdit}
                                      className="text-green-600 hover:text-green-800"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={cancelEdit}
                                      className="text-gray-600 hover:text-gray-800"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-gray-700">
                                    {subCategory.name}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    startEditingSubCategory(
                                      category.id,
                                      subCategory
                                    )
                                  }
                                  className="text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteSubCategory(
                                      category.id,
                                      subCategory.id
                                    )
                                  }
                                  className="text-gray-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCat;
