import { useEffect, useState } from "react";
import { apiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import BreadCrumb from "../components/BreadCrumb";
import {
  BadgePlus,
  Search,
  Loader2,
  Edit2,
  Trash2,
  ScanEye,
} from "lucide-react";
import CopyrightFooter from "../components/CoyprightFooter";
import AddShows from "./shows/AddShows";
import ViewShowModal from "./shows/ViewShows";

const ShowsList = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [editShowId, setEditShowId] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const pageSize = 20;

  const fetchShows = async () => {
    try {
      const response = await apiCall(
        `/shows?page=${currentPage}&search=${searchQuery}`,
        "GET"
      );
      setShows(response.data.data);
      setTotalRecords(response.data.pagination.totalRecords);
    } catch (error) {
      toast.error("Failed to fetch shows");
    } finally {
      setLoading(false);
    }
  };

  const fetchShow = async (show) => {
    try {
      setLoading(true);
      const response = await apiCall(`/shows/${show.id}?`, "GET");
      setSelectedShow(response.data);
      setViewModal(true);
    } catch (error) {
      toast.error("Failed to fetch Show");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, [currentPage, searchQuery]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this show?")) return;
    setLoading(true);
    try {
      await apiCall(`/shows/${id}`, "DELETE");
      fetchShows();
      toast.success("Show deleted");
    } catch (error) {
      toast.error("Failed to delete show");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditShowId(null);
    setSelectedShow(null);
    setShowModal(true);
  };

  const handleEdit = (show) => {
    setEditShowId(show.id);
    setSelectedShow(show);
    setShowModal(true);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
      <BreadCrumb title="Shows" paths={["Programs", "Shows"]} />

      <div className="mt-4 rounded-sm shadow-md px-6 py-4 mx-4 bg-white flex-1">
        <div className="flex justify-between items-center border-b border-dashed pb-3">
          <p className="text-lg font-semibold text-gray-800">Show List</p>
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
              placeholder="Search by title..."
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
                  <th className="px-4 py-2 border">Time</th>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Location</th>
                  <th className="px-4 py-2 border">Show Lineup Date</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shows.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No Shows Available
                    </td>
                  </tr>
                ) : (
                  shows.map((show, index) => (
                    <tr key={show.id}>
                      <td className="px-4 py-2 border">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-2 border">{show.time}</td>
                      <td className="px-4 py-2 border">{show.title}</td>
                      <td className="px-4 py-2 border">{show.location}</td>
                      <td className="px-4 py-2 border">
                        {new Date(show?.ShowLineup?.date).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td className="px-4 py-2 border">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => fetchShow(show)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <ScanEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(show)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(show.id)}
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

      <AddShows
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editShowData={selectedShow}
        onSuccess={() => {
          fetchShows();
          setShowModal(false);
        }}
      />

      <ViewShowModal
        isOpen={viewModal}
        showData={selectedShow}
        onClose={() => setViewModal(false)}
      />

      <CopyrightFooter />
    </div>
  );
};

export default ShowsList;
