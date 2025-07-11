import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Image,
  Text,
  Badge,
  IconButton,
  HStack,
  VStack,
  Card,
  CardBody,
  Button,
  Flex,
  useColorModeValue,
  Skeleton,
  SkeletonText,
  useToast,
  Fade,
  ScaleFade,
  SimpleGrid,
  Center,
  Spinner,
  useBreakpointValue
} from '@chakra-ui/react';
import { 
  IoArrowBack, 
  IoHeart, 
  IoHeartOutline, 
  IoLocationOutline, 
  IoTimeOutline,
  IoChevronBack,
  IoChevronForward,
  IoSettings
} from 'react-icons/io5';

import { FaTractor, FaCogs, FaWrench, FaBox, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState(new Set());
  const itemsPerPage = 8;
  
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  const shadowColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)');
  
  const navigate = useNavigate();

  // Responsive layout detection
  const isLargeScreen = useBreakpointValue({ base: true, custom570: false, md: true });

  // Mock data with more items
  const mockData = [
    {
      id: 1,
      title: "HITACHI,KOMATSU,SDL Поршень STD Комплект поршневых колец для двигателя",
      price: "25 104 ₸",
      location: "г. Шымкент",
      date: "28 Апр 16:58",
      image: "",
      category: "Запчасти"
    },
    {
      id: 2,
      title: "MST Втулка в переднюю стойку амортизатора высокого качества",
      price: "15 300 ₸",
      location: "г. Шымкент",
      date: "20 Май 14:07",
      image: "",
      category: "Запчасти"
    },
    {
      id: 3,
      title: "HIDROMEK МАСЛЯНЫЙ НАСОС Гидравлический насос высокого давления",
      price: "153 000 ₸",
      location: "г. Шымкент",
      date: "4 Июнь 14:06",
      image: "",
      category: "Запчасти"
    },
    {
      id: 4,
      title: "HIDROMEK,JCB Диски тормозные передние и задние комплект",
      price: "127 500 ₸",
      location: "г. Шымкент",
      date: "4 Июнь 16:30",
      image: "",
      category: "Запчасти"
    },
    {
      id: 5,
      title: "Вилочные погрузчики HYUNDAI 20L-7SA в отличном состоянии",
      price: "10 000 ₸",
      location: "г. Алматы",
      date: "29 Июнь 13:11",
      image: "",
      category: "Техника"
    },
    {
      id: 6,
      title: "Вилочные погрузчики HYUNDAI 25L-7SA мощные и надежные",
      price: "10 000 ₸",
      location: "г. Алматы",
      date: "29 Июнь 13:13",
      image: "",
      category: "Техника"
    },
    {
      id: 7,
      title: "ЛИАЗ Головка реактивной тяги с резинометаллическим шарниром",
      price: "50 000 ₸",
      location: "г. Алматы",
      date: "29 Июнь 13:34",
      image: "",
      category: "Запчасти"
    },
    {
      id: 8,
      title: "Экскаватор-погрузчик JCB 3CX Super с гарантией",
      price: "12 500 000 ₸",
      location: "г. Нур-Султан",
      date: "30 Июнь 09:15",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
      category: "Техника"
    },
    {
      id: 9,
      title: "Двигатель Cummins ISF2.8 для спецтехники новый",
      price: "850 000 ₸",
      location: "г. Караганда",
      date: "1 Июль 10:20",
      image: "",
      category: "Двигатели"
    },
    {
      id: 10,
      title: "Коробка передач ZF для автокрана европейского качества",
      price: "420 000 ₸",
      location: "г. Актобе",
      date: "1 Июль 15:45",
      image: "",
      category: "Трансмиссия"
    },
    {
      id: 11,
      title: "Гидравлический цилиндр CAT 330D оригинальный",
      price: "95 000 ₸",
      location: "г. Алматы",
      date: "2 Июль 08:30",
      image: "",
      category: "Запчасти"
    },
    {
      id: 12,
      title: "Фильтр масляный VOLVO EC210B высокого качества",
      price: "8 500 ₸",
      location: "г. Шымкент",
      date: "2 Июль 14:22",
      image: "",
      category: "Запчасти"
    }
  ];

  // Simulate API call
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setFavorites(mockData);
        setIsLoading(false);
      }, 1000);
    };

    fetchFavorites();
  }, []);

  const handleRemoveFromFavorites = async (itemId) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    
    try {
      setTimeout(() => {
        setFavorites(prev => prev.filter(item => item.id !== itemId));
        setRemovingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
        
        toast({
          title: "Удалено из избранного",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }, 500);
    } catch (error) {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const totalPages = Math.ceil(favorites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = favorites.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Техника':
        return <FaTractor size="2rem" />;
      case 'Запчасти':
        return <FaWrench size="2rem" />;
      case 'Двигатели':
        return <FaCogs size="2rem" />;
      case 'Трансмиссия':
        return <IoSettings size="2rem" />;
      default:
        return <FaBox size="2rem" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Техника':
        return 'green';
      case 'Запчасти':
        return 'blue';
      case 'Двигатели':
        return 'orange';
      case 'Трансмиссия':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const FavoriteCard = ({ item }) => (
    <ScaleFade in={!removingItems.has(item.id)} unmountOnExit>
      <Card
        bg={cardBg}
        borderColor={borderColor}
        borderWidth="1px"
        borderRadius="2xl"
        overflow="hidden"
        transition="all 0.3s ease"
        _hover={{
          transform: 'translateY(-8px)',
          shadow: 'xl',
          borderColor: 'blue.300'
        }}
        cursor="pointer"
        height="100%"
        boxShadow={`0 4px 12px ${shadowColor}`}
        direction={isLargeScreen ? "column" : "row"}
      >
        <CardBody p={{base: 3, md: 5}}>
          {isLargeScreen ? (
            // Vertical layout for large screens
            <VStack spacing={4} align="stretch" height="100%">
              {/* Image Section */}
              <Box position="relative">
                <Box
                  position="relative"
                  borderRadius="xl"
                  overflow="hidden"
                  bg="gray.100"
                  height={{base: "180px", md: "180px"}}
                  width="100%"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      fallback={
                        <Box
                          width="100%"
                          height="100%"
                          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                        >
                          {getCategoryIcon(item.category)}
                          <Text fontSize="sm" fontWeight="medium" mt={2}>
                            {item.category}
                          </Text>
                        </Box>
                      }
                    />
                  ) : (
                    <Box
                      width="100%"
                      height="100%"
                      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                    >
                      {getCategoryIcon(item.category)}
                      <Text fontSize="sm" fontWeight="medium" mt={2}>
                        {item.category}
                      </Text>
                    </Box>
                  )}
                </Box>

                {/* Category Badge */}
                <Badge
                  position="absolute"
                  top={3}
                  left={3}
                  colorScheme={getCategoryColor(item.category)}
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {item.category}
                </Badge>

                {/* Heart Button */}
                <IconButton
                  position="absolute"
                  top={3}
                  right={3}
                  icon={<IoHeart />}
                  colorScheme="red"
                  variant="solid"
                  size="sm"
                  borderRadius="full"
                  bg="red.500"
                  color="white"
                  _hover={{ bg: 'red.600', transform: 'scale(1.1)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromFavorites(item.id);
                  }}
                  isLoading={removingItems.has(item.id)}
                  spinner={<Spinner size="sm" />}
                  aria-label="Удалить из избранного"
                />
              </Box>

              {/* Content Section */}
              <VStack align="stretch" spacing={3} flex="1">
                <Text
                  fontSize="lg"
                  fontWeight="600"
                  color={headingColor}
                  lineHeight="1.4"
                  minHeight="3.5rem"
                >
                  {item.title}
                </Text>
                
                <Text
                  fontSize="2xl"
                  fontWeight="800"
                  color="blue.500"
                  bgGradient="linear(to-r, blue.400, blue.600)"
                  bgClip="text"
                >
                  {item.price}
                </Text>

                <VStack spacing={2} align="stretch" mt="auto">
                  <HStack spacing={2} color={textColor} fontSize="sm">
                    <IoLocationOutline />
                    <Text fontWeight="medium">{item.location}</Text>
                  </HStack>
                  <HStack spacing={2} color={textColor} fontSize="sm">
                    <IoTimeOutline />
                    <Text>{item.date}</Text>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          ) : (
            // Horizontal layout for small screens
            <HStack spacing={4} align="stretch">
              {/* Image Section - Left */}
              <Box position="relative" flexShrink={0}>
                <Box
                  position="relative"
                  borderRadius="xl"
                  overflow="hidden"
                  bg="gray.100"
                  height="150px"
                  width="180px"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      fallback={
                        <Box
                          width="100%"
                          height="100%"
                          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                        >
                          {getCategoryIcon(item.category)}
                        </Box>
                      }
                    />
                  ) : (
                    <Box
                      width="100%"
                      height="100%"
                      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                    >
                      {getCategoryIcon(item.category)}
                    </Box>
                  )}
                </Box>

                {/* Heart Button */}
                <IconButton
                  position="absolute"
                  top={2}
                  right={2}
                  icon={<IoHeart />}
                  colorScheme="red"
                  variant="solid"
                  size="xs"
                  borderRadius="full"
                  bg="red.500"
                  color="white"
                  _hover={{ bg: 'red.600', transform: 'scale(1.1)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromFavorites(item.id);
                  }}
                  isLoading={removingItems.has(item.id)}
                  spinner={<Spinner size="xs" />}
                  aria-label="Удалить из избранного"
                />
              </Box>

              {/* Content Section - Right */}
              <VStack align="stretch" spacing={2} flex="1" justify="space-between">
                <VStack align="stretch" spacing={2}>
                  <Badge
                    colorScheme={getCategoryColor(item.category)}
                    borderRadius="full"
                    px={2}
                    py={1}
                    fontSize="xs"
                    fontWeight="bold"
                    alignSelf="flex-start"
                  >
                    {item.category}
                  </Badge>
                  
                  <Text
                    fontSize="md"
                    fontWeight="600"
                    color={headingColor}
                    lineHeight="1.3"
                    noOfLines={2}
                  >
                    {item.title}
                  </Text>
                  
                  <Text
                    fontSize="lg"
                    fontWeight="800"
                    color="blue.500"
                    bgGradient="linear(to-r, blue.400, blue.600)"
                    bgClip="text"
                  >
                    {item.price}
                  </Text>
                </VStack>

                <VStack spacing={1} align="stretch">
                  <HStack spacing={2} color={textColor} fontSize="xs">
                    <IoLocationOutline />
                    <Text fontWeight="medium">{item.location}</Text>
                  </HStack>
                  <HStack spacing={2} color={textColor} fontSize="xs">
                    <IoTimeOutline />
                    <Text>{item.date}</Text>
                  </HStack>
                </VStack>
              </VStack>
            </HStack>
          )}
        </CardBody>
      </Card>
    </ScaleFade>
  );

  const LoadingSkeleton = () => (
    <Card bg={cardBg} borderRadius="2xl" borderWidth="1px" borderColor={borderColor} height="100%">
      <CardBody p={6}>
        {isLargeScreen ? (
          <VStack spacing={4} align="stretch">
            <Skeleton height="160px" borderRadius="xl" />
            <VStack align="stretch" spacing={2}>
              <Skeleton height="4" />
              <Skeleton height="4" width="70%" />
              <Skeleton height="6" width="40%" />
              <SkeletonText noOfLines={2} spacing="2" />
            </VStack>
          </VStack>
        ) : (
          <HStack spacing={4} align="stretch">
            <Skeleton height="120px" width="120px" borderRadius="xl" flexShrink={0} />
            <VStack align="stretch" spacing={2} flex="1">
              <Skeleton height="3" width="30%" />
              <Skeleton height="4" />
              <Skeleton height="4" width="80%" />
              <Skeleton height="5" width="50%" />
              <SkeletonText noOfLines={2} spacing="1" fontSize="xs" />
            </VStack>
          </HStack>
        )}
      </CardBody>
    </Card>
  );

  return (
    <Box bg={bgColor} minH="100vh" py={{base: "100px", custom570: 2}} maxW={"100%"}>
      <Container p={3} maxW={{base: "container.xl", "2xl": "100%"}}>
        <Fade in>
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <HStack justify="space-between" align="center" display={{base: "none", custom570: "flex"}}>
              <HStack spacing={4}>
                <IconButton
                  icon={<IoArrowBack />}
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate(-1)}
                  aria-label="Назад"
                  bg={cardBg}
                  borderRadius="full"
                  _hover={{ transform: 'translateX(-2px)' }}
                />
                <Heading size="xl" color={headingColor}>
                  Избранные товары
                </Heading>
              </HStack>
              
              {!isLoading && favorites.length > 0 && (
                <Badge
                  colorScheme="red"
                  fontSize="md"
                  px={4}
                  py={2}
                  borderRadius="full"
                >
                    {favorites.length} товаров
                </Badge>
              )}
            </HStack>

            {/* Content */}
            {isLoading ? (
              <SimpleGrid columns={{ base: 1, md: 2,  xl: 3, custom1600: 4 }} spacing={6}>
                {Array(8).fill(0).map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))}
              </SimpleGrid>
            ) : favorites.length === 0 ? (
              <Center py={20}>
                <VStack spacing={6}>
                  <Box
                    p={8}
                    bg={cardBg}
                    borderRadius="full"
                    border="2px dashed"
                    borderColor={borderColor}
                  >
                    <IoHeartOutline size="4rem" color="gray.400" />
                  </Box>
                  <VStack spacing={2}>
                    <Text fontSize="xl" fontWeight="600" color={headingColor}>
                      У вас пока нет избранных товаров
                    </Text>
                    <Text fontSize="md" color={textColor} textAlign="center">
                      Добавляйте интересные товары в избранное, чтобы не потерять их
                    </Text>
                  </VStack>
                </VStack>
              </Center>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2,  xl: 3, custom1600: 4 }} spacing={6}>
                {currentItems.map((item) => (
                  <FavoriteCard key={item.id} item={item} />
                ))}
              </SimpleGrid>
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <Flex justify="center" mt={4} mb={"50px"}>
                <HStack spacing={2}>
                  {/* First Page */}
                  <IconButton
                    icon={<FaAngleDoubleLeft />}
                    variant="outline"
                    size="md"
                    colorScheme='gray'
                    onClick={() => handlePageChange(1)}
                    isDisabled={currentPage === 1}
                    aria-label="Первая страница"
                    borderRadius="full"
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                  
                  {/* Previous Page */}
                  <IconButton
                    icon={<IoChevronBack />}
                    variant="outline"
                    size="md"
                    colorScheme='gray'
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                    aria-label="Предыдущая страница"
                    borderRadius="full"
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={page}
                        size="md"
                        variant={currentPage === page ? "solid" : "outline"}
                        colorScheme={currentPage === page ? "yellow" : "gray"}
                        onClick={() => handlePageChange(page)}
                        minW="12"
                        borderRadius="xl"
                        _hover={{ transform: 'scale(1.05)' }}
                        fontWeight="bold"
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  {/* Next Page */}
                  <IconButton
                    icon={<IoChevronForward />}
                    variant="outline"
                    size="md"
                    colorScheme='gray'
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                    aria-label="Следующая страница"
                    borderRadius="full"
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                  
                  {/* Last Page */}
                  <IconButton
                    icon={<FaAngleDoubleRight />}
                    variant="outline"
                    size="md"
                    colorScheme='gray'
                    onClick={() => handlePageChange(totalPages)}
                    isDisabled={currentPage === totalPages}
                    aria-label="Последняя страница"
                    borderRadius="full"
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                </HStack>
              </Flex>
            )}
          </VStack>
        </Fade>
      </Container>
    </Box>
  );
};

export default FavoritesPage;