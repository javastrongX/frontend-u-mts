import { useState, useEffect } from 'react';
import {
  Box,
  useBreakpointValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

// Import components
import MobileView from './MobileView';
import DesktopView from './DesktopView';
import { ordersData, getTabsConfig } from './data/messagesData';

export default function MessagesMobile({isDrawerOpen,setIsDrawerOpen}) {
  const [activeTab, setActiveTab] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const navigate = useNavigate();
  const tabsConfig = getTabsConfig();

  // Always call useBreakpointValue at the top level
  const isDesktop = useBreakpointValue({ base: false, custom570: true });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (index) => {
    if (index !== activeTab) {
      setIsTabLoading(true);
      setActiveTab(index);
      setTimeout(() => {
        setIsTabLoading(false);
      }, 1000);
    }
  };

  const commonProps = {
    activeTab,
    setActiveTab,
    isInitialLoading,
    setIsInitialLoading,
    isTabLoading,
    setIsTabLoading,
    isDrawerOpen,
    setIsDrawerOpen,
    navigate,
    handleTabChange,
    ordersData,
    tabsConfig
  };

  return (
    <>
      <style>
        {`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {isDesktop ? (
        <DesktopView {...commonProps} />
      ) : (
      <Box minH="100vh" bg="gray.50" pb="100px">
          <MobileView {...commonProps} />
      </Box>
      )}
    </>
  );
}