import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiCall } from "../../utils/apiCall";

const ViewShowModal = ({ isOpen, onClose, showData }) => {
  const [showLineup, setShowLineUp] = useState(null);

  useEffect(() => {
    if (showData && showData.lineup_id) {
      const fetchLineup = async () => {
        try {
          const response = await apiCall(`/showlineup/${lineup_id}`, "GET");
          setShowLineUp(response.data);
        } catch (error) {
          toast.error("failed to fetch show lineup");
        }
      };

      fetchLineup();
    }
  }, [showData]);

  if (!isOpen || !showData) return null;

  const { title, description, lineup_id, location, artists } = showData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99]">
      <div className="bg-white rounded-xl w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh] shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-dashed pb-2 border-gray-300">
          <h2 className="text-xl font-semibold text-primary-600">
            Show Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl font-bold focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Show Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm text-gray-700">
          <div>
            <div className="mb-2">
              <span className="font-semibold">Title:</span> {title}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(showLineup?.date).toLocaleDateString("en-GB")}
            </div>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-semibold">Location:</span> {location}
            </div>
            <div>
              <span className="font-semibold">Description:</span> {description}
            </div>
          </div>
        </div>

        {/* Artists Table */}
        <div>
          <h3 className="text-base font-semibold text-primary-600 mb-3">
            Artists
          </h3>
          {artists && artists.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      SI
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Image
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Name
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {artists.map((artist, index) => (
                    <tr key={artist.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <img
                          src={`${
                            process.env.REACT_APP_API_BASE_URL
                          }/${artist.image?.replace(/\\/g, "/")}`}
                          alt={artist.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {artist.name}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {artist.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No artists available.</div>
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

export default ViewShowModal;
