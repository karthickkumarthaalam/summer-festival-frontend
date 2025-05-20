import React from "react";

const ViewNewsModal = ({ isOpen, onClose, newsData }) => {
  if (!isOpen) return null;
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99]">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-dashed pb-2 border-gray-300">
          <h2 className="text-xl font-semibold text-primary-600">
            News Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl font-bold focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Text Info */}
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <span className="font-semibold">Title:</span> {newsData.title}
            </div>
            <div>
              <span className="font-semibold">Category:</span>{" "}
              {newsData.category}
            </div>
            <div>
              <span className="font-semibold">Published:</span>{" "}
              {newsData.published
                ? new Date(newsData.published).toLocaleString()
                : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Author:</span> {newsData.author}
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  newsData.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {newsData.status}
              </span>
            </div>
            <div>
              <span className="font-semibold">Language:</span>{" "}
              {newsData.language && Array.isArray(newsData.language)
                ? newsData.language.join(", ")
                : "N/A"}
            </div>
          </div>

          {/* Image */}
          <div className="flex items-center justify-center">
            {newsData.image ? (
              <img
                src={`${BASE_URL}/${newsData.image.replace(/\\/g, "/")}`}
                alt="News"
                className="w-56 h-56 object-cover rounded-xl shadow"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="text-sm text-gray-700 border-t pt-4 border-dashed border-gray-300 space-y-2">
          <h3 className="font-semibold text-base mb-2">Description</h3>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: newsData.description }}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm px-5 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewNewsModal;
