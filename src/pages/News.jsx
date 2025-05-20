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
import AddNewsModal from "../components/AddNewsModal";
import ViewNewsModal from "../components/ViewNewsModal";

const News = () => {
  const [showModal, setShowModal] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editNewsId, setEditNewsId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const pageSize = 20;
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchNews = async () => {
    try {
      const response = await apiCall(
        `/news?page=${currentPage}&search=${searchQuery}&language=${languageFilter}`,
        "GET"
      );
      setNewsData(response.data.data);
      setTotalRecords(response.data.pagination.totalRecords);
    } catch (error) {
      console.log("Error fetching news data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [currentPage, searchQuery, languageFilter]);

  const handleSearch = debounce((value) => {
    setSearchQuery(value);
  }, 500);

  const handleEdit = (news) => {
    const selected = newsData.find((n) => n.id === news.id);
    setEditNewsId(news.id);
    setSelectedNews(selected);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) {
      return;
    }
    setLoading(true);
    try {
      await apiCall(`/news/${id}`, "DELETE");
      fetchNews();
      toast.success("News item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete news item");
    } finally {
      setLoading(false);
    }
  };

  const handleViewNews = (news) => {
    setShowViewModal(true);
    setSelectedNews(news);
  };

  const handleStatusToggle = async (news) => {
    setLoading(true);
    const newStatus = news.status === "active" ? "inactive" : "active";
    try {
      await apiCall(`/news/${news.id}`, "PATCH", { status: newStatus });
      fetchNews();
    } catch (error) {
      toast.error("Failed to update news status");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageFilter = (lang) => {
    setLanguageFilter(lang);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleAddNews = () => {
    setEditNewsId(null);
    setShowModal(true);
    setSelectedNews(null);
  };

  return (
    <div>
      <div>
        <BreadCrumb title={"News Management"} paths={["Programs", "News"]} />

        <div className="mt-4 rounded-sm shadow-md px-6 py-4 mx-4 bg-white flex-1 overflow-y-auto ">
          <div className="flex flex-row justify-between items-center gap-3 border-b border-dashed pb-3">
            <p className="text-sm sm:text-lg font-semibold text-gray-800">
              News List
            </p>
            <button
              onClick={handleAddNews}
              className="rounded-md bg-primary-500 font-medium text-xs sm:text-sm text-white px-4 py-1.5 sm:px-3 sm:py-2 flex gap-2 items-center hover:bg-primary-600 transition duration-300"
            >
              <BadgePlus size={16} />
              <span>Add News</span>
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
                <table className="w-full sm:min-w-[900px] border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-primary-100 text-left text-sm text-gray-700">
                      <th className="px-4 py-2 border">SI</th>
                      <th className="px-4 py-2 border">Title</th>
                      <th className="px-4 py-2 border">Category</th>
                      <th className="px-4 py-2 border">Image</th>
                      <th className="px-4 py-2 border">Published</th>
                      <th className="px-4 py-2 border">Author</th>
                      <th className="px-4 py-2 border">Status</th>
                      <th className="px-4 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsData.length === 0 ? (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center py-6 text-sm md:text-lg text-gray-500"
                        >
                          No News Available
                        </td>
                      </tr>
                    ) : (
                      newsData.map((news, index) => (
                        <tr key={news.id}>
                          <td className="py-2 px-4 border">
                            {(currentPage - 1) * pageSize + index + 1}
                          </td>
                          <td className="py-2 px-4 border">{news.title}</td>
                          <td className="py-2 px-4 border">{news.category}</td>
                          <td className="py-2 px-4 border">
                            <img
                              src={`${BASE_URL}/${news.image.replace(
                                /\\/g,
                                "/"
                              )}`}
                              alt={news.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </td>
                          <td className="py-2 px-4 border capitalize">
                            {new Date(news.published).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          <td className="py-2 px-4 border">{news.author}</td>
                          <td className="py-2 px-4 border">
                            <span
                              onClick={() => handleStatusToggle(news)}
                              className={`cursor-pointer px-2 py-1 text-sm rounded font-semibold ${
                                news.status === "active"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {news.status}
                            </span>
                          </td>
                          <td className="py-2 px-4 border">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewNews(news)}
                                className="text-green-600 hover:text-green-800"
                                title="View"
                              >
                                <ScanEye size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(news)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(news.id)}
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

        <AddNewsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          editNewsId={editNewsId}
          editNewsData={selectedNews}
          onSuccess={() => {
            fetchNews();
            setShowModal(false);
          }}
        />

        <ViewNewsModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          newsData={selectedNews}
        />
      </div>
    </div>
  );
};

export default News;
