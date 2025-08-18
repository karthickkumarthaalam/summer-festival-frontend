import React, { useEffect, useState } from "react";
import { apiCall } from "../../utils/apiCall";
import { toast } from "react-toastify";
import BreadCrumb from "../BreadCrumb";
import { Search, Loader2, FileUp, X } from "lucide-react";
import CopyrightFooter from "../CoyprightFooter";
import debounce from "lodash.debounce";

const RefundEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const pageSize = 50;

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await apiCall(
        `/refund-enquiry?page=${currentPage}&search=${searchQuery}&status=${statusFilter}`
      );
      setEnquiries(response?.data);
      setTotalRecords(response?.pagination?.totalRecords);
    } catch (error) {
      toast.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  const statusCycle = {
    pending: "verified",
    verified: "refunded",
    refunded: "pending",
  };

  useEffect(() => {
    fetchEnquiries();
  }, [currentPage, searchQuery, statusFilter]);

  const handleStatusChange = async (id, currentStatus) => {
    if (currentStatus === "refunded") {
      toast.info("Ticket is already refunded and cannot be changed.");
      return;
    }

    const newStatus = statusCycle[currentStatus];
    try {
      await apiCall(`/refund-enquiry/${id}`, "PATCH", {
        REFUNDED_STATUS: newStatus,
      });
      toast.success(`Status updated to ${newStatus}`);
      setEnquiries((prev) =>
        prev.map((enquiry) =>
          enquiry.id === id
            ? { ...enquiry, REFUNDED_STATUS: newStatus }
            : enquiry
        )
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSearch = debounce((value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  const capitalizeStr = (str) => {
    if (!str) {
      return;
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="flex flex-1 flex-col overflow-hidden scrollbar-thin scrollbar-thumb-gray-300">
      <div className="flex flex-1 overflow-hidden">
        <BreadCrumb
          title={"Refund Enquiry Management"}
          paths={["Enquiry", "Refund Enquiry"]}
        />
      </div>
      <div className="mt-4 rounded-sm shadow-md px-6 py-4 mx-4 bg-white flex-1">
        <div className="flex flex-row justify-between items-center gap-3 border-b border-dashed border-gray-300 pb-3">
          <p className="text-sm sm:text-lg font-semibold text-gray-800">
            {" "}
            Refund Enquiry list
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between items-center mt-4">
          <p className="text-xs sm:text-sm text-gray-600">
            showing{" "}
            {(currentPage - 1) * pageSize + (enquiries.length > 0 ? 1 : 0)} to{" "}
            {(currentPage - 1) * pageSize + enquiries.length} of {totalRecords}{" "}
            ({totalPages} {totalPages === 1 ? "page" : "pages"})
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center n-64">
            <Loader2 className="animate-spin text-primary-500" size={24} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mt-4 max-w-full">
              <table className="w-full sm:min-w-[700px] border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-primary-100 text-left text-sm text-gray-700">
                    <th className="px-4 py-2 border">SI</th>
                    <th className="px-4 py-2 border">ORDER ID</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Phone</th>
                    <th className="px-4 py-2 border">Decision</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center text-gray-500 py-6 text-sm md:text-lg"
                      >
                        No Enquiries Found
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((enquiry, index) => (
                      <tr key={enquiry.id}>
                        <td className="px-4 py-2 border">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-4 py-2 border">
                          <button
                            className="text-primary-500 bg-primary-50 rounded-full px-2 py-0.5 text-sm font-medium"
                            onClick={() => {
                              setSelectedEnquiry(enquiry);
                              setShowOrderDetails(true);
                            }}
                          >
                            {enquiry.ORDER_ID}
                          </button>
                        </td>
                        <td className="px-4 py-2 border">{enquiry.NAME}</td>
                        <td className="px-4 py-2 border">{enquiry.EMAIL_ID}</td>
                        <td className="px-4 py-2 border">
                          {enquiry.PHONE_NUMBER}
                        </td>
                        <td className="px-4 py-2 border font-semibold">
                          {capitalizeStr(enquiry.REFUND_OR_CONTINUE)}
                        </td>
                        <td className="px-4 py-2 border">
                          <button
                            onClick={() => {
                              handleStatusChange(
                                enquiry.id,
                                enquiry.REFUNDED_STATUS
                              );
                            }}
                            className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                              enquiry.REFUNDED_STATUS === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : enquiry.REFUNDED_STATUS === "verified"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {capitalizeStr(enquiry.REFUNDED_STATUS)}
                          </button>
                        </td>
                        <td className="px-4 py-2 border">
                          <button
                            onClick={() => {
                              setSelectedEnquiry(enquiry);
                              setShowDescription(true);
                            }}
                            className="text-xs text-primary-700 hover:underline bg-primary-50 rounded-full items-center inline-flex px-2 py-0.5 font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex jsutify-center items-center gap-4 mt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="text-sm px-3 py-1.5 rounded border hover:bg-gray-100 disabled:opacity-50"
                >
                  {" "}
                  Previous
                </button>
                <span className="text-sm font-medium">
                  page {currentPage} of {totalPages}
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
      <DescriptionModal
        isOpen={showDescription}
        enquiry={selectedEnquiry}
        onClose={() => setShowDescription(false)}
      />
      <OrderDetailsModal
        isOpen={showOrderDetails}
        enquiry={selectedEnquiry}
        onClose={() => setShowOrderDetails(false)}
      />
      <CopyrightFooter />
    </div>
  );
};

const DescriptionModal = ({ isOpen, enquiry, onClose }) => {
  if (!isOpen || !enquiry) {
    return null;
  }
  return (
    <div className="inset-0 fixed z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl p-6 relative border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={22} />
        </button>

        <div className="flex flex-col max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Description for{" "}
            <span className="text-primary-600">{enquiry.ORDER_ID}</span>
          </h2>

          <p className="text-md text-gray-700 whitespace-pre-wrap">
            {enquiry?.TICKET_DESCRIPTION || "No description availble."}
          </p>

          {enquiry?.PAYMENT_MODE && (
            <p className="text-md whitespace-pre-wrap mt-2">
              <span className="text-primary-600">Payment Mode: </span>
              <span className="font-semibold text-gray-700">
                {enquiry?.PAYMENT_MODE}
              </span>
            </p>
          )}

          {enquiry?.TWINT_ACCOUNT && (
            <p className="text-md whitespace-pre-wrap mt-2">
              <span className="text-primary-600">Twint Account: </span>
              <span className="font-semibold text-gray-700">
                {" "}
                {enquiry?.TWINT_ACCOUNT}
              </span>
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {enquiry?.FULL_NAME && (
              <p className="text-md whitespace-pre-wrap">
                <span className="text-primary-600">Full Name: </span>
                <span className="font-semibold text-gray-700">
                  {" "}
                  {enquiry?.FULL_NAME}
                </span>
              </p>
            )}

            {enquiry?.BANK_NAME && (
              <p className="text-md whitespace-pre-wrap">
                <span className="text-primary-600">Bank Name: </span>
                <span className="font-semibold text-gray-700">
                  {" "}
                  {enquiry?.BANK_NAME}
                </span>
              </p>
            )}

            {enquiry?.IBAN_NUMBER && (
              <p className="text-md whitespace-pre-wrap">
                <span className="text-primary-600">IBAN Number: </span>
                <span className="font-semibold text-gray-700">
                  {" "}
                  {enquiry?.IBAN_NUMBER}
                </span>
              </p>
            )}

            {enquiry?.BIC_SWIFT_CODE && (
              <p className="text-md whitespace-pre-wrap">
                <span className="text-primary-600">SWIFT Code: </span>
                <span className="font-semibold text-gray-700">
                  {" "}
                  {enquiry?.BIC_SWIFT_CODE}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsModal = ({ isOpen, enquiry, onClose }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---- Fetch Order Details ----
  const fetchOrderDetails = async () => {
    if (!enquiry?.ORDER_ID) return;
    setLoading(true);

    try {
      const response = await apiCall(
        `/refund-enquiry/attendee/${enquiry.ORDER_ID}`
      );

      const attendees = response?.attendees || [];
      setOrderDetails(attendees);
    } catch (error) {
      toast.error("Failed to fetch order details");
      setOrderDetails([]);
    } finally {
      setLoading(false);
    }
  };

  // ---- Run on modal open ----
  useEffect(() => {
    if (isOpen && enquiry?.ORDER_ID) {
      fetchOrderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, enquiry?.ORDER_ID]);

  if (!isOpen) return null;

  // ---- Derived values ----
  const totalTickets = orderDetails.length;
  const totalAmount = orderDetails.reduce(
    (sum, item) => sum + (parseFloat(item?.AMOUNT_COLLECTED) || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 relative border border-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={22} />
        </button>

        {/* Content */}
        {loading ? (
          <p className="text-gray-500">Loading order details...</p>
        ) : orderDetails.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold mb-4 text-primary-600">
              Order #{enquiry?.ORDER_ID}
            </h2>

            <div className="mb-4 space-y-1">
              <p>
                <strong>Total Tickets: </strong> {totalTickets}
              </p>
              <p>
                <strong>Total Amount Collected: </strong>
                {totalAmount.toFixed(2)}
              </p>
            </div>

            <h3 className="font-semibold mb-2">Tickets</h3>
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Ticket ID</th>
                    <th className="p-2 border">Ticket Class</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.map((ticket) => (
                    <tr key={ticket?.TICKET_ID}>
                      <td className="p-2 border">{ticket?.TICKET_ID}</td>
                      <td className="p-2 border">{ticket?.TICKET_CLASS}</td>
                      <td className="p-2 border">{ticket?.FIRST_NAME}</td>
                      <td className="p-2 border">{ticket?.AMOUNT_COLLECTED}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No order details found.</p>
        )}
      </div>
    </div>
  );
};
export default RefundEnquiry;
