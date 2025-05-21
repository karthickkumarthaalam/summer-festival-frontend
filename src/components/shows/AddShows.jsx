import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { apiCall } from "../../utils/apiCall";
import { toast } from "react-toastify";

const AddShowModal = ({ isOpen, onClose, editShowData, onSuccess }) => {
  const [form, setForm] = useState({
    time: "",
    period: "AM",
    title: "",
    description: "",
    location: "",
    lineup_id: "",
  });

  const [errors, setErrors] = useState({});
  const [lineups, setLineups] = useState([]);
  const timeRef = useRef();

  useEffect(() => {
    if (isOpen) {
      fetchLineups();
      resetForm();
      if (editShowData) populateForm(editShowData);
    }
  }, [isOpen, editShowData]);

  const fetchLineups = async () => {
    try {
      const response = await apiCall("/showlineup", "GET");
      setLineups(response.data.data || []);
    } catch (error) {
      toast.error("Failed to load show lineups");
    }
  };

  const resetForm = () => {
    setForm({
      time: "",
      period: "AM",
      title: "",
      description: "",
      location: "",
      lineup_id: "",
    });
    setErrors({});
  };

  const populateForm = (data) => {
    const [parsedTime, parsedPeriod] = splitTimeWithPeriod(data.time || "");
    setForm({
      time: parsedTime,
      period: parsedPeriod || "AM",
      title: data.title || "",
      description: data.description || "",
      location: data.location || "",
      lineup_id: data.lineup_id || "",
    });
  };

  const splitTimeWithPeriod = (timeStr) => {
    // e.g., "08:30 AM" → ["08:30", "AM"]
    const match = timeStr.match(/^(\d{2}:\d{2})\s?(AM|PM)?$/i);
    return match ? [match[1], match[2]?.toUpperCase()] : [timeStr, "AM"];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.time) newErrors.time = "Show time is required.";
    if (!form.title) newErrors.title = "Title is required.";
    if (!form.lineup_id) newErrors.lineup_id = "Lineup selection is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const fullTime = `${form.time} ${form.period}`;

    try {
      const payload = {
        ...form,
        time: fullTime,
      };

      if (editShowData) {
        await apiCall(`/shows/${editShowData.id}`, "PUT", payload);
        toast.success("Show updated successfully!");
      } else {
        await apiCall("/shows", "POST", payload);
        toast.success("Show created successfully!");
      }

      onSuccess();
    } catch (error) {
      toast.error("Failed to save show");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-primary-600">
          {editShowData ? "Edit Show" : "Add Show"}
        </h2>

        <div className="space-y-4">
          {/* Time */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">Time</label>
            <div className="flex gap-2">
              {/* Hours */}
              <select
                name="timeHour"
                value={form.time.split(":")[0]}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "time",
                      value: `${e.target.value}:${
                        form.time.split(":")[1] || "00"
                      }`,
                    },
                  })
                }
                className="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="">HH</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const hour = String(i + 1).padStart(2, "0");
                  return (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  );
                })}
              </select>

              {/* Minutes */}
              <select
                name="timeMinute"
                value={form.time.split(":")[1] || ""}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "time",
                      value: `${form.time.split(":")[0] || "01"}:${
                        e.target.value
                      }`,
                    },
                  })
                }
                className="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="">MM</option>
                {Array.from({ length: 60 }, (_, i) => {
                  const minute = String(i).padStart(2, "0");
                  return (
                    <option key={minute} value={minute}>
                      {minute}
                    </option>
                  );
                })}
              </select>

              {/* AM/PM */}
              <select
                name="period"
                value={form.period}
                onChange={handleChange}
                className="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            {errors.time && (
              <p className="text-sm text-red-500">{errors.time}</p>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Show Title"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Show Description"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Venue or Address"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          {/* Show Lineup Dropdown */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sm">
              Select Show Lineup
            </label>
            <select
              name="lineup_id"
              value={form.lineup_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="">Select Lineup Date</option>
              {lineups.map((lineup) => (
                <option key={lineup.id} value={lineup.id}>
                  {new Date(lineup.date).toLocaleDateString()}
                </option>
              ))}
            </select>
            {errors.lineup_id && (
              <p className="text-sm text-red-500">{errors.lineup_id}</p>
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
            {editShowData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddShowModal;
