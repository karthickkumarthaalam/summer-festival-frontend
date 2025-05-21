import { useEffect, useState } from "react";
import { apiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import BreadCrumb from "../components/BreadCrumb";
import { BadgePlus, Loader2, Edit2, Trash2, ScanEye } from "lucide-react";
import AddShowLineUpModal from "./showlineUp/AddShowLineUpModal";
import ViewShowLineUpModal from "./showlineUp/ViewShowLineUpModal";
import CopyrightFooter from "../components/CoyprightFooter";

const ShowLineUpList = () => {
  const [showModal, setShowModal] = useState(false);
  const [showData, setShowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editShowId, setEditShowId] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [languageFilter, setLanguageFilter] = useState("");
  const pageSize = 20;

  const fetchShowLineUps = async () => {
    try {
      const response = await apiCall(
        `/showlineup?page=${currentPage}&language=${languageFilter}`,
        "GET"
      );
      setShowData(response.data.data);
      setTotalRecords(response.data.pagination.totalRecords);
    } catch (error) {
      toast.error("Failed to fetch show lineups");
    } finally {
      setLoading(false);
    }
  };

  const fetchShow = async (show) => {
    try {
      setLoading(true);
      const response = await apiCall(`/showlineup/${show.id}`, "GET");
      setSelectedShow(response.data);
      setViewModal(true);
    } catch (error) {
      toast.error("Failed to fetch show data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowLineUps();
  }, [currentPage, languageFilter]);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lineup?")) return;
    setLoading(true);
    try {
      await apiCall(`/showlineup/${id}`, "DELETE");
      fetchShowLineUps();
      toast.success("Show Lineup deleted");
    } catch (error) {
      toast.error("Failed to delete lineup");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageFilter = (lang) => {
    setLanguageFilter(lang);
    setCurrentPage(1);
  };

  const handleStatusToggle = async (show) => {
    setLoading(true);
    const newStatus = show.status === "active" ? "inactive" : "active";
    try {
      await apiCall(`/showlineup/${show.id}`, "PATCH", { status: newStatus });
      fetchShowLineUps();
    } catch (error) {
      toast.error("Status update failed");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
      <BreadCrumb title="Show Lineup" paths={["Programs", "Show Lineup"]} />

      <div className="mt-4 rounded-sm shadow-md px-6 py-4 mx-4 bg-white flex-1">
        <div className="flex justify-between items-center border-b border-dashed pb-3">
          <p className="text-lg font-semibold text-gray-800">Show Lineup</p>
          <button
            onClick={handleAdd}
            className="rounded-md bg-primary-500 text-sm text-white px-4 py-2 flex items-center gap-2 hover:bg-primary-600"
          >
            <BadgePlus size={16} />
            Add Lineup
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
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {showData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No Show Lineups Available
                    </td>
                  </tr>
                ) : (
                  showData.map((show, index) => (
                    <tr key={show.id}>
                      <td className="px-4 py-2 border">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-2 border">
                        {new Date(show.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-2 border">
                        <span
                          onClick={() => handleStatusToggle(show)}
                          className={`cursor-pointer px-2 py-1 rounded text-sm font-medium ${
                            show.status === "active"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {show.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => fetchShow(show)}
                            className="text-green-600 hover:text-green-800"
                            title="View"
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

      <AddShowLineUpModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editLineUpId={editShowId}
        editData={selectedShow}
        onSuccess={() => {
          fetchShowLineUps();
          setShowModal(false);
        }}
      />

      <ViewShowLineUpModal
        isOpen={viewModal}
        onClose={() => setViewModal(false)}
        showLineUpData={selectedShow}
      />

      <CopyrightFooter />
    </div>
  );
};

export default ShowLineUpList;
