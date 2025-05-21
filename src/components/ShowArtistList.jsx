import { useEffect, useState } from "react";
import { apiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import BreadCrumb from "../components/BreadCrumb";
import {
  BadgePlus,
  Search,
  Loader2,
  Trash2,
  ScanEye,
  Edit2,
} from "lucide-react";
import CopyrightFooter from "../components/CoyprightFooter";
import AddShowArtist from "./showArtist/AddShowArtist";

const ShowArtistList = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editArtistId, setEditArtistId] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const pageSize = 20;

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchArtists = async () => {
    try {
      const response = await apiCall(
        `/show-artist?page=${currentPage}&search=${searchQuery}`,
        "GET"
      );
      setArtists(response.data.data);
      setTotalRecords(response.data.pagination.totalRecords);
    } catch (error) {
      toast.error("Failed to fetch show artists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, [currentPage, searchQuery]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artist?")) return;
    setLoading(true);
    try {
      await apiCall(`/show-artist/${id}`, "DELETE");
      fetchArtists();
      toast.success("Artist deleted");
    } catch (error) {
      toast.error("Failed to delete artist");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setShowModal(true);
    setSelectedArtist(null);
    setEditArtistId(null);
  };

  const handleEdit = (artist) => {
    setEditArtistId(artist.id);
    setSelectedArtist(artist);
    setShowModal(true);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
      <BreadCrumb title="Show Artists" paths={["Programs", "Show Artists"]} />

      <div className="mt-4 rounded-sm shadow-md px-6 py-4 mx-4 bg-white flex-1">
        <div className="flex justify-between items-center border-b border-dashed pb-3">
          <p className="text-lg font-semibold text-gray-800">
            Show Artist List
          </p>
          <button
            onClick={handleAdd}
            className="rounded-md bg-primary-500 text-sm text-white px-4 py-2 flex items-center gap-2 hover:bg-primary-600"
          >
            <BadgePlus size={16} />
            Add Shows
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center sm:justify-end mt-4">
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by artist name..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md px-8 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary-500" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-primary-100 text-left text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">SI</th>
                  <th className="px-4 py-2 border">Image</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Role</th>
                  <th className="px-4 py-2 border">Show Title</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {artists.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No Show Artists Available
                    </td>
                  </tr>
                ) : (
                  artists.map((artist, index) => (
                    <tr key={artist.id}>
                      <td className="px-4 py-2 border">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-2 border">
                        {artist.image ? (
                          <img
                            src={`${BASE_URL}/${artist.image?.replace(
                              /\\/g,
                              "/"
                            )}`}
                            alt={artist.name}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </td>
                      <td className="px-4 py-2 border">{artist.name}</td>
                      <td className="px-4 py-2 border">{artist.role || "-"}</td>
                      <td className="px-4 py-2 border">
                        {artist.Show?.title || "-"}
                      </td>
                      <td className="px-4 py-2 border">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => handleEdit(artist)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(artist.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="text-sm px-3 py-1.5 rounded border hover:bg-gray-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="text-sm px-3 py-1.5 rounded border hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <AddShowArtist
        isOpen={showModal}
        editShowArtistData={selectedArtist}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          fetchArtists();
          setShowModal(false);
        }}
      />

      <CopyrightFooter />
    </div>
  );
};

export default ShowArtistList;
