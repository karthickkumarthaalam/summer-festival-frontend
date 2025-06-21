import { useState, useEffect } from "react";
import { apiCall } from "../../utils/apiCall";
import { toast } from "react-toastify";
import BreadCrumb from "../BreadCrumb";
import { Search, Loader2, FileUp } from "lucide-react";
import CopyrightFooter from "../CoyprightFooter";
import debounce from "lodash.debounce";
import { downloadFile } from "../../utils/downloadFile";

const StallEnquiry = () => {
  const [enquires, setEnquires] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  const pageSize = 50;

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await apiCall(
        `/stall-enquiry?page=${currentPage}&search=${searchQuery}&limit=${50}`
      );
      setEnquires(response.data.data);
      setTotalRecords(response.data.pagination.totalRecords);
    } catch (error) {
      toast.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [currentPage, searchQuery]);

  const handleSearch = debounce((value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  const statusCycle = {
    pending: "resolved",
    resolved: "closed",
    closed: "pending",
  };

  const handleStatusChange = async (id, currentStatus) => {
    if (currentStatus === "closed") {
      toast.info("This enquiry is already closed and cannot be changed.");
      return;
    }

    const newStatus = statusCycle[currentStatus];
    try {
      await apiCall(`/stall-enquiry/${id}`, "PATCH", { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setEnquires((prev) =>
        prev.map((enquiry) =>
          enquiry.id === id ? { ...enquiry, status: newStatus } : enquiry
        )
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleExport = async () => {
    try {
      await downloadFile("/stall-enquiry/export", "Stall_Enquiries.xlsx");
    } catch (error) {
      toast.error("Failed to export Enquiries");
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="flex flex-1 flex-col overflow-hidden scrollbar-thin scrollbar-thumb-gray-300">
      <div className="flex flex-col flex-1 overflow-hidden">
        <BreadCrumb
          title={"Enquiry Management"}
          paths={["Enquiry", "Stall Enquiry"]}
        />
      </div>

      <div className="mt-4 rounded-sm shadow-md px-6 py-4 mx-4 bg-white flex-1">
        <div className="flex flex-row justify-between items-center gap-3 border-b border-dashed border-gray-300 pb-3">
          <p className="text-sm sm:text-lg font-semibold text-gray-800">
            Stall Enquiry List
          </p>
          <button
            onClick={handleExport}
            className="rounded-md bg-primary-500 font-medium text-xs sm:text-sm text-white px-4 py-1.5 sm:px-3 sm:py-2 flex gap-2 items-center hover:bg-primary-600 transition duration-300"
          >
            <FileUp />
            Export Enquiry
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between items-center mt-4">
          <p className="text-xs sm:text-sm text-gray-600">
            Showing{" "}
            {(currentPage - 1) * pageSize + (enquires.length > 0 ? 1 : 0)} to{" "}
            {(currentPage - 1) * pageSize + enquires.length} of {totalRecords} (
            {totalPages} {totalPages === 1 ? "Page" : "Pages"})
          </p>

          <div className="relative w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Enquiries..."
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
              <table className="w-full sm:min-w-[700px] border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-primary-100 text-left text-sm text-gray-700">
                    <th className="px-4 py-2 border">SI</th>
                    <th className="px-4 py-2 border">Shop Name</th>
                    <th className="px-4 py-2 border">Person Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Phone</th>
                    <th className="px-4 py-2 border">Category</th>
                    <th className="px-4 py-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enquires.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-6 text-sm md:text-lg text-gray-500"
                      >
                        No Enquiries Found
                      </td>
                    </tr>
                  ) : (
                    enquires.map((enquiry, index) => (
                      <tr key={enquiry.id}>
                        <td className="py-2 px-4 border">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="py-2 px-4 border">
                          {enquiry.shop_name}
                        </td>
                        <td className="py-2 px-4 border">
                          {enquiry.person_name}
                        </td>
                        <td className="py-2 px-4 border">{enquiry.email}</td>
                        <td className="py-2 px-4 border">{enquiry.phone}</td>
                        <td className="py-2 px-4 border">{enquiry.category}</td>
                        <td className="py-2 px-4 border">
                          <button
                            onClick={() =>
                              handleStatusChange(enquiry.id, enquiry.status)
                            }
                            className={`text-xs px-2.5 py-1 rounded-full font-semibold
                                  ${
                                    enquiry.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : enquiry.status === "resolved"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                          >
                            {enquiry.status}
                          </button>
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
    </div>
  );
};

export default StallEnquiry;
