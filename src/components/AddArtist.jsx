import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiCall } from "../utils/apiCall";
import { toast } from "react-toastify";

const AddArtistModal = ({ isOpen, onClose, editArtistData, onSuccess }) => {
  const [form, setForm] = useState({
    artist_name: "",
    description: "",
    image: null,
    language: [],
    facebook_url: "",
    instagram_url: "",
    pinterest_url: "",
    twitter_url: "",
    linkedin_url: "",
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (isOpen) {
      resetForm();
      if (editArtistData) populateForm(editArtistData);
    }
  }, [isOpen, editArtistData]);

  const resetForm = () => {
    setForm({
      artist_name: "",
      description: "",
      image: null,
      language: [],
      facebook_url: "",
      instagram_url: "",
      pinterest_url: "",
      twitter_url: "",
      linkedin_url: "",
    });
    setErrors({});
    setPreview(null);
  };

  const populateForm = (data) => {
    setForm({
      artist_name: data.artist_name || "",
      description: data.description || "",
      image: null,
      language: data.language || [],
      facebook_url: data.facebook_url || "",
      instagram_url: data.instagram_url || "",
      pinterest_url: data.pinterest_url || "",
      twitter_url: data.twitter_url || "",
      linkedin_url: data.linkedin_url || "",
    });
    setPreview(`${BASE_URL}/${data.image?.replace(/\\/g, "/")}` || null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckBoxChange = (e) => {
    const { value, checked } = e.target;
    const updatedLanguages = checked
      ? [...form.language, value]
      : form.language.filter((lang) => lang !== value);
    setForm({ ...form, language: updatedLanguages });
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

  const validateForm = () => {
    const newErrors = {};
    if (!form.artist_name) newErrors.artist_name = "Artist name is required.";
    if (!form.description) newErrors.description = "Description is required.";
    if (!editArtistData && !form.image) newErrors.image = "Image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("artist_name", form.artist_name);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);
      formData.append("language", JSON.stringify(form.language));
      formData.append("facebook_url", form.facebook_url);
      formData.append("instagram_url", form.instagram_url);
      formData.append("pinterest_url", form.pinterest_url);
      formData.append("twitter_url", form.twitter_url);
      formData.append("linkedin_url", form.linkedin_url);

      if (editArtistData) {
        await apiCall(`/artist/${editArtistData.id}`, "PUT", formData, {
          "Content-Type": "multipart/form-data",
        });
        toast.success("Artist updated successfully!");
      } else {
        await apiCall("/artist", "POST", formData, {
          "Content-Type": "multipart/form-data",
        });
        toast.success("Artist created successfully!");
      }

      onSuccess();
    } catch (error) {
      toast.error("Failed to save artist");
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
          {editArtistData ? "Edit Artist" : "Add Artist"}
        </h2>

        <div className="space-y-4">
          {/* Artist Name */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">Artist Name</label>
            <input
              type="text"
              name="artist_name"
              value={form.artist_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="Artist Name"
            />
            {errors.artist_name && (
              <p className="text-sm text-red-500">{errors.artist_name}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="Description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
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

          {/* Social URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "facebook_url",
              "instagram_url",
              "pinterest_url",
              "twitter_url",
              "linkedin_url",
            ].map((field) => (
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
                {errors[field] && (
                  <p className="text-sm text-red-500">{errors[field]}</p>
                )}
              </div>
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
            {editArtistData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddArtistModal;
