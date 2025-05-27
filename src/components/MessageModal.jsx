import { X } from "lucide-react";

const MessageModal = ({ isOpen, onClose, message }) => {
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
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Message</h2>
        <p className="text-sm text-gray-600 whitespace-pre-wrap">
          {message || "No description available."}
        </p>
      </div>
    </div>
  );
};
export default MessageModal;
