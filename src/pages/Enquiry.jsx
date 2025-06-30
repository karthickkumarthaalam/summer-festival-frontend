import { useEffect, useState } from "react";
import { apiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import BreadCrumb from "../components/BreadCrumb";
import { Search, Loader2, FileUp } from "lucide-react";
import CopyrightFooter from "../components/CoyprightFooter";
import debounce from "lodash.debounce";
import MessageModal from "../components/MessageModal";
import { downloadFile } from "../utils/downloadFile";
import ReplyModal from "../components/enquiry/ReplyModal";

const Enquiry = () => {
  const [enquiryData, setEnquiryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const pageSize = 20;

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await apiCall(
        `/enquiry?page=${currentPage}&search=${searchQuery}`,
        "GET"
      );
      setEnquiryData(response.data.data);
      setTotalRecords(response.data.pagination.totalRecords);
    } catch (error) {
      console.error("Error fetching enquiries", error);
      toast.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [currentPage, searchQuery]);

  const openDescriptionModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

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
      await apiCall(`/enquiry/${id}`, "PATCH", { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setEnquiryData((prev) =>
        prev.map((enquiry) =>
          enquiry.id === id ? { ...enquiry, status: newStatus } : enquiry
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    }
  };

  const handleExport = async () => {
    try {
      await downloadFile("/enquiry/export", "Enquiries");
    } catch (error) {
      toast.error("Failed to download Enquiries");
    }
  };

  const openReplyModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setReplyMessage("");
    setIsReplyModalOpen(true);
  };

  const handleSendReply = async () => {
    try {
      await apiCall(`/enquiry/${selectedEnquiry.id}/reply`, "POST", {
        reply_message: replyMessage,
      });
      toast.success("Reply sent successfully");
      fetchEnquiries();
      setIsReplyModalOpen(false);
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="flex flex-1 flex-col overflow-hidden scrollbar-thin scrollbar-thumb-gray-300">
      <div className="flex flex-col flex-1 overflow-hidden">
        <BreadCrumb
          title={"Enquiry Management"}
          paths={["Enquiry", "Ticket Enquiry"]}
        />
      </div>

      <div className="mt-4 rounded-sm shadow-md px-6 py-4 mx-4 bg-white flex-1">
        <div className="flex flex-row justify-between items-center gap-3 border-b border-dashed border-gray-300 pb-3">
          <p className="text-sm sm:text-lg font-semibold text-gray-800">
            Enquiry List
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
            {(currentPage - 1) * pageSize + (enquiryData.length > 0 ? 1 : 0)} to{" "}
            {(currentPage - 1) * pageSize + enquiryData.length} of{" "}
            {totalRecords} ({totalPages} {totalPages === 1 ? "Page" : "Pages"})
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
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Phone</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Ticket Id</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Message</th>
                    <th className="px-4 py-2 border">Reply</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiryData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-6 text-sm md:text-lg text-gray-500"
                      >
                        No Enquiries Found
                      </td>
                    </tr>
                  ) : (
                    enquiryData.map((enquiry, index) => (
                      <tr key={enquiry.id}>
                        <td className="py-2 px-4 border">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="py-2 px-4 border">{enquiry.name}</td>
                        <td className="py-2 px-4 border">{enquiry.phone}</td>
                        <td className="py-2 px-4 border">{enquiry.email}</td>
                        <td className="py-2 px-4 border">{enquiry.subject}</td>
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
                        <td className="py-2 px-4 border">
                          <button
                            onClick={() => openDescriptionModal(enquiry)}
                            className="text-xs text-primary-600 hover:underline"
                          >
                            View
                          </button>
                        </td>
                        <td className="px-4 py-2 border">
                          <button
                            className="text-xs text-green-500 hover:underline"
                            onClick={() => openReplyModal(enquiry)}
                          >
                            {" "}
                            Reply
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
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        enquiry={selectedEnquiry}
      />
      <ReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
        onSendReply={handleSendReply}
        enquiry={selectedEnquiry}
      />
      <CopyrightFooter />
    </div>
  );
};

export default Enquiry;
