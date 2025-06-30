import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiCall } from "../utils/apiCall";
import { toast } from "react-toastify";

const AddNewsModal = ({ isOpen, onClose, editNewsData, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    image: null,
    published: "",
    author: "",
    language: [],
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (isOpen) {
      resetForm();
      if (editNewsData) populateForm(editNewsData);
    }
  }, [isOpen, editNewsData]);

  const resetForm = () => {
    setForm({
      title: "",
      category: "",
      description: "",
      image: null,
      published: "",
      author: "",
      language: [],
    });
    setErrors({});
    setPreview(null);
  };

  const populateForm = (data) => {
    setForm({
      title: data.title || "",
      category: data.category || "",
      description: data.description || "",
      image: null,
      published: data.published || "",
      author: data.author || "",
      language: data.language || [],
    });
    if (data.image) setPreview(`${BASE_URL}/${data.image.replace(/\\/g, "/")}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setErrors((prev) => ({ ...prev, image: "" }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleCheckBoxChange = (e) => {
    const { value, checked } = e.target;
    const updatedLanguages = checked
      ? [...form.language, value]
      : form.language.filter((lang) => lang !== value);
    setForm({ ...form, language: updatedLanguages });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required.";
    if (!form.category) newErrors.category = "Category is required.";
    if (!form.description) newErrors.description = "Description is required.";
    if (!editNewsData && !form.image) newErrors.image = "Image is required.";
    if (!form.published) newErrors.published = "Published date is required.";
    if (!form.author) newErrors.author = "Author is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);
      formData.append("published", form.published);
      formData.append("author", form.author);
      formData.append("language", JSON.stringify(form.language));

      if (editNewsData) {
        await apiCall(`/news/${editNewsData.id}`, "PUT", formData, {
          "Content-Type": "multipart/form-data",
        });
        toast.success("News updated successfully!");
      } else {
        await apiCall("/news", "POST", formData, {
          "Content-Type": "multipart/form-data",
        });
        toast.success("News created successfully!");
      }

      onSuccess();
    } catch (error) {
      toast.error("Failed to save news");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-primary-600">
          {editNewsData ? "Edit News" : "Add News"}
        </h2>

        {/* Title */}
        <div className="flex flex-col mb-3">
          <label className="font-medium mb-1 text-sm">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col mb-3">
          <label className="font-medium mb-1 text-sm">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm"
          />
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col mb-3">
          <label className="font-medium mb-1 text-sm">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="6"
            className="border rounded px-3 py-2 text-sm"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Image */}
        <div className="flex flex-col mb-3">
          <label className="font-medium mb-1 text-sm">Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {form.image && <p className="text-sm mt-1">{form.image.name}</p>}
          {errors.image && (
            <p className="text-sm text-red-500">{errors.image}</p>
          )}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-32 object-cover rounded"
            />
          )}
        </div>

        {/* Published */}
        <div className="flex flex-col mb-3">
          <label className="font-medium mb-1 text-sm">Published Date</label>
          <input
            type="date"
            name="published"
            value={form.published}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm"
          />
          {errors.published && (
            <p className="text-sm text-red-500">{errors.published}</p>
          )}
        </div>

        {/* Author */}
        <div className="flex flex-col mb-3">
          <label className="font-medium mb-1 text-sm">Author</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm"
          />
          {errors.author && (
            <p className="text-sm text-red-500">{errors.author}</p>
          )}
        </div>

        {/* Languages */}
        <div className="flex flex-col mb-3">
          <label className="font-medium mb-1 text-sm">Languages</label>
          <div className="flex gap-4 flex-wrap">
            {["English", "Tamil", "French", "German"].map((lang) => (
              <label key={lang} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  value={lang}
                  checked={form.language.includes(lang)}
                  onChange={handleCheckBoxChange}
                />
                {lang}
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded bg-primary-500 text-white hover:bg-primary-600"
          >
            {editNewsData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewsModal;
