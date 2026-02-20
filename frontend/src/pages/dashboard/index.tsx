import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import AuthenticatedNav from "../../components/AuthenticatedNav";
import Layout from "../../components/Layout";
import BackgroundLogos from "./components/BackgroundLogos";
import Hero from "./components/Hero";
import Announcements from "./components/Announcements";
import Activities from "./components/Activities";
import Merch from "./components/Merch";
import { useAuthStore } from "../../store/auth_store";
import LoadingPage from "../loading";
import ProfileCompletionModal from "../../components/ProfileCompletionModal";
import type { StudentResponse } from "../../interfaces/student/StudentResponse";

const Index = () => {
  const user = useAuthStore((state) => state.user);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Check if profile is incomplete on mount and when user changes
  useEffect(() => {
    if (user && user.role === "STUDENT") {
      const studentUser = user as StudentResponse & { role: "STUDENT" };
      const isProfileIncomplete = !studentUser.user?.isProfileComplete;

      if (isProfileIncomplete) {
        setShowProfileModal(true);
      }
    }
  }, [user]);

  const handleProfileCompleted = (completedUserData: any) => {
    // Update the auth store with the completed profile data
    if (user && user.role === "STUDENT") {
      const studentUser = user as StudentResponse & { role: "STUDENT" };
      const updatedUser = {
        ...studentUser,
        user: {
          ...studentUser.user,
          ...completedUserData.user,
          isProfileComplete: true,
        },
      };

      useAuthStore.getState().setUser(updatedUser);
      setShowProfileModal(false);
    }
  };

  // Show loading until user data is available
  if (!user) {
    return <LoadingPage />;
  }

  // Get studentId safely - only exists on StudentResponse
  const studentId =
    user.role === "STUDENT"
      ? (user as StudentResponse & { role: "STUDENT" }).studentId
      : "";

  return (
    <div className="">
      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        studentId={studentId || ""}
        onCompleted={handleProfileCompleted}
      />

      <Layout overflowHidden={true} withFooter={false}>
        <BackgroundLogos />

        {/* Foreground UI */}
        <AuthenticatedNav />

        <Hero />
      </Layout>

      <div className="min-h-screen w-full bg-black flex justify-center py-20 md:py-56">
        <div className="w-full max-w-[90rem] px-4 md:px-6 text-white space-y-50">
          {/** Announcements Section */}
          <Announcements />

          {/** Activities Section */}
          <Activities />

          {/* Merch Section */}
          <Merch />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
