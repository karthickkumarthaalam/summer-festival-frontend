import { useEffect, useState } from "react";
import { apiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import BreadCrumb from "../components/BreadCrumb";
import debounce from "lodash.debounce";
import {
  BadgePlus,
  Search,
  Loader2,
  Edit2,
  Trash2,
  ScanEye,
} from "lucide-react";
import CopyrightFooter from "../components/CoyprightFooter";
import AddArtist from "../components/AddArtist";
import ViewArtistModal from "../components/ViewArtistModal";

const Artist = () => {
  const [showModal, setShowModal] = useState(false);
  const [artistData, setArtistData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editArtistId, setEditArtistId] = useState(null);
  const [showArtist, setShowArtist] = useState(false);
  const pageSize = 20;
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchArtists = async () => {
    try {
      const response = await apiCall(
        `/artist?page=${currentPage}&search=${searchQuery}&language=${languageFilter}`,
        "GET"
      );
      setArtistData(response.data.data);
      setTotalRecords(response.data.pagination.totalRecords);
    } catch (error) {
      console.log("Error fetching artist data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, [currentPage, searchQuery, languageFilter]);

  const handleSearch = debounce((value) => {
    setSearchQuery(value);
  }, 500);

  const handleEdit = (artist) => {
    const selectedArtist = artistData.find((a) => a.id === artist.id);
    setEditArtistId(artist.id);
    setSelectedArtist(selectedArtist);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artist?")) {
      return;
    }
    setLoading(true);
    try {
      await apiCall(`/artist/${id}`, "DELETE");
      fetchArtists();
      toast.success("Artist Deleted successfully");
    } catch (error) {
      toast.error("Failed to delete artist");
    } finally {
      setLoading(false);
    }
  };

  const handleViewArtist = (artist) => {
    setShowArtist(true);
    setSelectedArtist(artist);
  };

  const handleStatusToggle = async (artist) => {
    setLoading(true);
    const newStatus = artist.status === "active" ? "inactive" : "active";
    try {
      await apiCall(`/artist/${artist.id}`, "PATCH", { status: newStatus });
      fetchArtists();
    } catch (error) {
      toast.error("Failed to update artist status");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageFilter = (lang) => {
    setLanguageFilter(lang);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleAddArtist = () => {
    setEditArtistId(null);
    setShowModal(true);
    setSelectedArtist(null);
  };

  return (
    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
      <BreadCrumb
        title={"Artist Report"}
        paths={["Programs", "Artist Report"]}
      />

      <div className="mt-4 rounded-sm shadow-md px-6 py-4 mx-4 bg-white flex-1  ">
        <div className="flex flex-row justify-between items-center gap-3 border-b border-dashed border-dray-300 pb-3">
          <p className="text-sm sm:text-lg font-semibold text-gray-800">
            Artist Report
          </p>
          <button
            onClick={handleAddArtist}
            className="rounded-md bg-primary-500 font-medium text-xs sm:text-sm text-white px-4 py-1.5 sm:px-3 sm:py-2 flex gap-2 items-center hover:bg-primary-600 transition duration-300"
          >
            <BadgePlus size={16} />
            <span>Add Artist</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center sm:justify-end mt-4">
          <div className="w-48">
            <select
              onChange={(e) => handleLanguageFilter(e.target.value)}
              className="border-2 border-gray-300 rounded-md text-xs sm:text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 w-full"
            >
              <option value="">All Languages</option>
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          <div className="relative w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Artists..."
              onChange={(e) => handleSearch(e.target.value)}
              className="border-2 border-gray-300 rounded-md text-xs sm:text-sm px-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300 w-full"
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary-500" size={32} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mt-4 max-w-full">
              <table className="w-full sm:min-w-[800px] border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-primary-100 text-left text-sm text-gray-700">
                    <th className="px-4 py-2 border ">SI</th>
                    <th className="px-4 py-2 border">Artist Name</th>
                    <th className="px-4 py-2 border">Image</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artistData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-6 text-sm md:text-lg text-gray-500"
                      >
                        No Artists Available
                      </td>
                    </tr>
                  ) : (
                    artistData.map((artist, index) => (
                      <tr key={artist.id}>
                        <td className="py-2 px-4 border">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="py-2 px-4 border">
                          {artist.artist_name}
                        </td>
                        <td className="py-2 px-4 border">
                          <img
                            src={`${BASE_URL}/${artist.image.replace(
                              /\\/g,
                              "/"
                            )}`}
                            alt={artist.artist_name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="py-2 px-4 border">
                          <span
                            onClick={() => handleStatusToggle(artist)}
                            className={`cursor-pointer px-2 py-1 text-sm rounded font-semibold ${
                              artist.status === "active"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {artist.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 border">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewArtist(artist)}
                              className="text-green-600 hover:text-green-800"
                              title="view"
                            >
                              <ScanEye size={16} />
                            </button>
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
            </div>
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
          </>
        )}
      </div>
      <CopyrightFooter />
      <AddArtist
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editArtistId={editArtistId}
        editArtistData={selectedArtist}
        onSuccess={() => {
          fetchArtists();
          setShowModal(false);
        }}
      />

      <ViewArtistModal
        isOpen={showArtist}
        onClose={() => setShowArtist(false)}
        artistData={selectedArtist}
      />
    </div>
  );
};

export default Artist;
