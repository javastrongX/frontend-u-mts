import { useMemo } from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import ProfileDesktopSection from "../../components/ProfileSection/ProfileDesktopSection";
import ProfileMobileSection from "../../components/ProfileSection/ProfileMobileSection";
import BottomNav from "../../components/Navigations/BottomNav";
import { TabContent } from "../../components/ProfileSection/TabContent";
import { Navigate, useLocation } from "react-router-dom";
import { useProfileTabs } from "../../components/ProfileSection/hooks/useProfileTabs";
import { useAuth } from "../Auth/logic/AuthContext";
import SideTranslator from "../SideTranslator";

const ProfileLayout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace={true} />
  }

  // Use the enhanced hook with router integration
  const { activeTab, handleTabChange } = useProfileTabs();
  
  const forceDesktop = ["/profile/settings", "/company", "/company-settings", "/leads", "/my-application", "/my-products", "/contacts", "/documents", "/company-news", "/company-accounts"].includes(location.pathname);
  // Breakpoint qiymatini cache qilish
  const isMobile = useBreakpointValue({
    base: true,
    custom570: false
  }, {
    fallback: 'base',
    ssr: false
  });

  // Desktop komponenti memoize qilish - currentRoute ni olib tashladik
  const desktopContent = useMemo(() => (
    <ProfileDesktopSection
      activeTab={activeTab}
      handleTabChange={handleTabChange}
    >
      <TabContent activeTab={activeTab} />
    </ProfileDesktopSection>
  ), [activeTab, handleTabChange]); // currentRoute ni olib tashladik

  // Mobile komponenti memoize qilish
  const mobileContent = useMemo(() => (
    <Box>
      <SideTranslator />
      {activeTab === 'profile' ? (
        <ProfileMobileSection
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
      ) : (
        <TabContent activeTab={activeTab} />
      )}
      <BottomNav />
    </Box>
  ), [activeTab, handleTabChange]);

  // Loading state
  if (isMobile === undefined) {
    return null;
  }

  return forceDesktop ? desktopContent : (isMobile ? mobileContent : desktopContent);
};

export default ProfileLayout;