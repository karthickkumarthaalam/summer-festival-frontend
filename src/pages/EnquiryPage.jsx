import { useState } from "react";
import Enquiry from "./Enquiry";
import StallEnquiry from "../components/enquiry/StallEnquiry";
import PreRegistration from "../components/enquiry/PreRegistration";

const EnquiryPage = () => {
  const [activeTab, setActiveTab] = useState("ticket");

  const tabs = [
    { id: "ticket", label: "Ticket Enquiry" },
    { id: "stall", label: "Stall Enquiry" },
    { id: "registration", label: "Pre-Registration" },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="p-4 shadow-md border-t border-dashed border-gray-200 drop-shadow-lg">
        <div className="flex flex-1 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-3 overflow-x-auto bg-gray-50">
        {activeTab === "ticket" && <Enquiry />}
        {activeTab === "stall" && <StallEnquiry />}
        {activeTab === "registration" && <PreRegistration />}
      </div>
    </div>
  );
};

export default EnquiryPage;
