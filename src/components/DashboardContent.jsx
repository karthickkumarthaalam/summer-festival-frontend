import React from "react";
import { Users, Mic, Video, Calendar } from "lucide-react";

// Dashboard card data array
const dashboardData = [
  {
    label: "Total Users",
    value: 10,
    icon: Users,
    borderColor: "border-red-500",
    bgGradient: "from-red-400 to-red-600",
  },
  {
    label: "Total RJs",
    value: 12,
    icon: Mic,
    borderColor: "border-pink-600",
    bgGradient: "from-pink-400 to-pink-600",
  },
  {
    label: "Total Programs",
    value: 10,
    icon: Video,
    borderColor: "border-indigo-600",
    bgGradient: "from-indigo-400 to-indigo-600",
  },
  {
    label: "Total Events",
    value: 13,
    icon: Calendar,
    borderColor: "border-green-600",
    bgGradient: "from-green-400 to-green-600",
  },
];

const DashboardContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
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
