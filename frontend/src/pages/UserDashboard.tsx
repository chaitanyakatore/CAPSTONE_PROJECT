import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/DashBoardCard";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Layout,
  Upload,
  Image,
  Settings,
  LogOut,
  Eye,
  Users,
  MessageSquare,
} from "lucide-react";

interface UserData {
  userId: number;
  userName: string;
  email: string;
  roleId: number;
  role: string; // Added role field
}

interface Design {
  category: string;
  _id: string;
  designId: number;
  designInput: string;
  designTitle: string;
  description: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [latestDesigns, setLatestDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserData({
          userId: Number(payload.userId),
          userName: payload.userName,
          email: payload.email,
          roleId: payload.roleId,
          role: payload.roleId === 1 ? "User" : "Designer",
        });
      } catch (error) {
        console.error("Error parsing JWT token:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  }, []);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get<Design[]>(
          "http://localhost:3002/api/designs"
        );
        setLatestDesigns(response.data);
      } catch (err) {
        console.error("Error fetching designs:", err);
        setError("Failed to load designs");
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const filteredDesigns = latestDesigns.filter(
    (design) =>
      (selectedCategory === "all" || design.category === selectedCategory) &&
      (design.designTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewDesign = (designId: number) => {
    navigate(`/designs/${designId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="bg-white shadow-md w-64 h-screen sticky top-0 overflow-y-auto">
        <div className="flex items-center justify-center py-6 border-b">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src="https://via.placeholder.com/150"
              alt="User Avatar"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h2 className="text-lg font-bold">
              {userData ? userData.userName : "Loading..."}
            </h2>
            <p className="text-gray-500 text-sm">
              {userData ? userData.role : ""}
            </p>
          </div>
        </div>
        <nav className="mt-4">
          <div className="px-4">
            <div className="flex flex-col space-y-2">
              <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
                <Layout className="w-5 h-5 mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => navigate("/submit-feedback")}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Upload className="w-5 h-5 mr-3" />
                Submit Feedback
              </button>
              <button
                onClick={() => navigate("/all-designs")}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Image className="w-5 h-5 mr-3" />
                All Designs
              </button>
              <button
                onClick={() => navigate("/all-designers")}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Users className="w-5 h-5 mr-3" />
                All Designers
              </button>
              <button
                onClick={() => navigate("/chat")}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Chat
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </button>
            </div>
          </div>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-4 p-8">
        {/* Header Section with Search and Filter Options */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search designs..."
              className="border border-gray-300 rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 ml-4 w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {/* Add categories as needed */}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="ml-4">
            <Button
              onClick={() => setViewMode("grid")}
              variant={viewMode === "grid" ? "default" : "outline"}
              className="mr-2"
            >
              Grid View
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              variant={viewMode === "list" ? "default" : "outline"}
            >
              List View
            </Button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="loader">Loading...</div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div
            className={`grid ${
              viewMode === "grid" ? "grid-cols-3" : "grid-cols-1"
            } gap-6`}
          >
            {filteredDesigns.length > 0 ? (
              filteredDesigns.map((design) => (
                <Card
                  key={design._id}
                  className="hover:shadow-[0_0_10px_2px_rgba(255,105,180,0.8)] hover:border-pink-500 hover:bg-pink-50 border transition"
                >
                  <CardHeader>
                    <CardTitle>{design.designTitle}</CardTitle>
                    <p className="text-gray-500">{design.description}</p>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={design.designInput}
                      alt={design.designTitle}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm text-gray-500">
                        {design.createdByName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(design.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleViewDesign(design.designId)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Design
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 text-center w-full">
                No designs found.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
