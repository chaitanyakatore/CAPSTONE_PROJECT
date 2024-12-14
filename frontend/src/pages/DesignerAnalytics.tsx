import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Home,
  Layout,
  LayoutGrid,
  Upload,
  Settings,
  LogOut,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Sample design analytics data
const performanceData = [
  { month: "Jan", views: 1200, likes: 450, downloads: 230 },
  { month: "Feb", views: 1500, likes: 600, downloads: 310 },
  { month: "Mar", views: 1800, likes: 750, downloads: 400 },
  { month: "Apr", views: 2100, likes: 900, downloads: 520 },
  { month: "May", views: 2400, likes: 1050, downloads: 650 },
];

const designCategoryData = [
  { name: "UI/UX", value: 40 },
  { name: "Branding", value: 30 },
  { name: "Illustrations", value: 20 },
  { name: "Marketing", value: 10 },
];

// Soft, modern color palette
const COLORS = [
  "rgba(59, 130, 246, 0.8)", // Soft Blue
  "rgba(16, 185, 129, 0.8)", // Soft Green
  "rgba(244, 63, 94, 0.8)", // Soft Coral
  "rgba(147, 51, 234, 0.8)", // Soft Purple
];

const MyAnalytics: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar from Designer Dashboard */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-100">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">Design Metrics</h1>
        </div>
        <nav className="mt-6">
          <div className="px-4">
            <div className="flex flex-col space-y-2">
              {[
                { icon: Home, text: "Dashboard", path: "/my-dashboard" },
                { icon: Layout, text: "My Design", path: null },
                { icon: LayoutGrid, text: "All Designs", path: "/all-designs" },
                { icon: Upload, text: "Upload Design", path: "/upload-design" },
                { icon: Layout, text: "Analytics", path: "/dashboard" },
                {
                  icon: FileText,
                  text: "Upload Feedback",
                  path: "/submit-feedback",
                },
                { icon: MessageSquare, text: "Chat", path: "/chat" },
                { icon: Settings, text: "Settings", path: "/profile" },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => item.path && navigate(item.path)}
                  className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                  {item.text}
                </button>
              ))}
            </div>
          </div>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-400" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800">
              Design Analytics
            </h1>
          </div>

          {/* Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: "👀",
                label: "Total Views",
                value: "24,500",
                gradient: "from-blue-300 to-blue-500",
              },
              {
                icon: "❤️",
                label: "Total Likes",
                value: "9,250",
                gradient: "from-pink-300 to-pink-500",
              },
              {
                icon: "📥",
                label: "Design Downloads",
                value: "4,600",
                gradient: "from-green-300 to-green-500",
              },
              {
                icon: "⏰",
                label: "Avg. View Time",
                value: "3m 42s",
                gradient: "from-purple-300 to-purple-500",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.gradient} text-white rounded-xl shadow-md transform transition-all hover:scale-105`}
              >
                <div className="p-6 flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-full text-2xl">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm opacity-80">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Performance Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Design Performance
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    tick={{ fill: "#4b5563" }}
                  />
                  <YAxis stroke="#6b7280" tick={{ fill: "#4b5563" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      color: "#1f2937",
                      borderRadius: "10px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line
                    type="monotone"
                    dataKey="views"
                    name="Views"
                    stroke={COLORS[0]}
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: COLORS[0],
                      stroke: "white",
                      strokeWidth: 2,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="likes"
                    name="Likes"
                    stroke={COLORS[1]}
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: COLORS[1],
                      stroke: "white",
                      strokeWidth: 2,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="downloads"
                    name="Downloads"
                    stroke={COLORS[2]}
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: COLORS[2],
                      stroke: "white",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Design Categories
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={designCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {designCategoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      color: "#1f2937",
                      borderRadius: "10px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAnalytics;
