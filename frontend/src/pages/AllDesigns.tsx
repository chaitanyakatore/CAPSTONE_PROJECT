import React, { useState, useEffect } from "react";
import {
  Loader2,
  AlertCircle,
  Search,
  Sliders,
  Heart,
  Bookmark,
  MessageSquare,
  User,
} from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";

interface Design {
  _id: string;
  designId: number;
  designInput: string;
  designTitle: string;
  description: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  likeCount?: number;
  commentCount?: number;
}

const DesignCard: React.FC<Design & { onLike: () => void }> = ({
  designTitle,
  description,
  createdByName,
  likeCount = 0,
  commentCount = 0,
  designInput,
  onLike,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl">
      <img
        src={designInput}
        alt={designTitle}
        className="w-full h-64 object-cover object-center"
        onError={(e) => {
          e.currentTarget.src = "/images/Hero.avif"; // Fallback image
        }}
      />
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800">{designTitle}</h3>
        <p className="text-gray-600 mt-2 line-clamp-2">{description}</p>
        <div className="flex items-center mt-3 text-sm text-gray-500">
          <User className="w-4 h-4 mr-2" />
          {createdByName}
        </div>
        <div className="flex items-center justify-between mt-4 border-t pt-3">
          <button
            onClick={onLike}
            className="flex items-center text-pink-600 hover:bg-pink-50 px-2 py-1 rounded-full"
          >
            <Heart className="w-5 h-5 mr-2" />
            <span>{likeCount} Likes</span>
          </button>
          <button className="flex items-center text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-full">
            <MessageSquare className="w-5 h-5 mr-2" />
            <span>{commentCount} Comments</span>
          </button>
          <button
            onClick={toggleBookmark}
            className={`flex items-center ${
              isBookmarked ? "text-blue-600" : "text-gray-500"
            } hover:bg-blue-50 px-2 py-1 rounded-full`}
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const SocialDesigns = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3002/api/designs");
      if (!response.ok) throw new Error("Failed to fetch designs");
      const data: Design[] = await response.json();
      setDesigns(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (id: string) => {
    setDesigns((prevDesigns) =>
      prevDesigns.map((design) =>
        design._id === id
          ? { ...design, likeCount: (design.likeCount || 0) + 1 }
          : design
      )
    );
  };

  const handleDashboardRedirect = () => {
    // Assuming you have a way to get the user's role from a token
    const token = localStorage.getItem("token"); // Replace with your actual token retrieval method

    // You would typically decode the token to get the roleId
    // This is a placeholder - replace with actual token decoding logic
    const roleId = token ? JSON.parse(atob(token.split(".")[1])).roleId : null;

    if (roleId === 1) {
      window.location.href = "/user-dashboard";
    } else if (roleId === 2) {
      window.location.href = "/designer-dashboard";
    } else {
      alert("Unable to determine user role");
    }
  };

  const filteredAndSortedDesigns = designs
    .filter((design) =>
      design.designTitle.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "rating":
          return (b.likeCount || 0) - (a.likeCount || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="sticky top-0 z-50 bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Design Feed
        </h1>
        <Button onClick={handleDashboardRedirect}>My Dashboard</Button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search designs..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <Sliders className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedDesigns.map((design) => (
              <DesignCard
                key={design._id}
                {...design}
                onLike={() => handleLike(design._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialDesigns;
