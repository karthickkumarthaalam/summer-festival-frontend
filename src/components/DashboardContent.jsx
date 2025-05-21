import React, { useEffect, useState } from "react";
import { Users, Mic, Video, Calendar } from "lucide-react";
import { apiCall } from "../utils/apiCall";

const iconMap = {
  artists: Users,
  news: Mic,
  banners: Video,
  events: Calendar,
};

const DashboardContent = () => {
  const [counts, setCounts] = useState({
    artists: 0,
    news: 0,
    banners: 0,
    showLineups: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await apiCall("/dashboard", "GET");
        if (res.status === "success" && res.data) {
          setCounts({
            artists: res.data.artists || 0,
            news: res.data.news || 0,
            banners: res.data.banners || 0,
            showLineups: res.data.showLineups || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard counts", error);
      }
    };

    fetchCounts();
  }, []);

  const dashboardData = [
    {
      label: "Total Artists",
      value: counts.artists,
      icon: iconMap.artists,
      borderColor: "border-primary-500",
      bgGradient: "from-primary-400 to-primary-600",
    },
    {
      label: "Total News",
      value: counts.news,
      icon: iconMap.news,
      borderColor: "border-secondary-600",
      bgGradient: "from-secondary-400 to-secondary-600",
    },
    {
      label: "Total Banners",
      value: counts.banners,
      icon: iconMap.banners,
      borderColor: "border-indigo-600",
      bgGradient: "from-indigo-400 to-indigo-600",
    },
    {
      label: "Total Show Lineups",
      value: counts.showLineups,
      icon: iconMap.events,
      borderColor: "border-green-600",
      bgGradient: "from-green-400 to-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
      <h1 className="text-lg font-bold text-gray-800  py-4 md:hidden">
        Dashboard Overview
      </h1>
      {dashboardData.map((item, index) => (
        <div
          key={index}
          className={`bg-white rounded-2xl shadow-md p-8 flex items-center space-x-4 hover:scale-[1.03] transition border-l-4 ${item.borderColor}`}
        >
          <div
            className={`bg-gradient-to-br ${item.bgGradient} p-3 rounded-full text-white`}
          >
            <item.icon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">{item.label}</p>
            <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardContent;
