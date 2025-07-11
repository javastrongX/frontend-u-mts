import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Grid,
  useColorModeValue,
  Divider,
  Stack,
  RadioGroup,
  Radio,
  SimpleGrid,
  Center,
  Heading,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Circle, Collapse,
  useBreakpointValue,
} from '@chakra-ui/react';
import { 
  FaEye, 
  FaSearch, 
  FaFire, 
  FaChevronLeft,
  FaCreditCard,
  FaPhone,
  FaWallet,
  FaClock,
  FaChartLine,
  FaShieldAlt as FaShield,
  FaCheckCircle,
  FaTag,
  FaBolt,
  FaRocket,
  FaCrown,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

import { keyframes } from '@emotion/react';
import TariffCarousel from './TariffCarousel';
import { useNavigate } from 'react-router-dom';
import ProductPreviewCard from './ProductPreviewCard';

// Animations

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const mockProductData = {
  id: 1,
  author: {
    id: 28099,
    name: "Gaybullayev Jorabek Alisher ogli",
    avatar: "https://dev.gservice-co.kz/api-assets/no_avatar.png",
    is_company: false,
    is_official: false
  },
  category: {
    id: 1,
    title: "Продажа спецтехники",
    icon: "https://dev.gservice-co.kz/api-assets/category_icon/basket.svg"
  },
  title: "Komatsu FG10-15",
  sub_title: "Экскаваторы-погрузчики",
  city: {
    id: 28,
    title: "Алматы",
    is_popular: true
  },
  prices: [
    {
      id: 7080,
      type: "price",
      price: 999999999,
      original_price: 999999999,
      currency: {
        id: 1,
        title: "KZT",
        in_tenge: 1,
        symbol: "₸"
      }
    }
  ],
  images: [
    {
      id: 30358,
      url: "https://dev.gservice-co.kz/storage/ad-images/24-05-2025/01JW0GKFFJJGR030WHBE3GREHR.webp"
    }
  ],
  slug: "10812-komatsu-fg10-15",
  phones: ["2131314141"],
  description: "Подача в день заказа",
  characteristics: [
    {
      characteristic: {
        id: 264,
        title: "Тип топлива"
      },
      values: {
        value: 512,
        title: "Дизель",
        measurement_unit: null
      }
    },
    {
      characteristic: {
        id: 266,
        title: "Год выпуска"
      },
      values: {
        value: 579,
        title: "2024",
        measurement_unit: "г."
      }
    }
  ],
  ad_package: null,
  rank_premium: false,
  rank_search: false,
  rank_hot_offer: false,
  stickers: [],
  status: "confirmed",
  is_favorite: false,
  statistics: {
    viewed: 13,
    write: 0,
    called: 0,
    favorite: 1,
    share: 2,
    clicked: 3,
    views: null
  },
  created_at: "2025-05-24T06:45:06.000000Z",
  likedBy: []
};

//  HAR BIR KATEGORIYA UCHUN ALOHIDA STICKERLAR BO'LADI
const stickers = [
  { id: 1, label: "Цена с НДС", color: "cyan" },
  { id: 2, label: "Не требует вложений", color: "green" },
  { id: 3, label: "Обслуживалась у оф. дилера", color: "blue" },
  { id: 4, label: "Можно приобрести в лизинг", color: "purple" },
  { id: 5, label: "Есть торг", color: "orange" },
  { id: 6, label: "В отличном состоянии", color: "teal" },
  { id: 7, label: "Рассрочка", color: "pink" },
  { id: 8, label: "Есть гарантия", color: "yellow" },
  { id: 9, label: "Срочно", color: "red" }
];

const tariffs = [
  {
    id: 'standard',
    name: 'STANDARD',
    price: 1120,
    originalPrice: 2340,
    duration: '7 дней',
    features: [
      { icon: FaEye, text: "Размещение на 7 дней", color: "blue.400" },
      { icon: FaSearch, text: "1 поднятие в поиске", color: "green.400" },
      { icon: FaFire, text: "1 день в блоке «Топ»", color: "orange.400" }
    ],
    expectedViews: "150-200",
    expectedCalls: "5-8",
    bgGradient: "linear(135deg, blue.400, cyan.300)",
    borderColor: "blue.300",
    accentColor: "blue"
  },
  {
    id: 'x5',
    name: 'X5',
    price: 2240,
    originalPrice: 3190,
    duration: '28 дней',
    features: [
      { icon: FaEye, text: "Размещение на 28 дней", color: "purple.400" },
      { icon: FaSearch, text: "10 поднятий в поиске", color: "pink.400" },
      { icon: FaFire, text: "7 дней в блоке «Топ»", color: "red.400" }
    ],
    isPopular: false,
    expectedViews: "750-1000",
    expectedCalls: "25-35",
    bgGradient: "linear(135deg, purple.400, pink.300)",
    borderColor: "purple.300",
    accentColor: "purple"
  },
  {
    id: 'x10',
    name: 'X10',
    price: 4480,
    originalPrice: 6290,
    duration: '28 дней',
    features: [
      { icon: FaEye, text: "Размещение на 28 дней", color: "yellow.400" },
      { icon: FaSearch, text: "14 поднятий в поиске", color: "orange.400" },
      { icon: FaFire, text: "7 дней в блоке «Топ»", color: "red.400" },
      { icon: FaCrown, text: "7 дней в блоке «Премиум»", color: "yellow.400" }
    ],
    isPopular: true,
    expectedViews: "1500-2000",
    expectedCalls: "50-70",
    bgGradient: "linear(135deg, yellow.400, orange.300)",
    borderColor: "yellow.300",
    accentColor: "yellow"
  }
];

const paymentMethods = [
  { 
    id: 'card', 
    label: 'Банковской картой', 
    icon: FaCreditCard,
    gradient: "linear(135deg, blue.500, cyan.400)",
    color: "blue"
  },
  { 
    id: 'operator', 
    label: 'Оператором связи', 
    icon: FaPhone,
    gradient: "linear(135deg, green.500, teal.400)",
    color: "green"
  },
  { 
    id: 'wallet', 
    label: 'Кошельком', 
    icon: FaWallet,
    gradient: "linear(135deg, purple.500, pink.400)",
    color: "purple"
  }
];

export default function PromotionPage() {
  const [selectedStickers, setSelectedStickers] = useState([]);
  const [selectedTariff, setSelectedTariff] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [productData, setProductData] = useState(null);
  const [viewsAnimation, setViewsAnimation] = useState(61);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ isStickersOpen, setStickersOpen ] = useState(false);
  const toast = useToast();

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

    // Breakpoint values
  const forCollapse = useBreakpointValue({
    base: true,
    custom570: false
  }, {
    fallback: 'base',
    ssr: false
  });

  // handleRankUpdater funksiyasi - tariff tanlanganida mockProductData ni yangilaydi
  const handleRankUpdater = useCallback(() => {
    if (!selectedTariff) return;

    setProductData(prevData => {
      if (!prevData) return prevData;

      let updatedRanks = {
        rank_premium: false,
        rank_search: false,
        rank_hot_offer: false
      };

      // Tariff turiga qarab rank'larni o'rnatish
      switch (selectedTariff) {
        case 'standard':
          updatedRanks = {
            rank_premium: false,
            rank_search: true,
            rank_hot_offer: false
          };
          break;
        
        case 'x5':
          updatedRanks = {
            rank_premium: false,
            rank_search: true,
            rank_hot_offer: true
          };
          break;
        
        case 'x10':
          updatedRanks = {
            rank_premium: true,
            rank_search: true,
            rank_hot_offer: true
          };
          break;
        
        default:
          // Agar tariff tanlanmagan bo'lsa, barcha rank'larni false qilish
          updatedRanks = {
            rank_premium: false,
            rank_search: false,
            rank_hot_offer: false
          };
      }

      // Yangilangan ma'lumotlarni qaytarish
      return {
        ...prevData,
        ...updatedRanks
      };
    });
  }, [selectedTariff]);

  // useEffect hook - selectedTariff o'zgarganda handleRankUpdater ni chaqirish
  useEffect(() => {
    handleRankUpdater();
  }, [selectedTariff, handleRankUpdater]);


  useEffect(() => {
    const fetchProductData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProductData(mockProductData);
    };
    fetchProductData();
  }, []);

  // Animate views
  useEffect(() => {
    const interval = setInterval(() => {
      setViewsAnimation(prev => prev + Math.floor(Math.random() * 3));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleStickerToggle = (stickerId) => {
    setSelectedStickers(prev => {
      if (prev.includes(stickerId)) {
        return prev.filter(id => id !== stickerId);
      } else if (prev.length < 6) {
        return [...prev, stickerId];
      }
      return prev;
    });
  };

  const selectedTariffData = tariffs.find(t => t.id === selectedTariff);
  
  const calculateTotalPrice = () => {
    const tariffPrice = selectedTariffData?.price || 0;
    const stickersPrice = selectedStickers.length * 100;
    return tariffPrice + stickersPrice;
  };

  const handlePurchase = () => {
    toast({
      title: "Переходим к оплате",
      description: "Проверьте детали заказа",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top"
    });
    onOpen();
  };

  if (!productData) {
    return (
      <Box minH="100vh">
        <Box maxW="container.xl" py={8}>
          <Center h="400px">
            <VStack>
              <Box 
                w="12" 
                h="12" 
                borderRadius="full" 
                bgGradient="linear(45deg, cyan.400, blue.500)"
                animation={`${pulseAnimation} 2s infinite`}
              />
              <Text color={textColor} fontSize="lg">Загрузка...</Text>
            </VStack>
          </Center>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh">
      <Box maxW="container.xl" py={{base: '100px', custom570: "50px"}}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack spacing={3} display={{base: 'none', custom570: 'flex'}} align="center">
            <IconButton
              aria-label="Назад"
              icon={<FaChevronLeft />}
              variant="ghost"
              size="lg"
              onClick={() => navigate(-1)}
              color={textColor}
              _hover={{
                bg: 'rgba(79, 172, 254, 0.1)',
                color: 'blue.500'
              }}
              borderRadius="xl"
            />
            <Heading 
              size="xl" 
              color={headingColor}
              bgGradient="linear(135deg, blue.500, cyan.400)"
              bgClip="text"
              fontWeight="bold"
            >
              Продвижение объявления
            </Heading>
          </HStack>

          {/* // Real props bilan */}
          <ProductPreviewCard 
            product={productData}
            selectedStickers={selectedStickers}
            stickers={stickers}
          />
          {/* Expected Results */}
          {selectedTariffData && (
            <Card 
              bg={cardBg} 
              borderWidth="1px" 
              borderColor={borderColor} 
              borderRadius="2xl"
              boxShadow="0 10px 40px rgba(0,0,0,0.05)"
              overflow="hidden"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgGradient: selectedTariffData.bgGradient,
                backgroundSize: '200% 200%',
                animation: `${gradientShift} 3s ease infinite`
              }}
            >
              <CardHeader pb={3} pt={6}>
                <HStack>
                  <Box 
                    p={2} 
                    borderRadius="lg" 
                    bgGradient="linear(135deg, green.400, teal.300)"
                  >
                    <FaChartLine color="white" />
                  </Box>
                  <Heading size="lg" color={headingColor}>
                    Ожидаемые результаты
                  </Heading>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                  <Box
                    p={6}
                    borderRadius="xl"
                    bgGradient="linear(135deg, blue.50, cyan.50)"
                    border="1px solid"
                    borderColor="blue.200"
                    position="relative"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      top={0}
                      right={0}
                      w={20}
                      h={20}
                      bgGradient="linear(135deg, blue.400, cyan.300)"
                      borderRadius="full"
                      transform="translate(50%, -50%)"
                      opacity={0.1}
                    />
                    <Stat position="relative">
                      <StatLabel color="blue.600" fontWeight="medium">Просмотры</StatLabel>
                      <StatNumber color="blue.700" fontSize="3xl" fontWeight="bold">
                        {selectedTariffData.expectedViews}
                      </StatNumber>
                      <StatHelpText color="blue.500">
                        за {selectedTariffData.duration}
                      </StatHelpText>
                    </Stat>
                  </Box>
                  
                  <Box
                    p={6}
                    borderRadius="xl"
                    bgGradient="linear(135deg, green.50, teal.50)"
                    border="1px solid"
                    borderColor="green.200"
                    position="relative"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      top={0}
                      right={0}
                      w={20}
                      h={20}
                      bgGradient="linear(135deg, green.400, teal.300)"
                      borderRadius="full"
                      transform="translate(50%, -50%)"
                      opacity={0.1}
                    />
                    <Stat position="relative">
                      <StatLabel color="green.600" fontWeight="medium">Звонки</StatLabel>
                      <StatNumber color="green.700" fontSize="3xl" fontWeight="bold">
                        {selectedTariffData.expectedCalls}
                      </StatNumber>
                      <StatHelpText color="green.500">
                        в среднем
                      </StatHelpText>
                    </Stat>
                  </Box>
                </SimpleGrid>
              </CardBody>
            </Card>
          )}

          {/* Stickers Section */}
          <Card 
            bg={cardBg} 
            borderWidth="1px" 
            borderColor={borderColor} 
            borderRadius="2xl"
            boxShadow="0 10px 40px rgba(0,0,0,0.05)"
          >
            <CardHeader pb={3}>
              <VStack align="start" spacing={2}>
                <HStack>
                  <Box 
                    p={2} 
                    borderRadius="lg" 
                    bgGradient="linear(135deg, purple.400, pink.300)"
                  >
                    <FaTag color="white" />
                  </Box>
                  <Heading size="lg" color={headingColor}>Дополнительные отметки</Heading>
                </HStack>
                <Text color={textColor} fontSize="sm">
                  Выберите до 6 отметок (100 ₸ за штуку)
                </Text>
              </VStack>
            </CardHeader>
            <CardBody pt={0}>
              {forCollapse && (
                <Button 
                  color={'white'} 
                  bgGradient="linear(135deg, yellow.400, orange.400)" 
                  _hover={{
                    bgGradient: "linear(135deg, yellow.500, orange.500)"
                  }}
                  mb={4} 
                  w={'100%'} 
                  onClick={() => {
                    isStickersOpen 
                      ? setStickersOpen(false) 
                      : setStickersOpen(true)
                    }} 
                  rightIcon={
                    isStickersOpen 
                      ? <FaChevronUp /> 
                      : <FaChevronDown />
                    }>
                      Выберите отметки
                    </Button>
              )}
              <Collapse in={forCollapse ? isStickersOpen : true} inDuration={500} outDuration={300} animateOpacity>
                <SimpleGrid columns={{base: 1, custom570: 2, lg: 3}} spacing={4} mb={6}>
                  {stickers.map(sticker => (
                      <Button
                          key={sticker.id}
                          variant={selectedStickers.includes(sticker.id) ? "solid" : "outline"}
                          colorScheme={selectedStickers.includes(sticker.id) ? sticker.color : "gray"}
                          size="md"
                          onClick={() => handleStickerToggle(sticker.id)}
                          isDisabled={!selectedStickers.includes(sticker.id) && selectedStickers.length >= 6}
                          opacity={!selectedStickers.includes(sticker.id) && selectedStickers.length >= 6 ? 0.4 : 1}
                          borderRadius="xl"
                          fontSize="sm"
                          h="50px"
                          justifyContent="flex-start"
                          leftIcon={selectedStickers.includes(sticker.id) ? <FaCheckCircle size="14"/> : null}
                          transition="all 0.3s ease"
                          _hover={{
                            transform: !forCollapse && (selectedStickers.includes(sticker.id) ? 'scale(1.02)' : 'scale(1.05)'), 
                            boxShadow: selectedStickers.includes(sticker.id)
                                ? `0 8px 25px rgba(0,0,0,0.15)`
                                : '0 5px 15px rgba(0,0,0,0.1)'
                          }}
                          _active={{
                            transform: 'scale(0.98)'
                          }}
                          boxShadow={selectedStickers.includes(sticker.id)
                              ? `0 4px 20px rgba(0,0,0,0.1)`
                              : 'none'
                          }
                      >
                        {sticker.label}
                      </Button>
                  ))}
                </SimpleGrid>

              </Collapse>

              <Divider borderColor="gray.300" />
              
              <HStack justify="space-between" mt={6} p={4} bg="gray.50" borderRadius="xl">
                <Text color={textColor} fontSize="sm" fontWeight="medium">
                  Выбрано: {selectedStickers.length}/6
                </Text>
                <Text 
                  fontWeight="bold" 
                  fontSize="lg"
                  bgGradient="linear(135deg, purple.500, pink.400)"
                  bgClip="text"
                >
                  {selectedStickers.length * 100} ₸
                </Text>
              </HStack>
            </CardBody>
          </Card>

          {/* Tariffs Section */}
            <TariffCarousel tariffs={tariffs} selectedTariff={selectedTariff} setSelectedTariff={setSelectedTariff} handleRankUpdater={handleRankUpdater}/>

          {/* Payment Method */}
          <Card 
            bg={cardBg} 
            borderWidth="1px" 
            borderColor={borderColor} 
            borderRadius="2xl"
            boxShadow="0 10px 40px rgba(0,0,0,0.05)"
          >
            <CardHeader pb={3}>
              <HStack>
                <Box 
                  p={2} 
                  borderRadius="lg" 
                  bgGradient="linear(135deg, green.400, teal.300)"
                >
                  <FaShield color="white" />
                </Box>
                <Heading size="lg" color={headingColor}>Способ оплаты</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                  {paymentMethods.map(method => (
                    <Box
                      key={method.id}
                      p={6}
                      borderRadius="xl"
                      border="2px solid"
                      borderColor={paymentMethod === method.id ? `${method.color}.300` : borderColor}
                      cursor="pointer"
                      transition="all 0.3s ease"
                      onClick={() => setPaymentMethod(method.id)}
                      bg={paymentMethod === method.id ? `${method.color}.50` : cardBg}
                      position="relative"
                      overflow="hidden"
                      _hover={{
                        transform: 'translateY(-4px)',
                        boxShadow: paymentMethod === method.id 
                          ? `0 15px 40px rgba(0,0,0,0.15)` 
                          : '0 10px 30px rgba(0,0,0,0.1)',
                        borderColor: `${method.color}.300`
                      }}
                      boxShadow={paymentMethod === method.id 
                        ? `0 8px 25px rgba(0,0,0,0.1)` 
                        : '0 4px 15px rgba(0,0,0,0.05)'
                      }
                    >
                      {paymentMethod === method.id && (
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          height="4px"
                          bgGradient={method.gradient}
                          backgroundSize="200% 200%"
                          animation={`${gradientShift} 3s ease infinite`}
                        />
                      )}
                      
                      <Radio value={method.id} colorScheme={method.color} display="none" />
                      <VStack spacing={4}>
                        <Box 
                          p={3} 
                          borderRadius="xl" 
                          bgGradient={paymentMethod === method.id ? method.gradient : `linear(135deg, ${method.color}.100, ${method.color}.50)`}
                          transition="all 0.3s ease"
                        >
                          <method.icon 
                            color={paymentMethod === method.id ? "white" : `var(--chakra-colors-${method.color}-500)`} 
                            size="24" 
                          />
                        </Box>
                        <Text 
                          color={paymentMethod === method.id ? `${method.color}.700` : headingColor}
                          fontWeight="medium"
                          textAlign="center"
                        >
                          {method.label}
                        </Text>
                        {paymentMethod === method.id && (
                          <Badge colorScheme={method.color} borderRadius="full" px={3} py={1}>
                            <HStack spacing={1}>
                              <FaCheckCircle size="12" />
                              <Text fontSize="xs">Выбрано</Text>
                            </HStack>
                          </Badge>
                        )}
                      </VStack>
                    </Box>
                  ))}
                </Grid>
              </RadioGroup>
            </CardBody>
          </Card>

          {/* Purchase Summary */}
          <Card 
            bgGradient="linear(135deg, gray.800, gray.900)"
            color="white" 
            borderRadius="2xl"
            // position="sticky"
            // bottom="20px"
            // zIndex={10}
            boxShadow="0 20px 60px rgba(0,0,0,0.3)"
            border="1px solid"
            borderColor="gray.700"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              bgGradient: 'linear(90deg, cyan.400, blue.500, purple.500, pink.400)',
              backgroundSize: '200% 200%',
              animation: `${gradientShift} 4s ease infinite`
            }}
          >
            <CardBody pt={6}>
              <VStack spacing={6}>
                <HStack justify="space-between" w="full">
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="bold" fontSize="xl">
                      Итого к оплате
                    </Text>
                    <HStack spacing={2}>
                      {selectedTariffData?.name && (
                        <Badge colorScheme="blue" borderRadius="full" px={2} py={1}>
                          {selectedTariffData?.name}
                        </Badge>
                      )}
                      {selectedStickers.length > 0 && (
                        <Badge colorScheme="purple" borderRadius="full" px={2} py={1}>
                          +{selectedStickers.length} отметок
                        </Badge>
                      )}
                    </HStack>
                  </VStack>
                  <VStack align="end" spacing={1}>
                    <Text fontSize="3xl" fontWeight="bold">
                      {calculateTotalPrice().toLocaleString()}
                    </Text>
                    <Text fontSize="lg" opacity={0.8}>₸</Text>
                  </VStack>
                </HStack>
                
                <Button
                  bgGradient="linear(135deg, cyan.400, blue.500)"
                  color="white"
                  size="lg"
                  w="full"
                  borderRadius="xl"
                  fontWeight="bold"
                  h="60px"
                  fontSize="lg"
                  disabled={!selectedTariffData}
                  onClick={handlePurchase}
                  transition="all 0.3s ease"
                  _hover={{
                    bgGradient: 'linear(135deg, cyan.500, blue.600)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)'
                  }}
                  _active={{
                    transform: 'translateY(0)'
                  }}
                  leftIcon={<FaRocket />}
                >
                  Оплатить и продвинуть
                </Button>

                <SimpleGrid columns={3} spacing={6} w="full" fontSize="sm" opacity={0.9}>
                  <VStack spacing={2}>
                    <Box 
                      p={2} 
                      borderRadius="lg" 
                      bg="whiteAlpha.200"
                    >
                      <FaShield size="16" />
                    </Box>
                    <Text textAlign="center" fontSize="xs">Безопасная оплата</Text>
                  </VStack>
                  <VStack spacing={2}>
                    <Box 
                      p={2} 
                      borderRadius="lg" 
                      bg="whiteAlpha.200"
                    >
                      <FaClock size="16" />
                    </Box>
                    <Text textAlign="center" fontSize="xs">Мгновенная активация</Text>
                  </VStack>
                  <VStack spacing={2}>
                    <Box 
                      p={2} 
                      borderRadius="lg" 
                      bg="whiteAlpha.200"
                    >
                      <FaBolt size="16" />
                    </Box>
                    <Text textAlign="center" fontSize="xs">Гарантия результата</Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        {/* Purchase Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent borderRadius="2xl" overflow="hidden" mx={2}>
            <ModalHeader 
              bgGradient="linear(135deg, blue.500, cyan.400)"
              color="white"
              textAlign="center"
              fontSize="xl"
              fontWeight="bold"
            >
              Подтверждение заказа
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={4}>
              <VStack spacing={6} align="stretch">
                <Box 
                  p={6} 
                  bgGradient="linear(135deg, gray.50, blue.50)" 
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="blue.200"
                >
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <HStack>
                        <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
                          {selectedTariffData?.name}
                        </Badge>
                        <Text fontWeight="medium">тариф</Text>
                      </HStack>
                      <Text fontWeight="bold" fontSize="lg">
                        {selectedTariffData?.price.toLocaleString()} ₸
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <HStack>
                        <Badge colorScheme="purple" borderRadius="full" px={3} py={1}>
                          {selectedStickers.length}
                        </Badge>
                        <Text fontWeight="medium">отметок</Text>
                      </HStack>
                      <Text fontWeight="bold" fontSize="lg">
                        {selectedStickers.length * 100} ₸
                      </Text>
                    </HStack>
                    <Divider borderColor="blue.300" />
                    <HStack justify="space-between" fontSize="xl" fontWeight="bold">
                      <Text>Итого:</Text>
                      <Text 
                        bgGradient="linear(135deg, blue.500, cyan.400)"
                        bgClip="text"
                      >
                        {calculateTotalPrice().toLocaleString()} ₸
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                <Box
                  p={4}
                  borderRadius="xl"
                  bg="green.50"
                  border="1px solid"
                  borderColor="green.200"
                >
                  <HStack>
                    <FaCheckCircle color="green" />
                    <Text color="green.700" fontSize="sm" fontWeight="medium">
                      После оплаты ваше объявление будет автоматически продвинуто
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter p={8} pt={0}>
              <Stack justify={'space-between'} direction={{ base: "column-reverse", custom570: "row" }} spacing={4} w="full">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  size="lg"
                  borderRadius="xl"                >
                  Отменить
                </Button>
                <Button
                  bgGradient="linear(135deg, cyan.400, blue.500)"
                  color="white"
                  size="lg"
                  borderRadius="xl"
                  fontWeight="bold"
                  h="50px"
                  leftIcon={<FaCreditCard />}
                  _hover={{
                    bgGradient: 'linear(135deg, cyan.500, blue.600)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  Оплатить {calculateTotalPrice().toLocaleString()} ₸
                </Button>
              </Stack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}