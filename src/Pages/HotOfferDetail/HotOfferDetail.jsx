import { useState, useEffect, useCallback, useMemo, memo } from 'react';
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
  FaFlag,
} from 'react-icons/fa';
import { useParams, useNavigate } from "react-router-dom";
import { ProductInfo } from './ProductInfo';
import { ImageGallery } from './ImageGallery';
import { SellerInfo } from './SellerInfo';
import { useTranslation } from 'react-i18next';
import { ReportModal } from '../../components/ReportModal/ReportModal';
import { FiMessageCircle, FiPhone } from 'react-icons/fi';
import ContactBottomModal from './ContactBottomModal';
import { CallbackModal } from '../../components/CallbackModal';
import { useAuth } from '../Auth/logic/AuthContext';
import { useStats } from '../../components/PostStats';

// Memoized Breadcrumb Component
const BreadcrumbNav = memo(({ category, title, t = () => {} }) => {
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
              {title || t("hotOfferDetail.product", "Продукт")}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
    </Box>
  );
});

BreadcrumbNav.displayName = 'BreadcrumbNav';

// Memoized Characteristics Component - Responsive
const Characteristics = memo(({ characteristics, t = () => {} }) => {
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });
  
  // Memoized characteristics data to prevent unnecessary re-renders
  const characteristicsData = useMemo(() => {
    if (!characteristics || characteristics.length === 0) {
      return null;
    }
    return characteristics;
  }, [characteristics]);

  if (!characteristicsData) {
    return (
      <Text color="gray.500" textAlign="center" py={4}>
        {t("hotOfferDetail.invalid_characteristics", "Характеристики недоступны")}
      </Text>
    );
  }

  return (
    <TableContainer>
      <Table variant="simple" size={tableSize}>
        <Tbody>
          {characteristicsData.map((char, index) => {
            const uniqueKey = `${char.characteristic?.id || 'char'}-${char.values?.id || 'val'}-${index}`;
            return (
              <Tr key={uniqueKey} _hover={{ bg: "gray.50" }}>
                <Td 
                  fontWeight="semibold" 
                  py={{ base: 3, md: 4 }} 
                  borderColor="gray.200"
                  fontSize={{ base: 'sm', md: 'md' }}
                  width={{ base: '40%', md: '50%' }}
                >
                  {char.characteristic?.title}
                </Td>
                <Td 
                  py={{ base: 3, md: 4 }} 
                  borderColor="gray.200"
                  fontSize={{ base: 'sm', md: 'md' }}
                >
                  {char.values?.title}
                  {char.values?.measurement_unit && ` ${char.values.measurement_unit}`}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
});

Characteristics.displayName = 'Characteristics';

// Memoized Statistics Component - PostStats bilan integratsiya qilingan
const Statistics = memo(({ stats, t }) => {
  // PostStats dan kelgan stats ni ishlatish
  const statsData = useMemo(() => {
    if (!stats) return [];
    
    return [
      { icon: FaEye, value: stats.views || 0, label: t("hotOfferDetail.label_view", "просмотры"), color: "gray" },
      { icon: FaHeart, value: stats.likes || 0, label: t("hotOfferDetail.label_sevimli", "избранное"), color: "red" },
      { icon: FaShare, value: stats.shares || 0, label: t("hotOfferDetail.label_ulashish", "поделиться"), color: "blue.400" }
    ];
  }, [stats, t]);

  if (statsData.length === 0) return null;

  return (
    <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
      {statsData.map((stat, index) => {
        const uniqueKey = `${stat.label}-${stat.value}-${index}-stats`;
        return (
          <Flex 
            key={uniqueKey}
            align="center" 
            justify={{ base: 'center', sm: 'flex-start' }}
            gap={2}
            p={{ base: 2, md: 0 }}
          >
            <Box as={stat.icon} color={stat.color} />
            <Text fontSize={{ base: 'sm', md: 'md' }}>
              {stat.value} {stat.label}
            </Text>
          </Flex>
        );
      })}
    </SimpleGrid>
  );
});

Statistics.displayName = 'Statistics';

// Memoized Similar Products Component
const SimilarProducts = memo(({ details, t }) => {
  const similarProductsData = useMemo(() => [1, 2], []);

  return (
    <Box mt={8}>
      <Heading 
        size={{ base: 'sm', md: 'md' }} 
        mb={6}
        textAlign={{ base: 'center', md: 'left' }}
      >
        {t("hotOfferDetail.you_might_like", "Вам могут понравиться")}
      </Heading>
      <Box display={'flex'} flexDir={{base: "column", custom380: "row", custom900: "column"}} alignItems={'flex-start'} gap={4}>
        {similarProductsData.map((item) => {
          const uniqueKey = `${details.id}-similar-product-${item}-${details.slug}`;
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
                    alt={`O'xshash mahsulot ${item}`}
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
                      Description {item}
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

SimilarProducts.displayName = 'SimilarProducts';

// Memoized Loading Component
const LoadingComponent = memo(({ containerPadding, gridGap }) => (
  <Box>
    <BreadcrumbNav />
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

LoadingComponent.displayName = 'LoadingComponent';

// Memoized Error Component
const ErrorComponent = memo(({ error, containerPadding, headingSize, t }) => (
  <Box>
    <BreadcrumbNav />
    <Container minH={'100vh'} maxW="container.xl" py={containerPadding}>
      <Center h="60vh">
        <VStack spacing={6} textAlign="center" px={4}>
          <Box>
            <Heading 
              size={headingSize} 
              color="red.500" 
              mb={4}
            >
              {t("orderlist.error", "Произошла ошибка!")}
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
              {t("hotOfferDetail.refresh_page", "Обновить страницу")}
            </Button>
            <Button 
              variant="outline" 
              colorScheme='blue'
              color={'blue.400'}
              onClick={() => window.history.back()}
              size={{ base: 'md', md: 'lg' }}
              w={{ base: 'full', sm: 'auto' }}
            >
              {t("hotOfferDetail.back", "Назад")}
            </Button>
          </Stack>
        </VStack>
      </Center>
    </Container>
  </Box>
));

ErrorComponent.displayName = 'ErrorComponent';

// Memoized Bottom Modal Component - PostStats tracking bilan
const BottomModal = memo(({ isMobile, details, t, handleCallPhone, handleCallbackMessage, handleSendMessage, track }) => {
  if (!isMobile) return null;
  
  return (
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
            onClick={() => {
              track('calls'); // PostStats tracking
              handleCallPhone();
            }}
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
            onClick={() => {
              track('messages'); // PostStats tracking
              details.author?.is_company ? handleCallbackMessage() : handleSendMessage();
            }}
            fontSize={{base: 'sm', sm: 'md'}}
          >
            {t("contactBottomModal.write", "Написать")}
          </Button>
        </HStack>
      </Box>
    </Portal>
  );
});

BottomModal.displayName = 'BottomModal';

// Main Component - PostStats bilan to'liq integratsiya qilingan
const HotOfferDetail = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();

  const { slug } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState('phone');
  const { isOpen: isCallbackOpen, onClose: onCallbackClose, onOpen: onCallbackOpen } = useDisclosure();

  // PostStats hook ishlatish
  const productId = details?.id || slug;
  const { stats, isLiked, toggleLike, track } = useStats(productId);

  // Memoized responsive values
  const responsiveValues = useMemo(() => ({
    containerPadding: { base: 4, md: 8 },
    gridGap: { base: 4, md: 6, lg: 8 },
    headingSize: { base: 'md', md: 'lg' },
  }), []);

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Memoized data transformation function
  const transformApiData = useCallback((data) => ({
    id: data.id,
    title: data.title || t("hotOfferDetail.untitled_product", "Неизвестный продукт"),
    sub_title: data.sub_title || "",
    description: data.description || t("hotOfferDetail.no_desc", "Описание недоступно"),
    category: data.category || { title: t("hotOfferDetail.no_category", "Категория не указана") },
    city: data.city || { title: t("hotOfferDetail.no_city", "Город не указан") },
    created_at: data.created_at,
    rank_hot_offer: data.rank_hot_offer || false,
    rank_premium: data.rank_premium || false,
    is_favorite: data.is_favorite || false,
    images: data.images || [],
    prices: data.prices || [],
    currency: data.prices?.[0]?.currency || 'uzs',
    phones: data.phones || [],
    characteristics: data.characteristics || [],
    author: data.author || { name: t("hotOfferDetail.unknown", "Неизвестно"), avatar: "", is_company: true, is_official: false },
    statistics: data.statistics || { viewed: 0, write: 0, called: 0, favorite: 0, share: 0, clicked: 0 },
    slug: data.slug,
    status: data.status,
    stickers: data.stickers || [],
    ad_promotions: data.ad_promotions || []
  }), [t]);

  // Optimized API fetch function with error handling
  const fetchCardsDetail = useCallback(async () => {
    if (!slug) {
      setError("Mahsulot slug parametri topilmadi");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://backend-u-mts.onrender.com/api/hot-offers/product/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const apiResponse = await response.json();
        throw new Error(apiResponse.message || "Ma'lumot topilmadi");
      }

      const apiResponse = await response.json();
      
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.message || "API xatoligi");
      }

      const transformedData = transformApiData(apiResponse.data);
      setDetails(transformedData);
      
    } catch (err) {
      console.error("Mahsulotni yuklashda xatolik:", err);
      setError(err.message || "Noma'lum xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }, [slug, transformApiData]);

  // PostStats bilan like handler - eski handleLike ni almashtirish
  const handleLike = useCallback(async () => {
    if (!slug) return;
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
      return;
    }
    
    try {
      // PostStats orqali like ni track qilish
      toggleLike();
      
      toast({
        title: isLiked ? t("hotOfferDetail.remove_favourite", "Удалено из избранного") : t("hotOfferDetail.add_favourite", "Добавлено в избранное"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      
    } catch (err) {
      console.error("Like toggle error:", err);
      toast({
        title: "Xatolik yuz berdi",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isLiked, slug, t, toast, isAuthenticated, toggleLike, navigate]);

  // PostStats bilan share handler
  const handleShare = useCallback(() => {
    track('shares'); // PostStats tracking
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: t("hotOfferDetail.share_msg", "Ссылка скопирована"),
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  }, [t, toast, track]);

  const handleCallPhone = useCallback(() => {
    setType('phone');
    onOpen();
  }, [onOpen]);

  const handleSendMessage = useCallback(() => {
    setType('message');
    onOpen();
  }, [onOpen]);

  const handleCallbackMessage = useCallback(() => {    
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
      return;
    }
    onCallbackOpen();
  }, [onCallbackOpen, isAuthenticated, navigate]);

  // Callback submission handler
  const handleCallbackSubmit = useCallback(async (data) => {
    console.log("Leeds ga yuboradigan api joyi", data);
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchCardsDetail();
  }, [fetchCardsDetail]);

  // PostStats orqali view tracking
  useEffect(() => {
    if (details?.id) {
      // View ni avtomatik track qilish
      track('views');
    }
  }, [details?.id, track]);

  // Conditional rendering with memoized components
  if (loading) {
    return (
      <LoadingComponent 
        containerPadding={responsiveValues.containerPadding} 
        gridGap={responsiveValues.gridGap} 
      />
    );
  }

  if (error) {
    return (
      <ErrorComponent 
        error={error}
        containerPadding={responsiveValues.containerPadding}
        headingSize={responsiveValues.headingSize}
        t={t}
      />
    );
  }

  if (!details) return null;

  return (
    <Box py={{ base: "80px", md: 0 }}>
      <BreadcrumbNav category={details.category} title={details.title} t={t} />

      <Box maxW="container.xl" py={responsiveValues.containerPadding}>
        <SlideFade in={true} offsetY="20px">
          <Grid 
            templateColumns={{ base: "1fr", custom900: "2fr 1fr" }} 
            gap={responsiveValues.gridGap}
          >
            {/* Left Column */}
            <GridItem>
              <ImageGallery images={details.images} title={details.title} />
              
              <ProductInfo 
                details={details}
                isLiked={isLiked}
                onLike={handleLike}
                onShare={handleShare}
              />

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
                  <Text>{t("hotOfferDetail.characteristic", "Характеристика")}</Text>
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
                  {t("partsmarketplace.company_info.inform", "Описание")}
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

              {/* Statistics - PostStats dan kelgan ma'lumotlar */}
              <Box>
                <Heading size={responsiveValues.headingSize} mb={6}>
                  {t("hotOfferDetail.statistika", "Статистика")}
                </Heading>
                <Card borderRadius="xl">
                  <CardBody p={{ base: 4, md: 6 }}>
                    <Statistics stats={stats} t={t} />
                  </CardBody>
                </Card>
              </Box>

              {/* Report Button */}
              <Box mt={4} display="flex" justifyContent="flex-end">
                <Button
                  leftIcon={<FaFlag />}
                  variant="ghost"
                  size="sm"
                  color="red.500"
                  onClick={onReportOpen}
                  _hover={{ bg: "red.50" }}
                  borderRadius="xl"
                >
                  {t("report.title", "Пожаловаться")}
                </Button>
              </Box>
            </GridItem>

            {/* Right Column */}
            <GridItem>
              <ScaleFade in={true} initialScale={0.9}>
                <SellerInfo 
                  author={details.author}
                  createdAt={details.created_at}
                />

                <SimilarProducts details={details} t={t} />
              </ScaleFade>
            </GridItem>
          </Grid>
        </SlideFade>
      </Box>

      {/* Bottom Modal - PostStats tracking bilan */}
      <BottomModal 
        isMobile={isMobile}
        details={details}
        t={t}
        handleCallPhone={handleCallPhone}
        handleCallbackMessage={handleCallbackMessage}
        handleSendMessage={handleSendMessage}
        track={track}
      />

      {/* Modals */}
      <ReportModal isOpen={isReportOpen} onClose={onReportClose} />
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
    </Box>
  );
};

export default memo(HotOfferDetail);
