import { useCallback, useMemo } from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ProfileDesktopSection from "../../components/ProfileSection/ProfileDesktopSection";
import ProfileMobileSection from "../../components/ProfileSection/ProfileMobileSection";
import BottomNav from "../../components/Navigations/BottomNav";
import { TabContent } from "../../components/ProfileSection/TabContent";
import { useLocation } from "react-router-dom";
import { useProfileTabs } from "../../components/ProfileSection/hooks/useProfileTabs";

const ProfileLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Use the enhanced hook with router integration
  const { activeTab, handleTabChange } = useProfileTabs();
  
  const forceDesktop = location.pathname === "/profile/settings";

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