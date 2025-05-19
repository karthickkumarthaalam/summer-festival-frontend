import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiCall } from "../utils/apiCall";
import { toast } from "react-toastify";

const AddBannerModal = ({ isOpen, onClose, editBannerData, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    image: null,
    language: [],
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (isOpen) {
      resetForm();
      if (editBannerData) populateForm(editBannerData);
    }
  }, [isOpen, editBannerData]);

  const resetForm = () => {
    setForm({
      title: "",
      image: null,
      language: [],
    });
    setErrors({});
    setPreview(null);
  };

  const populateForm = (data) => {
    setForm({
      title: data.title || "",
      image: null,
      language: data.language,
    });
    setPreview(`${BASE_URL}/${data.image.replace(/\\/g, "/")}` || null);
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
    if (!editBannerData && !form.image) newErrors.image = "Image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      if (form.image) formData.append("image", form.image);
      formData.append("language", JSON.stringify(form.language));

      if (editBannerData) {
        await apiCall(`/banner/${editBannerData.id}`, "PUT", formData, {
          "Content-Type": "multipart/form-data",
        });
        toast.success("Banner updated successfully!");
      } else {
        await apiCall("/banner", "POST", formData, {
          "Content-Type": "multipart/form-data",
        });
        toast.success("Banner created successfully!");
      }

      onSuccess();
    } catch (error) {
      toast.error("Failed to save banner");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative overflow-auto max-h-[90vh] sm:max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-primary-600">
          {editBannerData ? "Edit Banner" : "Add Banner"}
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="Banner Title"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Image */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">Banner Image</label>
            <label className="relative cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-gray-50">
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
            {form.image && (
              <p className="text-sm text-gray-600 mt-1">{form.image.name}</p>
            )}
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

          {/* Languages */}
          <div className="flex flex-col">
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
            {editBannerData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBannerModal;
