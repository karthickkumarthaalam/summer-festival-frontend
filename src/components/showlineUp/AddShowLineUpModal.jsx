import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { apiCall } from "../../utils/apiCall";
import { toast } from "react-toastify";

const AddShowLineUpModal = ({ isOpen, onClose, editData, onSuccess }) => {
  const [form, setForm] = useState({
    show_date: "",
    language: [],
  });

  const [errors, setErrors] = useState({});

  const dateInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      if (editData) populateForm(editData);
    }
  }, [isOpen, editData]);

  const resetForm = () => {
    setForm({
      show_date: "",
      language: [],
    });
    setErrors({});
  };

  const populateForm = (data) => {
    setForm({
      show_date: data.date || "",
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
    if (!form.show_date) newErrors.show_date = "Show date is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        date: form.show_date,
        language: form.language,
      };

      if (editData) {
        await apiCall(`/showlineup/${editData.id}`, "PUT", payload);
        toast.success("Show LineUp updated successfully!");
      } else {
        await apiCall("/showlineup", "POST", payload);
        toast.success("Show LineUp created successfully!");
      }

      onSuccess();
    } catch (error) {
      toast.error("Failed to save Show LineUp");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl w-full max-w-xl p-6 relative overflow-auto max-h-[90vh] sm:max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-primary-600">
          {editData ? "Edit Show LineUp" : "Add Show LineUp"}
        </h2>

        <div className="space-y-4">
          {/* Show Date */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">Show Date</label>
            <input
              type="date"
              ref={dateInputRef}
              name="show_date"
              value={form.show_date}
              onChange={handleChange}
              onClick={() => {
                if (dateInputRef.current.showPicker) {
                  dateInputRef.current.showPicker();
                } else {
                  dateInputRef.current.focus();
                }
              }}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            {errors.show_date && (
              <p className="text-sm text-red-500">{errors.show_date}</p>
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
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddShowLineUpModal;
