import React from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Box,
  Text,
  VStack
} from '@chakra-ui/react';
import DateSection from './DateSection';
import { DateSectionSkeleton } from './skeletons/Skeletons';

const TabsSection = ({
  activeTab,
  isTabLoading,
  handleTabChange,
  ordersData,
  tabsConfig
}) => {
  return (
    <Tabs
      index={activeTab}
      onChange={handleTabChange}
      variant="soft-rounded"
      colorScheme="blue"
      isLazy
    >
      <TabList
        mb="8"
        bg="white"
        p="2"
        borderRadius="xl"
        boxShadow="sm"
        overflowX="auto"
        css={{
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'var(--chakra-colors-gray-300)',
            borderRadius: '2px',
          },
        }}
      >
        {tabsConfig.map((tab, index) => {
          const IconComponent = tab.icon;
          return (
            <Tab
              key={tab.key}
              minW="fit-content"
              borderRadius="lg"
              transition="all 0.3s ease"
              _selected={{
                bg: 'blue.500',
                color: 'white',
                transform: 'scale(1.05)'
              }}
              _hover={{
                bg: activeTab !== index && 'blue.50'
              }}
              px="4"
              py="2"
            >
              <HStack spacing="2">
                <Box as={IconComponent} size="16px" />
                <Text fontSize="sm">{tab.label}</Text>
              </HStack>
            </Tab>
          );
        })}
      </TabList>

      <TabPanels>
        <TabPanel p="0">
          {isTabLoading ? (
            <VStack spacing="6" align="stretch">
              {[1, 2, 3].map((item) => (
                <DateSectionSkeleton key={item} />
              ))}
            </VStack>
          ) : (
            <VStack spacing="6" align="stretch">
              {Object.entries(ordersData).map(([date, orders]) => (
                <DateSection 
                  key={date} 
                  date={date} 
                  orders={orders} 
                />
              ))}
            </VStack>
          )}
        </TabPanel>
        
        {tabsConfig.slice(1).map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TabPanel key={tab.key} p="0">
              {isTabLoading ? (
                <Box
                  bg="white"
                  borderRadius="xl"
                  border="2px dashed"
                  borderColor="gray.200"
                  p="20"
                >
                  <VStack spacing="4">
                    <Box as={IconComponent} size="48px" />
                    <Text>Loading...</Text>
                  </VStack>
                </Box>
              ) : (
                <Box
                  textAlign="center"
                  py="20"
                  color="gray.500"
                  bg="white"
                  borderRadius="xl"
                  border="2px dashed"
                  borderColor="gray.200"
                >
                  <Box as={IconComponent} size="48px" mx="auto" mb="4" />
                  <Text fontSize="lg" fontWeight="600" mb="2">
                    {tab.label} бўлими
                  </Text>
                  <Text>
                    Бу бўлим ҳали ишлаб чиқилмоқда
                  </Text>
                </Box>
              )}
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};

export default TabsSection;