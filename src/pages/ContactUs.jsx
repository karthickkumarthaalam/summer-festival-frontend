import React, { useState, useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import CopyrightFooter from "../components/CoyprightFooter";
import { toast } from "react-toastify";
import { apiCall } from "../utils/apiCall";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    address: "",
    marketing_email: "",
    ticket_enquiry_email: "",
    event_enquiry_email: "",
    linkedIn_url: "",
    facebook_url: "",
    instagram_url: "",
    pinterest_url: "",
    marketing_mobile_numbers: [""],
    enquiry_mobile_numbers: [""],
  });

  const fetchContactDetails = async () => {
    try {
      const res = await apiCall("/contactus", "GET");
      if (res.status === "success" && res.data !== null) {
        setFormData({
          ...res.data,
          marketing_mobile_numbers: res.data.marketing_mobile_numbers || [""],
          enquiry_mobile_numbers: res.data.enquiry_mobile_numbers || [""],
        });
      }
    } catch (error) {
      console.error("Error fetching contact details:", error);
    }
  };

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMobileChange = (index, type, value) => {
    const updatedNumbers = [...formData[type]];
    updatedNumbers[index] = value;
    setFormData({ ...formData, [type]: updatedNumbers });
  };

  const addMobileField = (type) => {
    setFormData({ ...formData, [type]: [...formData[type], ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiCall("/contactus", "POST", formData);
      toast.success("Contact details updated!");
    } catch (error) {
      toast.error("Failed to update contact details");
    }
  };

  return (
    <div className="overflow-y-auto">
      <BreadCrumb title="Contact Us" paths={["Contact Us Settings"]} />

      <div className="flex flex-col flex-1 px-6 py-8">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 pb-3 border-b border-gray-200 mb-6">
            Contact Us Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Address */}
            <div>
              <label className="block text-gray-800 mb-2 text-sm font-medium">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition text-gray-600"
                placeholder="Enter address"
              />
            </div>

            {/* Emails */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Marketing Email", name: "marketing_email" },
                { label: "Ticket Enquiry Email", name: "ticket_enquiry_email" },
                { label: "Event Enquiry Email", name: "event_enquiry_email" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-gray-800 mb-2 text-sm font-medium">
                    {field.label}
                  </label>
                  <input
                    type="email"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition text-gray-600"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            {/* Mobile Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "Marketing Mobile Numbers",
                  type: "marketing_mobile_numbers",
                },
                {
                  label: "Enquiry Mobile Numbers",
                  type: "enquiry_mobile_numbers",
                },
              ].map((group) => (
                <div key={group.type}>
                  <label className="block text-gray-800 mb-2 text-sm font-medium">
                    {group.label}
                  </label>
                  {formData[group.type].map((number, index) => (
                    <div className="relative mb-3" key={index}>
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800 text-sm">
                        +41
                      </span>
                      <input
                        type="text"
                        value={number}
                        onChange={(e) =>
                          handleMobileChange(index, group.type, e.target.value)
                        }
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition pl-10 pr-24 text-gray-600"
                        placeholder="Enter mobile number"
                      />
                      {/* Add Button */}
                      <button
                        type="button"
                        disabled={number === ""}
                        onClick={() => addMobileField(group.type)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 text-white px-2.5 py-1.5 rounded hover:bg-primary-600 transition"
                      >
                        +
                      </button>
                      {/* Remove Button */}
                      {formData[group.type].length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedNumbers = [...formData[group.type]];
                            updatedNumbers.splice(index, 1);
                            setFormData({
                              ...formData,
                              [group.type]: updatedNumbers,
                            });
                          }}
                          className="absolute right-12 top-1/2 -translate-y-1/2 bg-red-500 text-white px-2.5 py-1.5 rounded hover:bg-red-600 transition"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Social URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "LinkedIn URL", name: "linkedIn_url" },
                { label: "Facebook URL", name: "facebook_url" },
                { label: "Instagram URL", name: "instagram_url" },
                { label: "Pinterest URL", name: "pinterest_url" },
                { label: "Tik Tok URL", name: "tiktok_url" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-gray-800 mb-2 text-sm font-medium">
                    {field.label}
                  </label>
                  <input
                    type="url"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition text-gray-600"
                    placeholder={`Enter ${field.label}`}
                  />
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-primary-500 text-white px-6 py-3 rounded-lg shadow hover:bg-primary-600 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-auto">
        <CopyrightFooter />
      </div>
    </div>
  );
};

export default ContactUs;
