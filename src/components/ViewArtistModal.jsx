const ViewArtistModal = ({ isOpen, onClose, artistData }) => {
  if (!isOpen) return null;
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99]">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-dashed pb-2 border-gray-300">
          <h2 className="text-xl font-semibold text-primary-600">
            Artist Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl font-bold focus:outline-none"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <span className="font-semibold">Name:</span>{" "}
              {artistData.artist_name}
            </div>
            <div>
              <span className="font-semibold">Role:</span> {artistData.role}
            </div>
            <div>
              <span className="font-semibold">Description:</span>
              <p className="mt-1 text-gray-600 text-sm">
                {artistData.description}
              </p>
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  artistData.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {artistData.status}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            {artistData.image ? (
              <img
                src={`${BASE_URL}/${artistData.image.replace(/\\/g, "/")}`}
                alt="Artist"
                className="w-56 h-56 object-cover rounded-xl shadow"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl">
                No Image
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-700 space-y-2 border-t pt-4 border-dashed border-gray-300">
          <h3 className="font-semibold text-base mb-2">Social Links</h3>
          {[
            { label: "Facebook", value: artistData.facebook_url },
            { label: "Instagram", value: artistData.instagram_url },
            { label: "Pinterest", value: artistData.pinterest_url },
            { label: "Twitter", value: artistData.twitter_url },
            { label: "LinkedIn", value: artistData.linkedin_url },
          ].map((item, idx) => (
            <div key={idx}>
              <span className="font-medium">{item.label}:</span>{" "}
              {item.value ? (
                <a
                  href={item.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {item.value}
                </a>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </div>
          ))}
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

export default ViewArtistModal;
