import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Text,
  Button,
  Flex,
  VStack,
  HStack,
  Grid,
  GridItem,
  Center,
  useBreakpointValue,
  Container,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
  SkeletonText
} from "@chakra-ui/react";

import { ProductCardGrid } from './ProductCardGrid';
import { ProductCardList } from './ProductCardList';
import { mockData } from "./mokdata";
import { ListingHeader } from './ListingHeader';
import { RightSidebar } from '../RightSidebar';
import Pagination from './Pagination';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from "react-router-dom";
import { t } from 'i18next';

const LIMIT = 20; // Sahifa element soni

const formatDate = (dateString) => {
  if (!dateString) return 'Sana ko\'rsatilmagan';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Noto\'g\'ri sana';
    
    const day = date.getDate();
    const monthNames = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
    const month = monthNames[date.getMonth()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day} ${month} ${hours}:${minutes}`;
  } catch (error) {
    return 'Sana xatosi';
  }
};

// Loading Skeleton Component
const ProductSkeleton = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="sm"
        border="1px"
        borderColor="gray.200"
        p={4}
      >
        <VStack align="stretch" spacing={3}>
          <Flex justify="space-between" align="flex-start">
            <SkeletonText noOfLines={2} flex={1} mr={4} />
            <Skeleton height="32px" width="120px" />
          </Flex>
          <SkeletonText noOfLines={2} />
          <Skeleton height="20px" width="100px" />
          <Flex justify="space-between">
            <HStack spacing={3}>
              <Skeleton height="16px" width="80px" />
              <Skeleton height="16px" width="100px" />
            </HStack>
            <Skeleton height="16px" width="60px" />
          </Flex>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      h="180px"
      borderRadius="md"
      boxShadow="sm"
      border="1px"
      borderColor="gray.200"
      p={4}
    >
      <VStack spacing={2} h="full" justify="space-between">
        <Flex justify="space-between" w="full">
          <SkeletonText noOfLines={2} flex={1} />
          <Skeleton height="24px" width="60px" />
        </Flex>
        <SkeletonText noOfLines={2} w="full" />
        <Skeleton height="16px" width="80px" alignSelf="flex-start" />
        <Flex justify="space-between" w="full">
          <Skeleton height="14px" width="60px" />
          <Skeleton height="14px" width="40px" />
        </Flex>
      </VStack>
    </Box>
  );
};

// Error Component
const ErrorState = ({ onRetry }) => (
  <Alert status="error" borderRadius="lg">
    <AlertIcon />
    <Box>
      <AlertTitle>{t("orderlist.error", "Произошла ошибка!")}</AlertTitle>
      <AlertDescription>
        {t("orderlist.error_msg", "Произошла ошибка при загрузке данных.")}
        <Button 
          size="sm" 
          colorScheme="red" 
          variant="outline" 
          ml={3}
          onClick={onRetry}
        >
          {t("orderlist.retry", "Повторить")}
        </Button>
      </AlertDescription>
    </Box>
  </Alert>
);

// Empty State Component
const EmptyState = () => (
  <Center py={16}>
    <VStack spacing={4}>
      <Box fontSize="4xl">📦</Box>
      <VStack spacing={2}>
        <Text fontSize="xl" fontWeight="semibold" color="gray.600">
          {t("orderlist.no_data", "Заказы не найдены")}
        </Text>
        <Text fontSize="md" color="gray.500" textAlign="center">
          {t("orderlist.no_order_msg", "Пока нет никаких заказов")}
        </Text>
      </VStack>
    </VStack>
  </Center>
);

// Main Listing Component
const EquipmentListing = ({ 
  activeTab: propActiveTab,
  setTotalProducts, 
  refreshKey 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // URL dan active tab ni olish
  const getActiveTabFromUrl = () => {
    const urlParams = new URLSearchParams(location.search);
    return parseInt(urlParams.get('category_id')) || 0;
  };

  // URL dan sahifa parametrini olish
  const getPageFromUrl = () => {
    const urlParams = new URLSearchParams(location.search);
    return parseInt(urlParams.get('page')) || 1;
  };

  const [viewMode, setViewMode] = useState('list');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Active tab ni prop yoki URL dan olish
  const [activeTab, setActiveTab] = useState(() => {
    return propActiveTab !== undefined ? propActiveTab : getActiveTabFromUrl();
  });
  
  // Pagination state - URL dan olish
  const [currentPage, setCurrentPage] = useState(getPageFromUrl());
  
  const toast = useToast();
  const gridColumns = useBreakpointValue({ 
    base: 'repeat(1, 1fr)',
    custom900: 'repeat(2, 1fr)'
  });

  // Pagination uchun hisoblangan qiymatlar
  const totalPages = Math.ceil(totalCount / LIMIT);

  // URL dan active tab ni handle qilish
  useEffect(() => {
    if (propActiveTab === undefined) {
      const urlParams = new URLSearchParams(location.search);
      const categoryFromUrl = parseInt(urlParams.get('category_id')) || 0;
      setActiveTab(categoryFromUrl);
    }
  }, [location.search, propActiveTab]);

  // Prop activeTab o'zgarganda
  useEffect(() => {
    if (propActiveTab !== undefined && propActiveTab !== activeTab) {
      setActiveTab(propActiveTab);
      setCurrentPage(1); // Reset to first page when tab changes
    }
  }, [propActiveTab, activeTab]);

  // Browser back/forward button uchun
  useEffect(() => {
    if (propActiveTab === undefined) {
      const handlePopState = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = parseInt(urlParams.get('category_id')) || 0;
        const pageFromUrl = parseInt(urlParams.get('page')) || 1;
        setActiveTab(categoryFromUrl);
        setCurrentPage(pageFromUrl);
      };

      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [propActiveTab]);

  // Active tab o'zgarganda URL ni yangilash
  const handleTabChange = useCallback((newTab) => {
    setActiveTab(newTab);
    setCurrentPage(1); // Reset to first page
    
    // URL ni har doim yangilash (prop bo'lsa ham bo'lmasa ham)
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('category_id', newTab.toString());
    urlParams.set('page', '1'); // Reset page to 1
    navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
  }, [navigate, location]);

  // Sahifa o'zgarganda URL ni yangilash
  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      
      if (propActiveTab === undefined) {
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('page', newPage.toString());
        navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
      }
      
      // Sahifa o'zgarishida yuqoriga scroll qilish
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, totalPages, navigate, location, propActiveTab]);

  // Load data function with pagination and category filter
  const loadData = useCallback(async (page = currentPage, categoryId = activeTab) => {
    setLoading(true);
    setError(null);
    
    try {
      const offset = (page - 1) * LIMIT;
      
      // Kategoriya parametrini qo'shish (category_id ishlatamiz)
      const categoryParam = categoryId > 0 ? `&category_id=${categoryId}` : '';
      
      // Real API call with category filter
      const res = await fetch(`/api/equipment/paginated?limit=${LIMIT}&offset=${offset}${categoryParam}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data && data.equipment) {
        setProducts(data.equipment);
        setTotalCount(data.total || 0);
        
        // Parent componentga total products ni berish
        if (setTotalProducts) {
          setTotalProducts(data.total || 0);
        }
      } else {
        // Fallback to mock data agar API ishlamasa
        console.warn('API ishlamadi, mock data ishlatilmoqda');
        const mockStart = offset;
        const mockEnd = offset + LIMIT;
        let mockProducts = mockData?.data?.slice(mockStart, mockEnd) || [];
        
        // Mock data uchun kategoriya filter (agar kerak bo'lsa)
        if (categoryId > 0 && mockProducts.length > 0) {
          mockProducts = mockProducts.filter(product => product.category_id === categoryId);
        }
        
        setProducts(mockProducts);
        const mockTotal = mockData?.data?.length || 0;
        setTotalCount(mockTotal);
        
        if (setTotalProducts) {
          setTotalProducts(mockTotal);
        }
      }
    } catch (err) {
      console.error('API xatosi:', err);
      setError(err.message);
      
      // Fallback to mock data
      try {
        const mockStart = (page - 1) * LIMIT;
        const mockEnd = mockStart + LIMIT;
        let mockProducts = mockData?.data?.slice(mockStart, mockEnd) || [];
        
        // Mock data uchun kategoriya filter
        if (categoryId > 0 && mockProducts.length > 0) {
          mockProducts = mockProducts.filter(product => product.category_id === categoryId);
        }
        
        setProducts(mockProducts);
        const mockTotal = mockData?.data?.length || 0;
        setTotalCount(mockTotal);
        
        if (setTotalProducts) {
          setTotalProducts(mockTotal);
        }
        
        toast({
          title: t("orderlist.warn", "Предупреждение"),
          description: t("orderlist.warn_msg", "Проблема с подключением к серверу, отображаются демо-данные"),
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      } catch (mockErr) {
        toast({
          bg: "red.100",
          title: t("orderlist.no_order", "Заказы не найдены"),
          description: t("orderlist.error_msg", "Произошла ошибка при загрузке данных"),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTab, toast, setTotalProducts]);

  // activeTab o'zgarganda ma'lumotlarni qayta yuklash
  useEffect(() => {
    loadData(currentPage, activeTab);
  }, [activeTab, loadData]);

  // Sahifa o'zgarganda ma'lumotlarni qayta yuklash
  useEffect(() => {
    loadData(currentPage, activeTab);
  }, [currentPage, loadData]);

  // refreshKey o'zgarganda ma'lumotlarni qayta yuklash
  useEffect(() => {
    if (refreshKey > 0) {
      loadData(currentPage, activeTab);
    }
  }, [refreshKey, loadData, currentPage, activeTab]);

  // Initial load
  useEffect(() => {
    loadData(currentPage, activeTab);
  }, []); // Faqat component mount bo'lganda

  // Event handlers
  const handlePhoneClick = useCallback((phone) => {
    if (phone) {
      toast({
        title: t("orderlist.phone", "Номер телефона"),
        description: `${t("orderlist.phone_desc", "Номер:")} ${phone}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: t("orderlist.phone_err", "Номер телефона отсутствует"),
        description: t("orderlist.phone_err_desc", "Для этого заказа не указан номер телефона"),
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  const handleRefresh = useCallback(() => {
    loadData(currentPage, activeTab);
  }, [loadData, currentPage, activeTab]);

  // Memoized components
  const productCards = useMemo(() => {
    return products.map((product, index) => {
      // MobileHotOfferSection kabi unique key yaratish
      const uniqueKey = `${product.id}-${index}-${currentPage}-${activeTab}-${refreshKey}`;
      
      if (viewMode === 'list') {
        return (
          <ProductCardList 
            key={uniqueKey}
            product={product}
            onPhoneClick={handlePhoneClick}
            isLoading={false}
            formatDate={formatDate}
          />
        );
      } else {
        return (
          <GridItem key={uniqueKey}>
            <ProductCardGrid 
              product={product}
              onPhoneClick={handlePhoneClick}
              formatDate={formatDate}
            />
          </GridItem>
        );
      }
    });
  }, [products, viewMode, handlePhoneClick, currentPage, activeTab, refreshKey]);

  // Loading skeletons
  const loadingSkeletons = useMemo(() => {
    const skeletonCount = viewMode === 'list' ? 5 : 8;
    return Array.from({ length: skeletonCount }, (_, index) => (
      <GridItem key={`skeleton-${index}`}>
        <ProductSkeleton viewMode={viewMode} />
      </GridItem>
    ));
  }, [viewMode]);

  if (error && !loading && products.length === 0) {
    return (
      <Box minH="100%" bg="gray.50" p={4}>
        <Container maxW="100%">
          <ErrorState onRetry={handleRefresh} />
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" maxW={'75rem'} pb={{ base: "80px", lg: "30px" }}>
      <Box maxW="100%" mt={4}>
        <ListingHeader 
          totalCount={totalCount} 
          viewMode={viewMode} 
          setViewMode={setViewMode}
          onRefresh={handleRefresh}
          isLoading={loading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setActivePage={handleTabChange}
        />
        {/* Sahifa va umumiy ma'lumotlar */}
        {!loading && totalCount > 0 && (
          <Flex justify="space-between" align="center" mb={4} px={2}>
            <Text fontSize="sm" color="gray.600">
              {totalCount} {t("orderlist.count_equipment", "оборудования найдено")}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {t("orderlist.page", "Страница")} {currentPage} / {totalPages}
            </Text>
          </Flex>
        )}
      </Box>

      <Flex 
        gap={2} 
        alignItems="flex-start" 
        maxW="100%"
      >
        <Box 
          flex="1"
          minW="0"
          w="100%"
        >
          {loading ? (
            viewMode === 'list' ? (
              <VStack spacing={3} align="stretch" w="100%">
                {loadingSkeletons}
              </VStack>
            ) : (
              <Grid templateColumns={gridColumns} gap={3} w="100%">
                {loadingSkeletons}
              </Grid>
            )
          ) : products.length > 0 ? (
            <>
              {viewMode === 'list' ? (
                <VStack spacing={3} align="stretch" w="100%">
                  {productCards}
                </VStack>
              ) : (
                <Grid templateColumns={gridColumns} gap={3} w="100%">
                  {productCards}
                </Grid>
              )}
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </Box>
        
        <Box 
          display={{base: 'none', custom1080: 'block'}}
          flexShrink={0}
        >
          <RightSidebar vehicle={true}/>
        </Box>
      </Flex>
    </Box>
  );
};

export default EquipmentListing;