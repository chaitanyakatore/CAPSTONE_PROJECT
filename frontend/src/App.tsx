// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserDashboard from "./pages/UserDashboard";
import DesignDetail from "./pages/DesignDetail";
import DesignerDashboard from "./pages/DesignerDashboard";
import SubmitFeedback from "./pages/SubmitFeedback"; // Import SubmitFeedback
import AnalyticsDashboard from "./pages/AnalyticsDashboard"; // Import AnalyticsDashboard
import AllDesigns from "./pages/AllDesigns";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/all-designs" element={<AllDesigns />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/designer-dashboard" element={<DesignerDashboard />} />
        <Route path="/design/:id" element={<DesignDetail />} />
        <Route path="/submit-feedback" element={<SubmitFeedback />} />{" "}
        {/* New route */}
        <Route
          path="/analytics-dashboard"
          element={<AnalyticsDashboard />}
        />{" "}
        {/* New route */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;