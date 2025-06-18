import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiCall } from "../utils/apiCall";
import { toast } from "react-toastify";

const AddTopEventOfferModal = ({
  isOpen,
  onClose,
  editOfferData,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    title: "",
    redirect_url: "",
    language: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      resetForm();
      if (editOfferData) populateForm(editOfferData);
    }
  }, [isOpen, editOfferData]);

  const resetForm = () => {
    setForm({
      title: "",
      redirect_url: "",
      language: [],
    });
    setErrors({});
  };

  const populateForm = (data) => {
    setForm({
      title: data.title || "",
      redirect_url: data.redirect_url || "",
      language: data.language || [],
    });
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

  const validateForm = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required.";
    if (!form.redirect_url)
      newErrors.redirect_url = "Redirect URL is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        title: form.title,
        redirect_url: form.redirect_url,
        language: form.language,
      };

      if (editOfferData) {
        await apiCall(`/top-event-offers/${editOfferData.id}`, "PUT", payload);
        toast.success("Top Event News updated successfully!");
      } else {
        await apiCall("/top-event-offers", "POST", payload);
        toast.success("Top Event News created successfully!");
      }

      onSuccess();
    } catch (error) {
      toast.error("Failed to save Top Event News");
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
          {editOfferData ? "Edit Top News" : "Add Top News"}
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm ">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="News Title"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Redirect URL */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm ">Redirect URL</label>
            <input
              type="text"
              name="redirect_url"
              value={form.redirect_url}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="https://example.com/news"
            />
            {errors.redirect_url && (
              <p className="text-sm text-red-500">{errors.redirect_url}</p>
            )}
          </div>

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
            {editOfferData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTopEventOfferModal;
