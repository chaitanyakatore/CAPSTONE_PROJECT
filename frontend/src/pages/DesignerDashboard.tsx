import React, { useState, useEffect } from "react";
import axios from "axios";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useNavigate } from "react-router-dom";

interface Design {
  _id: string;
  designId: number;
  designInput: string;
  designTitle: string;
  description?: string;
  createdById: number;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
}

const DesignerDashboard = () => {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    designId: number;
    designTitle: string;
    description?: string;
    designInput: File | null;
  }>({
    designId: 0,
    designTitle: "",
    description: "",
    designInput: null,
  });

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Create axios instance with authorization header
  const api = axios.create({
    baseURL: "http://localhost:3002/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    checkAuthAndFetchDesigns();
  }, []);

  const checkAuthAndFetchDesigns = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await fetchDesigns();
    } catch (error) {
      console.error("Initial load error:", error);
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        navigate("/login");
      }
    }
  };

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/designs/user/me");
      setDesigns(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setDesigns([]);
        } else {
          setError(err.response?.data?.message || "Failed to fetch designs");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateDesignId = (): number => {
    return Math.floor(Date.now() / 1000); // Unix timestamp as ID
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.designInput) {
        throw new Error("Please select a file");
      }

      const designId = generateDesignId(); // Generate the ID first

      const formDataToSend = new FormData();
      formDataToSend.append("designId", designId.toString()); // Include designId
      formDataToSend.append("designTitle", formData.designTitle);
      formDataToSend.append("designInput", formData.designInput);
      if (formData.description) {
        formDataToSend.append("description", formData.description);
      }

      const response = await api.post("/designs", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        await fetchDesigns();
        setShowUploadModal(false);
        setFormData({
          designId: 0,
          designTitle: "",
          description: "",
          designInput: null,
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to upload design");
        if (err.response?.status === 401) {
          navigate("/signin");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        designInput: files[0],
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">Design Metrics</h1>
        </div>
        <nav className="mt-6">
          <div className="px-4">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => navigate("/my-dashboard")} // Navigation path updated
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
              >
                <Home className="w-5 h-5 mr-3" /> {/* Home icon */}
                Dashboard
              </button>
              <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
                <Layout className="w-5 h-5 mr-3" />
                My Design
              </button>
              <button
                onClick={() => navigate("/all-designs")}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <LayoutGrid className="w-5 h-5 mr-3" />
                All Designs
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Upload className="w-5 h-5 mr-3" />
                Upload Design
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Layout className="w-5 h-5 mr-3" />
                Analytics
              </button>
              <button
                onClick={() => navigate("/submit-feedback")}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <FileText className="w-5 h-5 mr-3" />
                Upload Feedback
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
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">My Designs</h2>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Upload New Design
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : designs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No designs found. Click "Upload New Design" to add your first
              design.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design) => (
                <Card
                  key={design._id}
                  className="w-full bg-white shadow-md rounded-md"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {design.designTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img src={design.designInput} alt="desing image" />
                    <p className="text-sm text-gray-600">
                      {design.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Likes: {design.likeCount}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-gray-500">
                      {formatDate(design.createdAt)}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Design Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Design</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label
                htmlFor="designTitle"
                className="block text-sm font-semibold"
              >
                Design Title
              </label>
              <input
                type="text"
                id="designTitle"
                name="designTitle"
                value={formData.designTitle}
                onChange={(e) =>
                  setFormData({ ...formData, designTitle: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="designInput"
                className="block text-sm font-semibold"
              >
                Design File (Image)
              </label>
              <input
                type="file"
                id="designInput"
                name="designInput"
                onChange={handleFileChange}
                required
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DesignerDashboard;
