import React from 'react';
import {
  Box,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader
} from '@chakra-ui/react';

import DrawerTabs from './DrawerTabs';

const DesktopView = ({
  activeTab,
  isTabLoading,
  isDrawerOpen,
  setIsDrawerOpen,
  handleTabChange,
  ordersData,
  tabsConfig
}) => {
  return (
    <>
      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton size={'lg'} mt={2} mr={2} />
          <DrawerHeader fontSize={'25px'} borderBottomWidth={'1px'}>Сообщения</DrawerHeader>
          <Box pt={"20px"} p={4} height="100%" bg="white" overflowY="auto">
            <DrawerTabs
              activeTab={activeTab}
              isTabLoading={isTabLoading}
              handleTabChange={handleTabChange}
              ordersData={ordersData}
              tabsConfig={tabsConfig}
            />
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DesktopView;
