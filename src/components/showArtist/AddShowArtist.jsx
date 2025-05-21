import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiCall } from "../../utils/apiCall";
import { toast } from "react-toastify";

const AddShowArtist = ({ isOpen, onClose, editShowArtistData, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    role: "",
    image: null,
    website_url: "",
    instagram_url: "",
    facebook_url: "",
    other_url: "",
    show_id: "",
  });

  const [shows, setShows] = useState([]);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (isOpen) {
      resetForm();
      fetchShows();
      if (editShowArtistData) populateForm(editShowArtistData);
    }
  }, [isOpen, editShowArtistData]);

  const fetchShows = async () => {
    try {
      const res = await apiCall("/shows", "GET");
      setShows(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch shows");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      role: "",
      image: null,
      website_url: "",
      instagram_url: "",
      facebook_url: "",
      other_url: "",
      show_id: "",
    });
    setErrors({});
    setPreview(null);
  };

  const populateForm = (data) => {
    setForm({
      name: data.name || "",
      role: data.role || "",
      image: null,
      website_url: data.website_url || "",
      instagram_url: data.instagram_url || "",
      facebook_url: data.facebook_url || "",
      other_url: data.other_url || "",
      show_id: data.show_id || "",
    });
    setPreview(`${BASE_URL}/${data.image?.replace(/\\/g, "/")}` || null);
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
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.show_id) newErrors.show_id = "Show is required.";
    if (!editShowArtistData && !form.image)
      newErrors.image = "Image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("role", form.role);
      if (form.image) formData.append("image", form.image);
      formData.append("website_url", form.website_url);
      formData.append("instagram_url", form.instagram_url);
      formData.append("facebook_url", form.facebook_url);
      formData.append("other_url", form.other_url);
      formData.append("show_id", form.show_id);

      if (editShowArtistData) {
        await apiCall(
          `/show-artist/${editShowArtistData.id}`,
          "PUT",
          formData,
          {
            "Content-Type": "multipart/form-data",
          }
        );
        toast.success("Show Artist updated successfully!");
      } else {
        await apiCall("/show-artist", "POST", formData, {
          "Content-Type": "multipart/form-data",
        });
        toast.success("Show Artist created successfully!");
      }

      onSuccess();
    } catch (error) {
      toast.error("Failed to save show artist");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative overflow-auto max-h-[90vh] sm:max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-primary-600">
          {editShowArtistData ? "Edit Show Artist" : "Add Show Artist"}
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="Artist Name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">Role</label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="Role (optional)"
            />
          </div>

          {/* Image */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">Artist Image</label>
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

          {/* Show Select */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">Show</label>
            <select
              name="show_id"
              value={form.show_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="">Select Show</option>
              {shows.map((show) => (
                <option key={show.id} value={show.id}>
                  {show.title}
                </option>
              ))}
            </select>
            {errors.show_id && (
              <p className="text-sm text-red-500">{errors.show_id}</p>
            )}
          </div>

          {/* Social + Website URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["website_url", "instagram_url", "facebook_url", "other_url"].map(
              (field) => (
                <div className="flex flex-col" key={field}>
                  <label className="font-medium mb-1 text-sm capitalize">
                    {field.replace("_url", "")} URL
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder="https://"
                    className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
              )
            )}
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
            {editShowArtistData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddShowArtist;
