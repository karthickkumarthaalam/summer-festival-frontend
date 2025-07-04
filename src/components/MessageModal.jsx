import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiCall } from "../utils/apiCall";
import { toast } from "react-toastify";

const MessageModal = ({ isOpen, onClose, enquiry, refreshData }) => {
  const [comment, setComment] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (enquiry) {
      setComment(enquiry.comment || "");
    }
  }, [enquiry]);

  if (!isOpen || !enquiry) return null;

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      toast.warning("Please enter a comment.");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiCall(`/enquiry/${enquiry.id}/comment`, "POST", { comment });
      toast.success("Comment posted");
      refreshData();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 relative border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={22} />
        </button>

        <div className="flex flex-col max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Message from{" "}
            <span className="text-primary-600">{enquiry.name}</span>
          </h2>

          <div className="border border-gray-200 rounded-md p-4 bg-gray-50 mb-6">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {enquiry.message || "No description available."}
            </p>
            {enquiry.createdAt && (
              <p className="text-xs text-gray-500 mt-1 text-right">
                {new Date(enquiry.createdAt).toLocaleString("en-GB")}
              </p>
            )}
          </div>

          {/* Comment Box */}
          <div className="mt-6 border-t pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Add Comment:
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary-300 focus:border-primary-300"
              placeholder="Write a comment about this enquiry..."
            />
            <button
              onClick={handleCommentSubmit}
              disabled={isSubmitting}
              className="mt-3 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm transition disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>

          {/* {enquiry.replies?.length > 0 ? (
            <div className="mt-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Admin Replies:
              </h3>
              <div className="space-y-3">
                {enquiry.replies.map((reply, index) => (
                  <div
                    key={reply.id || index}
                    className="border border-gray-200 rounded-md p-3 bg-green-50"
                  >
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {reply.reply_message}
                    </p>
                    {reply.createdAt && (
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {new Date(reply.createdAt).toLocaleString("en-GB")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic mt-6 text-center">
              No replies yet.
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
