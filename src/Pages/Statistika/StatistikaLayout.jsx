import { useMemo } from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ProfileDesktopSection from "../../components/ProfileSection/ProfileDesktopSection";
import BottomNav from "../../components/Navigations/BottomNav";
import { useLocation } from "react-router-dom";
import { useProfileTabs } from "../../components/ProfileSection/hooks/useProfileTabs";
import StatisticsDashboard from "../../components/ProfileSection/StatistikaDashboard";
import HeaderForTabs from "../../components/ProfileSection/HeaderForTabs";
import { FaChartLine } from "react-icons/fa";

const StatistikaLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const { activeTab, handleTabChange } = useProfileTabs();
  
  // Breakpoint qiymatini cache qilish
  const isMobile = useBreakpointValue({
    base: true,
    custom570: false
  }, {
    fallback: 'base',
    ssr: false
  });

  // Desktop komponenti memoize qilish
  const desktopContent = useMemo(() => (
    <ProfileDesktopSection
      activeTab={activeTab}
      handleTabChange={handleTabChange}
    >
      <StatisticsDashboard/>
    </ProfileDesktopSection>
  ), [activeTab, handleTabChange]);

  // Mobile komponenti memoize qilish
  const mobileContent = useMemo(() => (
    <Box>
      <HeaderForTabs title="Статистика" subtitle="" MainIcon={FaChartLine} />
      <StatisticsDashboard/>
      <BottomNav />
    </Box>
  ), []);


  if (isMobile === undefined) {
    return null;
  }

  return isMobile ? mobileContent : desktopContent;
};

export default StatistikaLayout;
