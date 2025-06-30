import { X } from "lucide-react";

const ReplyModal = ({
  isOpen,
  onClose,
  replyMessage,
  setReplyMessage,
  onSendReply,
  enquiry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Send Reply to <span className="text-primary-600">{enquiry.name}</span>
        </h2>

        <textarea
          rows="5"
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
          placeholder="Type your reply here..."
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-sm border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onSendReply}
            className="px-4 py-1.5 rounded-md text-sm bg-primary-500 text-white hover:bg-primary-600 transition duration-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
