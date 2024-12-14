import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserDashboard from "./pages/UserDashboard";
import DesignerDashboard from "./pages/DesignerDashboard";
import SubmitFeedback from "./pages/SubmitFeedback";
import AllDesigns from "./pages/AllDesigns";
import Dashboard from "./pages/DashBoard";
import DesignView from "./pages/DesignView";
import ProfilePage from "./pages/ProfilePage";
import DesignerList from "./pages/DesignerList";
import ChatInterface from "./pages/ChatInterface";
import DesignerAnalytics from "./pages/DesignerAnalytics";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/all-designs" element={<AllDesigns />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/designer-dashboard" element={<DesignerDashboard />} />
        <Route path="/my-dashboard" element={<DesignerAnalytics />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/designs/:designId" element={<DesignView />} />
        <Route path="/all-designers" element={<DesignerList />} />
        <Route path="/submit-feedback" element={<SubmitFeedback />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;
