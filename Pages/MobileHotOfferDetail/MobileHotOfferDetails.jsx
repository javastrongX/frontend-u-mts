import { useState, useEffect, useCallback, useMemo, memo, lazy, Suspense } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Text,
  Heading,
  VStack,
  Button,
  Divider,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Card,
  CardBody,
  useToast,
  Center,
  Skeleton,
  ScaleFade,
  SlideFade,
  Flex,
  Stack,
  useBreakpointValue,
  SimpleGrid,
  Image,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  useDisclosure,
  Portal,
  HStack,
} from '@chakra-ui/react';
import {
  FaHeart,
  FaShare,
  FaEye,
  FaCog,
  FaChevronRight,
} from 'react-icons/fa';
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { FiMessageCircle, FiPhone } from 'react-icons/fi';
import { useAuth } from '../Auth/logic/AuthContext';
import { useStats } from '../../components/PostStats';

// Lazy load heavy components
const ProductInfo = lazy(() => import('../HotOfferDetail/ProductInfo').then(module => ({ default: module.ProductInfo })));
const ImageGallery = lazy(() => import('../HotOfferDetail/ImageGallery').then(module => ({ default: module.ImageGallery })));
const SellerInfo = lazy(() => import('../HotOfferDetail/SellerInfo').then(module => ({ default: module.SellerInfo })));
const ContactBottomModal = lazy(() => import('../HotOfferDetail/ContactBottomModal'));
const CallbackModal = lazy(() => import('../../components/CallbackModal').then(module => ({ default: module.CallbackModal })));

