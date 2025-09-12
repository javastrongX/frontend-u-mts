
import {
  Box,
  Container,
  VStack
} from '@chakra-ui/react';
import { MessageHeader } from './MessageHeader';
import TabsSection from './TabsSection';
import { TabsSkeleton, DateSectionSkeleton } from './skeletons/Skeletons';

const MobileView = ({
  activeTab,
  isInitialLoading,
  isTabLoading,
  navigate,
  handleTabChange,
  ordersData,
  tabsConfig
}) => {
  return (
    <>
      <MessageHeader 
        isInitialLoading={isInitialLoading}
        navigate={navigate}
        isDesktop={false}
      />
      
      <Box pt="100px">
        <Container maxW="container.xl">
          {isInitialLoading ? (
            <>
              <TabsSkeleton />
              <VStack spacing="6" align="stretch">
                {[1, 2, 3].map((item) => (
                  <DateSectionSkeleton key={item} />
                ))}
              </VStack>
            </>
          ) : (
            <TabsSection
              activeTab={activeTab}
              isTabLoading={isTabLoading}
              handleTabChange={handleTabChange}
              ordersData={ordersData}
              tabsConfig={tabsConfig}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

export default MobileView;