import React, { useState, useEffect } from "react";
import { Users, ArrowLeft, Send, MessageSquare } from "lucide-react";

const groups = [
  { id: "1", name: "Design Team", description: "Creative professionals" },
  { id: "2", name: "Development Team", description: "Tech innovators" },
  { id: "3", name: "Marketing Team", description: "Brand storytellers" },
];

const userIcons = [
  { name: "Emma", avatar: "👩‍💻" },
  { name: "Alex", avatar: "👤" },
  { name: "Sam", avatar: "🧑‍🎨" },
];

const ChatInterface: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    {
      groupId: string;
      text: string;
      sender: string;
      timestamp: Date;
    }[]
  >([]);
  const [currentUser, setCurrentUser] = useState(userIcons[0]);

  const handleSendMessage = () => {
    if (message.trim() && selectedGroup) {
      setMessages((prev) => [
        ...prev,
        {
          groupId: selectedGroup,
          text: message,
          sender: currentUser.name,
          timestamp: new Date(),
        },
      ]);
      setMessage("");
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r shadow-xl">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className="flex items-center space-x-3">
            <MessageSquare size={32} />
            <h2 className="text-2xl font-bold">Group Chat</h2>
          </div>
        </div>

        {groups.map((group) => (
          <div
            key={group.id}
            className={`p-4 cursor-pointer transition-all duration-200 border-l-4 
              ${
                selectedGroup === group.id
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-transparent hover:border-gray-300 hover:bg-gray-50"
              }`}
            onClick={() => setSelectedGroup(group.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{group.name}</h3>
                <p className="text-sm text-gray-500">{group.description}</p>
              </div>
              {selectedGroup === group.id && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Navigation */}
        <div className="flex items-center justify-between p-4 bg-white shadow-md">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                /* Implement actual navigation */
              }}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
            >
              <ArrowLeft />
            </button>
            <h2 className="text-xl font-semibold">
              {selectedGroup
                ? groups.find((g) => g.id === selectedGroup)?.name
                : "Select a Group"}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <Users className="text-gray-500" />
            {userIcons.map((user, idx) => (
              <div
                key={idx}
                className={`text-3xl cursor-pointer 
                  ${
                    currentUser.name === user.name
                      ? "ring-2 ring-blue-500 rounded-full"
                      : "opacity-60 hover:opacity-100"
                  }`}
                onClick={() => setCurrentUser(user)}
                title={user.name}
              >
                {user.avatar}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Display */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {selectedGroup ? (
            messages
              .filter((msg) => msg.groupId === selectedGroup)
              .map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === currentUser.name
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md p-3 rounded-lg shadow-md ${
                      msg.sender === currentUser.name
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold mr-2">
                        {msg.sender === currentUser.name ? "You" : msg.sender}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>
                    {msg.text}
                  </div>
                </div>
              ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
              <MessageSquare size={64} className="mb-4 opacity-50" />
              <p className="text-xl">Select a group to start chatting</p>
              <p className="text-sm">Choose a team from the sidebar</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        {selectedGroup && (
          <div className="p-4 bg-white border-t">
            <div className="flex space-x-3 items-center">
              <div className="flex-grow">
                <input
                  type="text"
                  value={message}
                  placeholder={`Message ${
                    groups.find((g) => g.id === selectedGroup)?.name
                  }`}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50 transition"
              >
                <Send />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
