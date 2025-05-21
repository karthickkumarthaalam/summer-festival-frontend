const ViewShowLineUpModal = ({ isOpen, onClose, showLineUpData }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99]">
      <div className="bg-white rounded-xl w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh] shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-dashed pb-2 border-gray-300">
          <h2 className="text-xl font-semibold text-primary-600">
            Show Lineup Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl font-bold focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Lineup Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm text-gray-700">
          <div>
            <div className="mb-2">
              <span className="font-semibold">Show Date:</span>{" "}
              {showLineUpData.date}
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  showLineUpData.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {showLineUpData.status}
              </span>
            </div>
          </div>
          <div>
            <span className="font-semibold">Languages:</span>{" "}
            {showLineUpData.language && showLineUpData.language.length > 0 ? (
              showLineUpData.language.join(", ")
            ) : (
              <span className="text-gray-400">N/A</span>
            )}
          </div>
        </div>

        {/* Shows Table */}
        <div>
          <h3 className="text-base font-semibold text-primary-600 mb-3">
            Shows
          </h3>
          {showLineUpData.shows && showLineUpData.shows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Time
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Title
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Description
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {showLineUpData.shows.map((show, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2">
                        {show.time}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {show.title}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {show.description}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {show.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No shows available.</div>
          )}
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

export default ViewShowLineUpModal;
