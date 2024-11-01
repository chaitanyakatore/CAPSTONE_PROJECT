// src/pages/UserDashboard.tsx
import React, { useState } from "react"; // Import useState
import DesignCard from "../components/DesignCard";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Set up state for latest designs
  const [latestDesigns, setLatestDesigns] = useState([
    {
      id: 1,
      title: "Design 1",
      description: "Beautiful art",
      imageUrl: "/images/Hero.avif",
      likes: 0,
      dislikes: 0,
    },
    {
      id: 2,
      title: "Design 2",
      description: "Modern aesthetics",
      imageUrl: "/images/Hero.avif",
      likes: 0,
      dislikes: 0,
    },
    {
      id: 3,
      title: "Design 3",
      description: "Classic vibes",
      imageUrl: "/images/Hero.avif",
      likes: 0,
      dislikes: 0,
    },
  ]);

  const bestDesigns = [
    {
      id: 4,
      title: "Best Design 1",
      description: "Award-winning piece",
      imageUrl: "/images/How.jpg",
      likes: 0,
      dislikes: 0,
    },
    {
      id: 5,
      title: "Best Design 2",
      description: "Timeless beauty",
      imageUrl: "/images/How.jpg",
      likes: 0,
      dislikes: 0,
    },
    {
      id: 6,
      title: "Best Design 3",
      description: "Elegant and simple",
      imageUrl: "/images/How.jpg",
      likes: 0,
      dislikes: 0,
    },
  ];

  const handleCardClick = (id: number) => {
    navigate(`/detaildesign/${id}`); // Navigate to the DetailDesign page with the design ID
  };

  const handleLike = (id: number) => {
    setLatestDesigns((prevDesigns) =>
      prevDesigns.map((design) =>
        design.id === id ? { ...design, likes: design.likes + 1 } : design
      )
    );
  };

  const handleDislike = (id: number) => {
    setLatestDesigns((prevDesigns) =>
      prevDesigns.map((design) =>
        design.id === id ? { ...design, dislikes: design.dislikes + 1 } : design
      )
    );
  };

  return (
    <div className="flex">
      <Sidebar name="John Doe" profileImage="/images/user.png" />

      <div className="flex-1 ml-64 min-h-screen bg-gray-50 p-10">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            User Dashboard
          </h1>
          <input
            type="text"
            placeholder="Search designs..."
            className="border rounded-full px-5 py-3 w-72 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Latest Designs Section */}
        <section className="my-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b-2 border-gray-200 pb-2">
            Latest Designs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestDesigns.map((design) => (
              <DesignCard
                key={design.id}
                {...design}
                onClick={() => handleCardClick(design.id)} // Handle card click
                onLike={() => handleLike(design.id)} // Handle like
                onDislike={() => handleDislike(design.id)} // Handle dislike
              />
            ))}
          </div>
        </section>

        {/* Best Designs Section */}
        <section className="my-12">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6 border-b-2 border-gray-200 pb-2">
            Best Designs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestDesigns.map((design) => (
              <DesignCard
                key={design.id}
                {...design}
                onClick={() => handleCardClick(design.id)} // Handle card click
                onLike={() => handleLike(design.id)} // Handle like (if you want this functionality here too)
                onDislike={() => handleDislike(design.id)} // Handle dislike (if you want this functionality here too)
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
