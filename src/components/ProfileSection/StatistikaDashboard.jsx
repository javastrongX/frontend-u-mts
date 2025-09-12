import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Badge,
  VStack,
  HStack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Container,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

import { 
  IoEyeOutline, 
  IoCallOutline, 
  IoMailOutline, 
  IoShareOutline, 
  IoHeartOutline,
  IoRefreshOutline
} from 'react-icons/io5';
import { MdOutlineAdsClick } from "react-icons/md";

import { useTranslation } from 'react-i18next';

// Mock Data
const mockData = {
  views: {
    total: 247,
    chartData: [
      { date: "6 Июнь", value: 20 },
      { date: "7 Июнь", value: 35 }, 
      { date: "8 Июнь", value: 28 },
      { date: "9 Июнь", value: 42 },
      { date: "10 Июнь", value: 18 },
      { date: "11 Июнь", value: 55 },
      { date: "12 Июнь", value: 31 },
      { date: "13 Июнь", value: 38 },
      { date: "14 Июнь", value: 25 },
      { date: "15 Июнь", value: 45 },
      { date: "16 Июнь", value: 52 },
      { date: "17 Июнь", value: 29 },
      { date: "18 Июнь", value: 48 },
      { date: "19 Июнь", value: 37 },
      { date: "20 Июнь", value: 41 }
    ]
  },
  calls: {
    total: 42,
    chartData: [
      { date: "6 Июнь", value: 2 },
      { date: "7 Июнь", value: 5 }, 
      { date: "8 Июнь", value: 3 },
      { date: "9 Июнь", value: 7 },
      { date: "10 Июнь", value: 1 },
      { date: "11 Июнь", value: 8 },
      { date: "12 Июнь", value: 4 },
      { date: "13 Июнь", value: 6 },
      { date: "14 Июнь", value: 2 },
      { date: "15 Июнь", value: 9 },
      { date: "16 Июнь", value: 3 },
      { date: "17 Июнь", value: 5 },
      { date: "18 Июнь", value: 7 },
      { date: "19 Июнь", value: 4 },
      { date: "20 Июнь", value: 6 }
    ]
  },

  clicked: {
    total: 8,
    chartData: [
      { date: "6 Июнь", value: 0 },
      { date: "7 Июнь", value: 1 }, 
      { date: "8 Июнь", value: 0 },
      { date: "9 Июнь", value: 2 },
      { date: "10 Июнь", value: 1 },
      { date: "11 Июнь", value: 0 },
      { date: "12 Июнь", value: 1 },
      { date: "13 Июнь", value: 2 },
      { date: "14 Июнь", value: 0 },
      { date: "15 Июнь", value: 1 },
      { date: "16 Июнь", value: 0 },
      { date: "17 Июнь", value: 0 },
      { date: "18 Июнь", value: 1 },
      { date: "19 Июнь", value: 0 },
      { date: "20 Июнь", value: 0 }
    ]
  },

  messages: {
    total: 18,
    chartData: [
      { date: "6 Июнь", value: 1 },
      { date: "7 Июнь", value: 3 }, 
      { date: "8 Июнь", value: 2 },
      { date: "9 Июнь", value: 0 },
      { date: "10 Июнь", value: 4 },
      { date: "11 Июнь", value: 2 },
      { date: "12 Июнь", value: 1 },
      { date: "13 Июнь", value: 5 },
      { date: "14 Июнь", value: 0 },
      { date: "15 Июнь", value: 3 },
      { date: "16 Июнь", value: 1 },
      { date: "17 Июнь", value: 2 },
      { date: "18 Июнь", value: 4 },
      { date: "19 Июнь", value: 0 },
      { date: "20 Июнь", value: 2 }
    ]
  },
  shares: {
    total: 12,
    chartData: [
      { date: "6 Июнь", value: 0 },
      { date: "7 Июнь", value: 2 }, 
      { date: "8 Июнь", value: 1 },
      { date: "9 Июнь", value: 3 },
      { date: "10 Июнь", value: 0 },
      { date: "11 Июнь", value: 1 },
      { date: "12 Июнь", value: 2 },
      { date: "13 Июнь", value: 0 },
      { date: "14 Июнь", value: 1 },
      { date: "15 Июнь", value: 2 },
      { date: "16 Июнь", value: 0 },
      { date: "17 Июнь", value: 1 },
      { date: "18 Июнь", value: 3 },
      { date: "19 Июнь", value: 0 },
      { date: "20 Июнь", value: 1 }
    ]
  },
  favorites: {
    total: 8,
    chartData: [
      { date: "6 Июнь", value: 0 },
      { date: "7 Июнь", value: 1 }, 
      { date: "8 Июнь", value: 0 },
      { date: "9 Июнь", value: 2 },
      { date: "10 Июнь", value: 1 },
      { date: "11 Июнь", value: 0 },
      { date: "12 Июнь", value: 1 },
      { date: "13 Июнь", value: 2 },
      { date: "14 Июнь", value: 0 },
      { date: "15 Июнь", value: 1 },
      { date: "16 Июнь", value: 0 },
      { date: "17 Июнь", value: 0 },
      { date: "18 Июнь", value: 1 },
      { date: "19 Июнь", value: 0 },
      { date: "20 Июнь", value: 0 }
    ]
  }
};

