import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Upload,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { productAPI, Product, ProductSpecification } from "../../apis/product";
import { useShop } from "../../context/ShopContext";

const AdminProducts: React.FC = () => {
  const { refreshProducts } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({ isOpen: false, productId: "", productName: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialFormState: Partial<Product> = {
    name: "",
    category: "",
    price: 0,
    originalPrice: 0,
    image: "",
    rating: 5,
    tags: [],
    stock: 10,
    weight: 1,
    description: "",
    specifications: [],
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);
  const [specifications, setSpecifications] = useState<ProductSpecification[]>(
    [],
  );

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data);
        // Extract unique categories from products
        const uniqueCategories = Array.from(
          new Set(response.data.map((p) => p.category).filter(Boolean)),
        );
        setExistingCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
      setImagePreview(product.image);
      setUploadMethod("url");
      setSpecifications(product.specifications || []);
    } else {
      setEditingProduct(null);
      setFormData(initialFormState);
      setImagePreview("");
      setSelectedFile(null);
      setUploadMethod("file");
      setSpecifications([]);
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.price) return;
    if (uploadMethod === "file" && !selectedFile && !editingProduct) {
      toast.error("Please select an image file");
      return;
    }
    if (uploadMethod === "url" && !formData.image) {
      toast.error("Please provide an image URL");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Update existing product
        const id = editingProduct._id || editingProduct.id;
        if (!id) return;

        if (uploadMethod === "file" && selectedFile) {
          // Update with file upload
          const formDataToSend = new FormData();
          formDataToSend.append("name", formData.name);
          formDataToSend.append("category", formData.category || "");
          formDataToSend.append("price", String(formData.price));
          if (formData.originalPrice)
            formDataToSend.append(
              "originalPrice",
              String(formData.originalPrice),
            );
          if (formData.rating)
            formDataToSend.append("rating", String(formData.rating));
          if (formData.tags)
            formDataToSend.append("tags", formData.tags.join(","));
          if (formData.stock !== undefined)
            formDataToSend.append("stock", String(formData.stock));
          if (formData.weight !== undefined)
            formDataToSend.append("weight", String(formData.weight));
          if (formData.description)
            formDataToSend.append("description", formData.description);
          if (specifications.length > 0)
            formDataToSend.append(
              "specifications",
              JSON.stringify(specifications),
            );
          formDataToSend.append("image", selectedFile);

          const response = await productAPI.update(id, formDataToSend);
          if (response.success) {
            toast.success("Product updated successfully!", {
              icon: "✅",
            });
            fetchProducts();
            refreshProducts();
            setIsModalOpen(false);
          }
        } else {
          // Update with URL
          const response = await productAPI.updateWithUrl(id, {
            ...formData,
            specifications,
          });
          if (response.success) {
            toast.success("Product updated successfully!", {
              icon: "✅",
            });
            fetchProducts();
            refreshProducts();
            setIsModalOpen(false);
          }
        }
      } else {
        // Create new product
        if (uploadMethod === "file" && selectedFile) {
          // Create with file upload
          const formDataToSend = new FormData();
          formDataToSend.append("name", formData.name);
          formDataToSend.append("category", formData.category || "");
          formDataToSend.append("price", String(formData.price));
          if (formData.originalPrice)
            formDataToSend.append(
              "originalPrice",
              String(formData.originalPrice),
            );
          if (formData.rating)
            formDataToSend.append("rating", String(formData.rating));
          if (formData.tags)
            formDataToSend.append("tags", formData.tags.join(","));
          if (formData.stock !== undefined)
            formDataToSend.append("stock", String(formData.stock));
          if (formData.weight !== undefined)
            formDataToSend.append("weight", String(formData.weight));
          if (formData.description)
            formDataToSend.append("description", formData.description);
          if (specifications.length > 0)
            formDataToSend.append(
              "specifications",
              JSON.stringify(specifications),
            );
          formDataToSend.append("image", selectedFile);

          const response = await productAPI.create(formDataToSend);
          if (response.success) {
            toast.success("Product created successfully!", {
              icon: "🎉",
            });
            fetchProducts();
            refreshProducts();
            setIsModalOpen(false);
          }
        } else {
          // Create with URL
          const response = await productAPI.createWithUrl({
            ...formData,
            specifications,
          });
          if (response.success) {
            toast.success("Product created successfully!", {
              icon: "🎉",
            });
            fetchProducts();
            refreshProducts();
            setIsModalOpen(false);
          }
        }
      }
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || "Failed to save product", {
        icon: "❌",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await productAPI.delete(id);
      if (response.success) {
        toast.success("Product deleted successfully!", {
          icon: "🗑️",
        });
        fetchProducts();
        refreshProducts();
        setDeleteConfirm({ isOpen: false, productId: "", productName: "" });
      }
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteConfirm = (product: Product) => {
    setDeleteConfirm({
      isOpen: true,
      productId: product._id || product.id || "",
      productName: product.name,
    });
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        aria-label="Notifications"
      />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Manage Products
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading products...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Products Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first product to the inventory.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold inline-flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} /> Add First Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr
                    key={product._id || product.id}
                    className="hover:bg-gray-50/50"
                  >
                    <td className="p-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-900 max-w-xs truncate">
                      {product.name}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {product.category}
                    </td>
                    <td className="p-4 text-sm font-mono text-blue-600">
                      PKR {product.price.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          (product.stock || 0) === 0
                            ? "bg-red-100 text-red-700"
                            : (product.stock || 0) <= 5
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.stock || 0}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(product)}
                          className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 overflow-y-auto space-y-4"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Price (PKR)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.weight || 1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weight: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  list="category-suggestions"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Type or select a category"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <datalist id="category-suggestions">
                  {existingCategories.map((cat, index) => (
                    <option key={index} value={cat} />
                  ))}
                </datalist>
                <p className="text-xs text-gray-500 mt-1">
                  Type a new category or select from existing ones
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product Image
                </label>

                {/* Upload Method Toggle */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setUploadMethod("file")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      uploadMethod === "file"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Upload size={16} className="inline mr-2" />
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod("url")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      uploadMethod === "url"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <ImageIcon size={16} className="inline mr-2" />
                    Image URL
                  </button>
                </div>

                {uploadMethod === "file" ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    />
                    {imagePreview && (
                      <div className="mt-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={20} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value
                        .split(",")
                        .map((t) => {
                          const trimmed = t.trim();
                          return trimmed
                            ? trimmed.charAt(0).toUpperCase() +
                                trimmed.slice(1).toLowerCase()
                            : "";
                        })
                        .filter(Boolean),
                    })
                  }
                  placeholder="Hot, Sale, New"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter product description..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              {/* Specifications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Specifications (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSpecifications([
                        ...specifications,
                        { key: "", value: "" },
                      ])
                    }
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <PlusCircle size={14} /> Add Spec
                  </button>
                </div>
                {specifications.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={spec.key}
                          onChange={(e) => {
                            const newSpecs = [...specifications];
                            newSpecs[index].key = e.target.value;
                            setSpecifications(newSpecs);
                          }}
                          placeholder="e.g., Print Speed"
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const newSpecs = [...specifications];
                            newSpecs[index].value = e.target.value;
                            setSpecifications(newSpecs);
                          }}
                          placeholder="e.g., 40 ppm"
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSpecifications(
                              specifications.filter((_, i) => i !== index),
                            );
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <MinusCircle size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    No specifications added. Click "Add Spec" to add printer
                    specifications like Print Speed, Resolution, etc.
                  </p>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {editingProduct ? "Saving..." : "Creating..."}
                    </>
                  ) : editingProduct ? (
                    "Save Changes"
                  ) : (
                    "Create Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Delete Product?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {deleteConfirm.productName}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      isOpen: false,
                      productId: "",
                      productName: "",
                    })
                  }
                  disabled={isDeleting}
                  className="flex-1 py-3 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.productId)}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
