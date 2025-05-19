import { useState } from "react";
import Banner from "../components/Banner";
import TopEventOffer from "../components/TopEventOffer";

const BannerPage = () => {
  const [activeTab, setActiveTab] = useState("banner");

  const tabs = [
    { id: "banner", label: "Banner" },
    { id: "top_event", label: "Top Event Offer" },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="p-4 shadow-md border-t border-dashed border-gray-200 drop-shadow-lg">
        <div className="flex flex-1 gap-2 ">
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
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50 ">
        {activeTab === "banner" && <Banner />}
        {activeTab === "top_event" && <TopEventOffer />}
      </div>
    </div>
  );
};

export default BannerPage;