// Mock API service
const apiService = {
  async fetchStatistics() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { statistics: mockData };
  },

  async fetchTabData(tabType, dateRange = '15d') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData[tabType] || { total: 0, chartData: [], details: [] };
  }
};

const StatisticsDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabData, setTabData] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const { t } = useTranslation();

  // Tab konfiguratsiyasi
  const tabConfig = {
    views: {
      icon: IoEyeOutline,
      color: '#FFC107',
      bgColor: '#FFD700',
      name: t("Statistics.views", 'Просмотры'),
      apiKey: 'views'
    },
    clicked: {
      icon: MdOutlineAdsClick,
      color: '#9431ce',
      bgColor: '#ed63a6',
      name: t("Statistics.clicks", 'Клик по объявлению'),
      apiKey: 'clicked'
    },
    calls: {
      icon: IoCallOutline,
      color: '#3182CE',
      bgColor: '#63B3ED',
      name: t("Statistics.calls", 'Позвонили'),
      apiKey: 'calls'
    },
    messages: {
      icon: IoMailOutline,
      color: '#38A169',
      bgColor: '#68D391',
      name: t("Statistics.messages", 'Написали'),
      apiKey: 'messages'
    },
    shares: {
      icon: IoShareOutline,
      color: '#805AD5',
      bgColor: '#B794F6',
      name: t("Statistics.shared", 'Поделились'),
      apiKey: 'shares'
    },
    favorites: {
      icon: IoHeartOutline,
      color: '#E53E3E',
      bgColor: '#FC8181',
      name: t("Statistics.favorites", 'Избранные'),
      apiKey: 'favorites'
    }
  };

  const tabKeys = Object.keys(tabConfig);

  // API dan ma'lumot olish
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Barcha tab ma'lumotlarini parallel ravishda olish
      const promises = tabKeys.map(async (key) => {
        const data = await apiService.fetchTabData(tabConfig[key].apiKey);
        return { key, data };
      });
      
      const results = await Promise.all(promises);
      
      // Ma'lumotlarni state ga joylash
      const newTabData = {};
      results.forEach(({ key, data }) => {
        newTabData[key] = {
          ...tabConfig[key],
          count: data.total || 0,
          data: data.chartData || [],
          details: data.details || []
        };
      });
      
      setTabData(newTabData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ma'lumotlarni yangilash
  const refreshData = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Component yuklanishida ma'lumot olish
  useEffect(() => {
    fetchData();
  }, []);

  // Aktiv tab ma'lumotlari
  const currentTabData = tabData[tabKeys[activeTab]] || {
    count: 0,
    data: [],
    details: [],
    color: '#000',
    bgColor: '#ccc'
  };

  const maxValue = Math.max(...(currentTabData.data.map(d => d.value) || [1])) || 1;


  const handleTabChange = (index) => {
    setActiveTab(index);
    refreshData()
    setHoveredBar(null);
  };

  // CSS for spin animation
  const spinKeyframes = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = spinKeyframes;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Loading holati
  if (loading) {
    return (
      <Box 
        bg="gray.50" 
        minH="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text fontSize="lg" color="gray.600">{t("Statistics.loading", 'Ma`lumotlar yuklanmoqda...')}</Text>
        </VStack>
      </Box>
    );
  }

  // Error holati
  if (error) {
    return (
      <Box bg="gray.50" minH="100vh" p={6}>
        <Container maxW="container.md" centerContent>
          <Alert status="error" borderRadius="xl" p={6}>
            <AlertIcon />
            <Box>
              <AlertTitle>{t("Statistics.error", 'Xatolik yuz berdi!')}</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Box>
          </Alert>
        </Container>
      </Box>
    );
  }

  const renderChart = () => (
    <Box
      bg="gray.50"
      p={3}
      borderRadius="2xl"
      border="2px solid"
      borderColor="gray.100"
      position="relative"
      overflow="hidden"
    >
      {/* Grid lines */}
      <Box position="absolute" top="0" left="0" right="0" bottom="0" opacity="0.3">
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            position="absolute"
            left="0"
            right="0"
            top={`${(i + 1) * 20}%`}
            height="1px"
            bg="gray.200"
          />
        ))}
      </Box>

      <Flex p={3} overflowX="auto" overflowY="hidden" align="end" justify="space-between" h="270px" gap={2} position="relative" zIndex={1}>
        {currentTabData.data.map((item, idx) => {
          const barHeight = Math.max((item.value / maxValue) * 180, item.value > 0 ? 24 : 8);
          const isHovered = hoveredBar === idx;
          
          return (
            <VStack key={idx} spacing={3} flex="1" maxW="40px">
              <Box
                bg={item.value > 0 ? currentTabData.color : 'gray.300'}
                w="100%"
                maxW="32px"
                h={`${barHeight}px`}
                borderRadius="lg"
                position="relative"
                cursor="pointer"
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
                transform={isHovered ? 'scaleY(1.05) scaleX(1.1)' : 'scaleY(1) scaleX(1)'}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                boxShadow={isHovered ? `0 8px 25px ${currentTabData.color}40` : item.value > 0 ? `0 4px 15px ${currentTabData.color}30` : 'none'}
              >
                {item.value > 0 && (
                  <Text
                    position="absolute"
                    top="-35px"
                    left="50%"
                    transform="translateX(-50%)"
                    fontSize="sm"
                    fontWeight="bold"
                    color={currentTabData.color}
                    bg="white"
                    px={3}
                    py={1}
                    borderRadius="lg"
                    boxShadow="md"
                    opacity={isHovered ? 1 : 0.9}
                    transition="opacity 0.2s"
                    border="2px solid"
                    borderColor={currentTabData.color}
                  >
                    {item.value}
                  </Text>
                )}
              </Box>
              <Text 
                fontSize="xs" 
                color="gray.500" 
                textAlign="center"
                transform="rotate(-45deg)"
                whiteSpace="nowrap"
                minW="max-content"
                opacity={isHovered ? 1 : 0.7}
                transition="opacity 0.2s"
                fontWeight="medium"
              >
                {item.date}
              </Text>
            </VStack>
          );
        })}
      </Flex>
    </Box>
  );

  return (
    <Box 
      bg="gray.50" 
      minH="100vh" 
      p={{ base: 3, md: 6 }}
      py="100px"
    >
      <Box mx="auto" maxW="container.xl">
        <VStack spacing={8} align="stretch">
          
          {/* Refresh tugmasi */}
          <Flex justify="space-between" align="center">
            <Text fontSize="2xl" fontWeight="bold" color="gray.700">
              {t("Statistics.title", 'Панель статистики')}
            </Text>
            <Box
              as="button"
              onClick={refreshData}
              disabled={refreshing}
              p={3}
              borderRadius="xl"
              bg="white"
              boxShadow="md"
              border="2px solid"
              borderColor="gray.200"
              _hover={{ borderColor: "blue.300", transform: "translateY(-2px)" }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
            >
              <IoRefreshOutline 
                size={20} 
                color={refreshing ? "#CBD5E0" : "#3182CE"}
                style={{ 
                  animation: refreshing ? 'spin 1s linear infinite' : 'none' 
                }}
              />
            </Box>
          </Flex>
          
          {/* Main Content */}
          <Box 
            bg="white" 
            borderRadius="3xl" 
            boxShadow="xl"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.200"
          >
            
            {/* Tabs */}
            <Tabs 
              index={activeTab} 
              onChange={handleTabChange}
              variant="unstyled"
            >
              <TabList 
                display="flex" 
                flexWrap="wrap"
                gap={2}
                p={{ base: 3, md: 6 }}
                borderBottom="2px" 
                borderColor="gray.100"
                bg="gray.25"
              >
                {tabKeys.map((key, index) => {
                  const tabInfo = tabData[key] || tabConfig[key];
                  const IconComponent = tabInfo.icon;
                  const isActive = activeTab === index;
                  
                  return (
                    <Tab
                      key={index}
                      bg={isActive ? tabInfo.color : 'gray.100'}
                      color={isActive ? 'white' : 'gray.600'}
                      borderRadius="2xl"
                      px={{ base: 4, sm: 6 }}
                      py={{ base: 3, sm: 4 }}
                      fontSize="sm"
                      fontWeight="bold"
                      boxShadow={isActive ? 'lg' : 'sm'}
                      _hover={{ 
                        transform: 'translateY(-2px)',
                        boxShadow: 'xl',
                        bg: isActive ? tabInfo.color : 'gray.200'
                      }}
                      _active={{ transform: 'translateY(0)' }}
                      transition="all 0.2s"
                    >
                      <HStack spacing={3}>
                        <IconComponent size={18} />
                        <Text display={{ base: "none", sm: "block" }}>
                          {tabInfo.name}
                        </Text>
                        <Badge
                          bg={isActive ? 'whiteAlpha.300' : 'gray.200'}
                          color={isActive ? 'white' : 'gray.600'}
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          {tabInfo.count || 0}
                        </Badge>
                      </HStack>
                    </Tab>
                  );
                })}
              </TabList>

              <TabPanels>
                {tabKeys.map((key, index) => (
                  <TabPanel key={index} p={{ base: 4, md: 6 }}>
                    
                    {/* Stats Summary */}
                    <Grid 
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }} 
                      gap={8} 
                      mb={10}
                    >
                      <GridItem>
                        <Stat>
                          <StatLabel 
                            fontSize="lg" 
                            color="gray.600" 
                            mb={2}
                            fontWeight="medium"
                          >
                            {tabConfig[key].name}: 
                          </StatLabel>
                          <StatNumber 
                            fontSize="5xl" 
                            fontWeight="black" 
                            color={currentTabData.color}
                            textShadow="0 2px 4px rgba(0,0,0,0.1)"
                          >
                            {currentTabData.count}
                          </StatNumber>
                        </Stat>
                      </GridItem>
                    </Grid>

                    {/* Chart */}
                    <Box mb={10}>
                      <Text 
                        fontSize="xl" 
                        fontWeight="bold" 
                        mb={6} 
                        color="gray.700"
                      >
                        {t("Statistics.activityPeriod", 'Активность за последние 15 дней')}
                      </Text>
                      
                      {renderChart()}
                    </Box>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default StatisticsDashboard;