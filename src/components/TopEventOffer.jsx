import React, { useEffect, useState } from "react";
import BreadCrumb from "./BreadCrumb";
import { BadgePlus, Loader2, Search, Edit2, Trash2 } from "lucide-react";
import AddTopEventOffer from "./AddTopEventOffer";
import { apiCall } from "../utils/apiCall";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";

const TopEventOffer = () => {
  const [offers, setOffers] = useState([]);
  const [editOfferId, setEditOfferId] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");

  const pageSize = 20;

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await apiCall(
        `/top-event-offers?page=${currentPage}&search=${searchQuery}&language=${languageFilter}`
      );
      setOffers(response.data.data);
      setTotalRecords(response.data.pagination.totalRecords);
    } catch (error) {
      console.error("Error fetching offers: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [currentPage, searchQuery, languageFilter]);

  const handleSearch = debounce((value) => {
    setSearchQuery(value);
  }, 500);

  const handleAddOffer = () => {
    setEditOfferId(null);
    setSelectedOffer(null);
    setShowModal(true);
  };

  const handleLanguageFilter = (lang) => {
    setLanguageFilter(lang);
    setCurrentPage(1);
  };

  const handleStatusToggle = async (offer) => {
    const newStatus = offer.status === "active" ? "inactive" : "active";
    setLoading(true);
    try {
      await apiCall(`/top-event-offers/${offer.id}`, "PATCH", {
        status: newStatus,
      });
      fetchOffers();
    } catch (error) {
      toast.error("Failed to update offer status");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer) => {
    setSelectedOffer(offer);
    setEditOfferId(offer.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this News?")) return;
    setLoading(true);
    try {
      await apiCall(`/top-event-offers/${id}`, "DELETE");
      fetchOffers();
      toast.success("News deleted successfully");
    } catch (error) {
      toast.error("Failed to delete News");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        <BreadCrumb
          title="Top News Management"
          paths={["Banner", "Top News"]}
        />
      </div>

      <div className="mt-4 rounded-sm shadow-md md:px-6 md:py-6 md:mx-4 bg-white flex-1 overflow-y-auto">
        <div className="flex flex-row justify-between items-center gap-3 border-b border-dashed border-gray-300 pb-3">
          <p className="text-sm sm:text-lg font-semibold text-gray-800">
            Top News
          </p>
          <button
            onClick={handleAddOffer}
            className="rounded-md bg-primary-500 font-medium text-xs sm:text-sm text-white px-2 py-1.5 sm:px-3 sm:py-2 flex gap-2 items-center hover:bg-primary-600 transition duration-300 "
          >
            <BadgePlus size={16} />
            <span>Add News</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-center md:justify-end mt-4 gap-2 md:gap-4">
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
              placeholder="Search News..."
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
              <table className="w-full border border-gray-300 text-sm text-gray-700">
                <thead>
                  <tr className="bg-primary-100">
                    <th className="py-2 px-4 border">SI</th>
                    <th className="py-2 px-4 border">Title</th>
                    <th className="py-2 px-4 border">Redirect URL</th>
                    <th className="py-2 px-4 border">Status</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-6 px-4 border text-center text-gray-500"
                      >
                        No Offers Found
                      </td>
                    </tr>
                  ) : (
                    offers.map((offer, index) => (
                      <tr key={offer.id}>
                        <td className="py-2 px-4 border">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="py-2 px-4 border">{offer.title}</td>
                        <td className="py-2 px-4 border">
                          {offer.redirect_url}
                        </td>
                        <td className="py-2 px-4 border">
                          <span
                            onClick={() => handleStatusToggle(offer)}
                            className={`cursor-pointer px-2 py-1 text-sm rounded font-semibold ${
                              offer.status === "active"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {offer.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 border">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(offer)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(offer.id)}
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

      <AddTopEventOffer
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editOfferId={editOfferId}
        editOfferData={selectedOffer}
        onSuccess={() => {
          setShowModal(false);
          fetchOffers();
        }}
      />
    </div>
  );
};

export default TopEventOffer;