// Memoized Breadcrumb Component
const BreadcrumbNav = memo(({ category, title, t }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  
  return (
    <Box bg={cardBg} borderBottom="1px" borderColor="gray.200" shadow="sm" mt={2} borderRadius={'md'}>
      <Box 
        w="100%" 
        px={{ base: 3, sm: 4, md: 6 }} 
        py={{ base: 3, md: 4 }}
      >
        <Breadcrumb
          separator={<FaChevronRight color="gray.500" size="12px" />}
          fontSize={{ base: "xs", sm: "sm" }}
          color="gray.600"
          spacing={{ base: 1, sm: 2 }}
          overflowX="auto"
          whiteSpace="nowrap"
        >
          <BreadcrumbItem flexShrink={0}>
            <BreadcrumbLink 
              href="/" 
              _hover={{ color: "blue.400" }} 
              transition="color 0.2s"
              fontSize={{ base: "xs", sm: "sm" }}
            >
              {t("second_nav.home", "Главная")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {category && (
            <BreadcrumbItem flexShrink={0}>
              <BreadcrumbLink 
                href="/ads?category_id=1" 
                _hover={{ color: "blue.400" }} 
                transition="color 0.2s"
                fontSize={{ base: "xs", sm: "sm" }}
                isTruncated
                maxW={{ base: "120px", sm: "200px" }}
              >
                {category.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          
          <BreadcrumbItem isCurrentPage flexShrink={0}>
            <BreadcrumbLink 
              color="blue.400" 
              fontWeight="medium"
              fontSize={{ base: "xs", sm: "sm" }}
              isTruncated
              maxW={{ base: "100px", sm: "150px" }}
            >
              {title || "Mahsulot"}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
    </Box>
  );
});

// Memoized Characteristics Component
const Characteristics = memo(({ characteristics, t }) => {
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });
  
  const characteristicsList = useMemo(() => {
    if (!characteristics || characteristics.length === 0) return [];
    
    return characteristics.map((char, index) => ({
      id: `${char.characteristic?.id || 'char'}-${char.values?.id || 'val'}-${index}`,
      title: char.characteristic?.title,
      value: char.values?.title,
      unit: char.values?.measurement_unit
    }));
  }, [characteristics]);
  
  if (characteristicsList.length === 0) {
    return (
      <Text color="gray.500" textAlign="center" py={4}>
        {t("HotOfferDetails.noProperties", "Характеристики отсутствуют")}
      </Text>
    );
  }

  return (
    <TableContainer>
      <Table variant="simple" size={tableSize}>
        <Tbody>
          {characteristicsList.map(({ id, title, value, unit }) => (
            <Tr key={id} _hover={{ bg: "gray.50" }}>
              <Td 
                fontWeight="semibold" 
                py={{ base: 3, md: 4 }} 
                borderColor="gray.200"
                fontSize={{ base: 'sm', md: 'md' }}
                width={{ base: '40%', md: '50%' }}
              >
                {title}
              </Td>
              <Td 
                py={{ base: 3, md: 4 }} 
                borderColor="gray.200"
                fontSize={{ base: 'sm', md: 'md' }}
              >
                {value}
                {unit && ` ${unit}`}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
});

// Updated Statistics Component - using PostStats data
const Statistics = memo(({ stats, t }) => {
  const statsData = useMemo(() => {
    if (!stats) return [];
    
    return [
      { 
        icon: FaEye, 
        value: stats.views || 0, 
        label: t("HotOfferDetails.viewed", "Просмотрено"), 
        color: "gray",
        id: 'viewed'
      },
      { 
        icon: FaHeart, 
        value: stats.likes || 0, 
        label: t("HotOfferDetails.saved", "Сохранено"), 
        color: "red",
        id: 'favorite'
      },
      { 
        icon: FaShare, 
        value: stats.shares || 0, 
        label: t("HotOfferDetails.shared", "Поделились"), 
        color: "blue.400",
        id: 'shared'
      }
    ];
  }, [stats, t]);

  if (statsData.length === 0) return null;

  return (
    <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
      {statsData.map(({ id, icon, value, label, color }) => (
        <Flex 
          key={id}
          align="center" 
          justify={{ base: 'center', sm: 'flex-start' }}
          gap={2}
          p={{ base: 2, md: 0 }}
        >
          <Box as={icon} color={color} />
          <Text fontSize={{ base: 'sm', md: 'md' }}>
            {value} {label}
          </Text>
        </Flex>
      ))}
    </SimpleGrid>
  );
});

// Memoized Similar Products Component
const SimilarProducts = memo(({ details, t }) => {
  const similarProductsData = useMemo(() => [
    { id: 1, name: `${t("HotOfferDetails.similarProducts", "Похожие товары")} 1` },
    { id: 2, name: `${t("HotOfferDetails.similarProducts", "Похожие товары")} 2` }
  ], [t]);

  return (
    <Box mt={8}>
      <Heading 
        size={{ base: 'sm', md: 'md' }} 
        mb={6}
        textAlign={{ base: 'center', md: 'left' }}
      >
        {t("HotOfferDetails.youMayAlsoLike", "Смотрите также")}
      </Heading>
      <Box display={'flex'} flexDir={{base: "column", custom380: "row", custom900: "column"}} alignItems={'flex-start'} gap={4}>
        {similarProductsData.map(({ id, name }) => {
          const uniqueKey = `${details.id}-similar-product-${id}-${details.slug}`;
          return (
            <Card 
              key={uniqueKey}
              w="full" 
              borderRadius="xl" 
              _hover={{ transform: "translateY(-2px)" }} 
              transition="all 0.2s"
              cursor="pointer"
            >
              <CardBody p={{ base: 3, md: 4 }}>
                <Stack 
                  direction={{base: "column", custom900: "row"}}
                  align="center"
                  spacing={3}
                >
                  <Image
                    src={"/Images/d-image.png"}
                    alt={name}
                    objectFit="cover"
                    loading="lazy"
                    w={{base: "100%", custom900: "80px"}} 
                    h={{base: "120px", sm: "150px", md: "200px", custom900: "60px"}} 
                    borderRadius="lg"
                    flexShrink={0}
                  />
                  <VStack 
                    align={{ base: 'center', sm: 'start' }} 
                    flex={1}
                    spacing={1}
                  >
                    <Text 
                      fontSize={{ base: 'xs', md: 'sm' }} 
                      fontWeight="semibold"
                      textAlign={{ base: 'center', sm: 'left' }}
                    >
                      {name}
                    </Text>
                    <Text 
                      fontSize={{ base: 'xs', md: 'sm' }} 
                      color="green.600" 
                      fontWeight="bold"
                    >
                      1 000 000 so'm
                    </Text>
                  </VStack>
                </Stack>
              </CardBody>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
});

// Loading Skeleton Component
const LoadingSkeleton = memo(({ containerPadding, gridGap, t }) => (
  <Box>
    <BreadcrumbNav t={t} />
    <Container maxW="container.xl" py={containerPadding}>
      <Grid 
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }} 
        gap={gridGap}
      >
        <GridItem>
          <Skeleton height={{ base: "250px", md: "400px" }} borderRadius="xl" mb={6} />
          <VStack spacing={4} align="start">
            <Skeleton height="40px" width={{ base: "100%", md: "300px" }} />
            <Skeleton height="60px" width={{ base: "150px", md: "200px" }} />
            <Skeleton height="50px" width="100%" />
          </VStack>
        </GridItem>
        <GridItem>
          <Skeleton height={{ base: "150px", md: "200px" }} borderRadius="xl" />
        </GridItem>
      </Grid>
    </Container>
  </Box>
));

// Error Component
const ErrorComponent = memo(({ error, containerPadding, headingSize, t }) => (
  <Box>
    <BreadcrumbNav t={t} />
    <Container minH={'100vh'} maxW="container.xl" py={containerPadding}>
      <Center h="60vh">
        <VStack spacing={6} textAlign="center" px={4}>
          <Box>
            <Heading 
              size={headingSize} 
              color="red.500" 
              mb={4}
            >
              {t("HotOfferDetails.errorOccurred", "Произошла ошибка")}
            </Heading>
            <Text 
              color="gray.600" 
              fontSize={{ base: 'md', md: 'lg' }} 
              mb={6}
            >
              {error}
            </Text>
          </Box>
          <Stack 
            direction={{ base: 'column', sm: 'row' }} 
            spacing={4}
            w={{ base: 'full', sm: 'auto' }}
          >
            <Button 
              onClick={() => window.location.reload()}
              size={{ base: 'md', md: 'lg' }}
              w={{ base: 'full', sm: 'auto' }}
            >
              {t("HotOfferDetails.refreshPage", "Обновить страницу")}
            </Button>
            <Button 
              variant="outline" 
              colorScheme='blue'
              color={'blue.400'}
              onClick={() => window.history.back()}
              size={{ base: 'md', md: 'lg' }}
              w={{ base: 'full', sm: 'auto' }}
            >
              {t("HotOfferDetails.goBack", "Вернуться назад")}
            </Button>
          </Stack>
        </VStack>
      </Center>
    </Container>
  </Box>
));

// Custom hook for API calls
const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  
  const makeRequest = useCallback(async (url, options = {}) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { makeRequest, loading };
};

// Main Component - Optimized with PostStats
const MobileHotOfferDetails = () => {
  const { isAuthenticated } = useAuth();
  const { slug } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { t } = useTranslation();
  const { makeRequest } = useApiRequest();
  
  // PostStats hook - product ID sifatida slug ishlatamiz
  const { stats, isLiked, toggleLike, track } = useStats(slug);
  
  // Responsive values - memoized
  const responsiveValues = useMemo(() => ({
    containerPadding: { base: 4, md: 8 },
    gridGap: { base: 4, md: 6, lg: 8 },
    headingSize: { base: 'md', md: 'lg' }
  }), []);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState('phone');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen: isCallbackOpen, onClose: onCallbackClose, onOpen: onCallbackOpen } = useDisclosure();

  // Transform API data - memoized
  const transformApiData = useCallback((data, t) => ({
    id: data.id,
    title: data.title || t("HotOfferDetails.unknownProduct", "Неизвестный продукт"),
    sub_title: data.sub_title || "",
    description: data.description || t("HotOfferDetails.noDescription", "Описание отсутствует"),
    category: data.category || { title: t("HotOfferDetails.categoryNotSpecified", "Категория не указана") },
    city: data.city || { title: t("HotOfferDetails.cityNotSpecified", "Город не указан") },
    created_at: data.created_at,
    rank_hot_offer: data.rank_hot_offer || false,
    rank_premium: data.rank_premium || false,
    images: data.images || [],
    prices: data.prices || [],
    currency: data.prices?.[0]?.currency || 'uzs',
    phones: data.phones || [],
    characteristics: data.characteristics || [],
    author: data.author || { 
      name: t("HotOfferDetails.unknownAuthor", "Неизвестный автор"), 
      avatar: "", 
      is_company: false, 
      is_official: false 
    },
    slug: data.slug,
    status: data.status,
    stickers: data.stickers || [],
    ad_promotions: data.ad_promotions || []
  }), []);

  // Fetch product details
  const fetchCardsDetail = useCallback(async () => {
    if (!slug) {
      setError(t("HotOfferDetails.productSlugNotFound", "Параметр slug товара не найден"));
      setLoading(false);
      return;
    }

    try {
      const apiResponse = await makeRequest(`/api/ads/${slug}`);
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || t("HotOfferDetails.apiError", "Ошибка API"));
      }

      const data = apiResponse.data;
      if (!data) {
        throw new Error(t("HotOfferDetails.dataEmpty", "Данные пустые"));
      }
      
      const transformedData = transformApiData(data, t);
      setDetails(transformedData);
      
    } catch (err) {
      console.error("Mahsulotni yuklashda xatolik:", err);
      setError(err.message || t("HotOfferDetails.unknownError", "Неизвестная ошибка"));
    } finally {
      setLoading(false);
    }
  }, [slug, makeRequest, transformApiData, t]);

  // Load data on mount
  useEffect(() => {
    fetchCardsDetail();
  }, [fetchCardsDetail]);

  // View tracking - component mount bo'lganda va product yuklanganida
  useEffect(() => {
    if (details?.id && slug) {
      track('views');
    }
  }, [details?.id, slug, track]);

  // Handle like toggle - PostStats ishlatamiz
  const handleLike = useCallback(async () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
      return;
    }
    
    try {
      toggleLike(); // PostStats orqali like toggle qilish
      
      toast({
        title: isLiked 
          ? t("HotOfferDetails.removedFromFavorites", "Удалено из избранного")
          : t("HotOfferDetails.addedToFavorites", "Добавлено в избранное"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      
    } catch (err) {
      console.error("Like toggle error:", err);
      toast({
        title: t("HotOfferDetails.errorOccurred", "Произошла ошибка"),
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isLiked, toggleLike, t, toast, isAuthenticated]);

  // Handle share - PostStats bilan tracking
  const handleShare = useCallback(() => {
    track('shares'); // Share ni track qilish
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: t("HotOfferDetails.linkCopied", "Ссылка скопирована"),
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  }, [track, toast, t]);

  // Handle phone call - PostStats bilan tracking
  const handleCallPhone = useCallback(() => {
    track('calls'); // Call ni track qilish
    setType('phone');
    onOpen();
  }, [track, onOpen]);

  // Handle message - PostStats bilan tracking
  const handleSendMessage = useCallback(() => {
    track('messages'); // Message ni track qilish
    setType('message');
    onOpen();
  }, [track, onOpen]);

  // Handle callback message
  const handleCallbackMessage = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
      return;
    }
    track('messages'); // Message ni track qilish
    onCallbackOpen();
  }, [track, onCallbackOpen, isAuthenticated]);

  // Handle callback submission
  const handleCallbackSubmit = useCallback(async (data) => {
    console.log("Leeds ga yuboradigan api joyi", data);
  }, []);

  // Render loading state
  if (loading) {
    return <LoadingSkeleton containerPadding={responsiveValues.containerPadding} gridGap={responsiveValues.gridGap} t={t} />;
  }

  // Render error state
  if (error) {
    return <ErrorComponent error={error} containerPadding={responsiveValues.containerPadding} headingSize={responsiveValues.headingSize} t={t} />;
  }

  // Render null if no details
  if (!details) return null;

  return (
    <Box py={{base: "80px", md: 0}}>
      <BreadcrumbNav category={details.category} title={details.title} t={t} />
      
      <Box maxW="container.xl" py={responsiveValues.containerPadding}>
        <SlideFade in={true} offsetY="20px">
          <Grid 
            templateColumns={{ base: "1fr", custom900: "2fr 1fr" }} 
            gap={responsiveValues.gridGap}
          >
            {/* Left Column */}
            <GridItem>
              <Suspense fallback={<Skeleton height="400px" borderRadius="xl" />}>
                <ImageGallery images={details.images} title={details.title} />
              </Suspense>
              
              <Suspense fallback={<Skeleton height="200px" />}>
                <ProductInfo 
                  details={details}
                  isLiked={isLiked}
                  onLike={handleLike}
                  onShare={handleShare}
                />
              </Suspense>

              <Divider my={{ base: 6, md: 8 }} />

              {/* Characteristics */}
              <Box>
                <Heading 
                  size={responsiveValues.headingSize} 
                  mb={6} 
                  display="flex" 
                  alignItems="center"
                  flexWrap="wrap"
                  gap={2}
                >
                  <FaCog />
                  <Text>{t("HotOfferDetails.features", "Характеристики")}</Text>
                </Heading>
                <Card borderRadius="xl">
                  <CardBody p={{ base: 4, md: 6 }}>
                    <Characteristics characteristics={details.characteristics} t={t} />
                  </CardBody>
                </Card>
              </Box>

              <Divider my={{ base: 6, md: 8 }} />

              {/* Description */}
              <Box>
                <Heading size={responsiveValues.headingSize} mb={6}>
                  {t("HotOfferDetails.description", "Описание")}
                </Heading>
                <Card borderRadius="xl">
                  <CardBody p={{ base: 4, md: 6 }}>
                    <Text 
                      lineHeight="1.8" 
                      fontSize={{ base: 'sm', md: 'md' }}
                      whiteSpace="pre-wrap"
                    >
                      {details.description}
                    </Text>
                  </CardBody>
                </Card>
              </Box>

              <Divider my={{ base: 6, md: 8 }} />

              {/* Statistics - PostStats dan olingan ma'lumotlar */}
              <Box>
                <Heading size={responsiveValues.headingSize} mb={6}>
                  {t("HotOfferDetails.statistics", "Статистика")}
                </Heading>
                <Card borderRadius="xl">
                  <CardBody p={{ base: 4, md: 6 }}>
                    <Statistics stats={stats} t={t} />
                  </CardBody>
                </Card>
              </Box>
            </GridItem>

            {/* Right Column */}
            <GridItem>
              <ScaleFade in={true} initialScale={0.9}>
                <Suspense fallback={<Skeleton height="200px" borderRadius="xl" />}>
                  <SellerInfo 
                    author={details.author}
                    createdAt={details.created_at}
                  />
                </Suspense>

                <SimilarProducts details={details} t={t} />
              </ScaleFade>
            </GridItem>
          </Grid>
        </SlideFade>
      </Box>

      {/* Bottom Modal */}
      {isMobile && (
        <Portal>
          <Box
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            bg="transparent"
            p={4}
            zIndex={1000}
          >
            <HStack flexDirection={'row-reverse'} spacing={3} w="full">
              <Button
                leftIcon={<FiPhone />}
                variant="solid"
                flex={1}
                bg={'blue.400'}
                _hover={{bg: "blue.300"}}
                border={"2px solid transparent"}
                _active={{borderColor: "blue.400", color: "blue.400", bg: "white"}}
                color={'white'}
                fontSize={{base: 'sm', sm: 'md'}}
                h="50px"
                fontWeight="semibold"
                onClick={handleCallPhone}
              >
                {t("contactBottomModal.call", "Позвонить")}
              </Button>
              <Button
                leftIcon={<FiMessageCircle />}
                variant="solid"
                flex={1}
                bg={'orange.100'}
                color={'orange.800'}
                h="50px"
                fontWeight="semibold"
                onClick={details.author?.is_company ? handleCallbackMessage : handleSendMessage}
                fontSize={{base: 'sm', sm: 'md'}}
              >
                {t("contactBottomModal.write", "Написать")}
              </Button>
            </HStack>
          </Box>
        </Portal>
      )}

      <Suspense fallback={null}>
        <ContactBottomModal 
          isOpen={isOpen} 
          onClose={onClose} 
          type={type} 
          text={`+998${details.phones[0]}`}
        />
        <CallbackModal 
          isOpen={isCallbackOpen} 
          onClose={onCallbackClose} 
          onSubmit={handleCallbackSubmit} 
        />
      </Suspense>
    </Box>
  );
};

export default memo(MobileHotOfferDetails);