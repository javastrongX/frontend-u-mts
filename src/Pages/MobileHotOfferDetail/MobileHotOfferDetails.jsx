import { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import {
  FaHeart,
  FaShare,
  FaEye,
  FaCog,
  FaChevronRight,
} from 'react-icons/fa';
import { useParams } from "react-router-dom";
import { ProductInfo } from '../HotOfferDetail/ProductInfo';
import { ImageGallery } from '../HotOfferDetail/ImageGallery';
import { SellerInfo } from '../HotOfferDetail/SellerInfo';

// Breadcrumb Component
const BreadcrumbNav = ({ category, title }) => {
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
              Bosh sahifa
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
};

// Characteristics Component - Responsive
const Characteristics = ({ characteristics }) => {
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });
  
  if (!characteristics || characteristics.length === 0) {
    return (
      <Text color="gray.500" textAlign="center" py={4}>
        Xususiyatlar mavjud emas
      </Text>
    );
  }

  return (
    <TableContainer>
      <Table variant="simple" size={tableSize}>
        <Tbody>
          {characteristics.map((char, index) => {
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
};

// Statistics Component - Responsive
const Statistics = ({ statistics }) => {
  if (!statistics) return null;

  const statsData = [
    { icon: FaEye, value: statistics.viewed || 0, label: "ko'rishlar", color: "gray" },
    { icon: FaHeart, value: statistics.favorite || 0, label: "sevimli", color: "red" },
    { icon: FaShare, value: statistics.share || 0, label: "ulashish", color: "blue.400" }
  ];

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
};

// Main Component - Fully Responsive
const MobileHotOfferDetails = () => {
  const { slug } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const toast = useToast();
  
  // Responsive values
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const gridGap = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const headingSize = useBreakpointValue({ base: 'md', md: 'lg' });

  useEffect(() => {
    const fetchCardsDetail = async () => {
      try {
        if (!slug) {
          throw new Error("Mahsulot slug parametri topilmadi");
        }
        
        const response = await fetch(`https://backend-u-mts.onrender.com/api/ads/${slug}`);
        const apiResponse = await response.json();
        
        if (!response.ok) {
          const errorMessage = apiResponse.message || "Ma'lumot topilmadi";
          throw new Error(errorMessage);
        }
        
        if (!apiResponse.success) {
          throw new Error(apiResponse.message || "API xatoligi");
        }

        const data = apiResponse.data;
        
        if (!data) {
          throw new Error("Ma'lumotlar bo'sh");
        }
        
        const transformedData = {
          id: data.id,
          title: data.title || "Noma'lum mahsulot",
          sub_title: data.sub_title || "",
          description: data.description || "Tavsif mavjud emas",
          category: data.category || { title: "Kategoriya ko'rsatilmagan" },
          city: data.city || { title: "Shahar ko'rsatilmagan" },
          created_at: data.created_at,
          rank_hot_offer: data.rank_hot_offer || false,
          rank_premium: data.rank_premium || false,
          is_favorite: data.is_favorite || false,
          images: data.images || [],
          prices: data.prices || [],
          phones: data.phones || [],
          characteristics: data.characteristics || [],
          author: data.author || { name: "Noma'lum", avatar: "", is_company: false, is_official: false },
          statistics: data.statistics || { viewed: 0, write: 0, called: 0, favorite: 0, share: 0, clicked: 0 },
          slug: data.slug,
          status: data.status,
          stickers: data.stickers || [],
          ad_promotions: data.ad_promotions || []
        };

        setDetails(transformedData);
        setIsLiked(data.is_favorite || false);
        
      } catch (err) {
        console.error("Mahsulotni yuklashda xatolik:", err);
        setError(err.message || "Noma'lum xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCardsDetail();
    } else {
      setError("Mahsulot URL parametri topilmadi");
      setLoading(false);
    }
  }, [slug]);

  const handleLike = async () => {
    try {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      const response = await fetch(`https://backend-u-mts.onrender.com/api/ads/${slug}/toggle-favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setIsLiked(!newLikedState);
        throw new Error(result.message || "Sevimlilarni yangilashda xatolik");
      }

      if (result.data && result.data.statistics) {
        setDetails(prev => ({
          ...prev,
          statistics: result.data.statistics
        }));
      }

      toast({
        title: newLikedState ? "Sevimlilar ro'yxatiga qo'shildi" : "Sevimlilardаn olib tashlandi",
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
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Havola nusxalandi",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  useEffect(() => {
    if (details && details.id && slug) {
      const trackView = async () => {
        try {
          const response = await fetch(`https://backend-u-mts.onrender.com/api/ads/${slug}/increment-view`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const result = await response.json();
          
          if (response.ok && result.success) {
            if (result.data && result.data.statistics) {
              setDetails(prev => ({
                ...prev,
                statistics: {
                  ...prev.statistics,
                  viewed: result.data.statistics.viewed
                }
              }));
            }
          }
        } catch (err) {
          console.error('View tracking error:', err);
        }
      };

      const timer = setTimeout(trackView, 1000);
      return () => clearTimeout(timer);
    }
  }, [details?.id, slug]);

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
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
                  Xatolik yuz berdi
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
                  Sahifani yangilash
                </Button>
                <Button 
                  variant="outline" 
                  colorScheme='blue'
                  color={'blue.400'}
                  onClick={() => window.history.back()}
                  size={{ base: 'md', md: 'lg' }}
                  w={{ base: 'full', sm: 'auto' }}
                >
                  Orqaga qaytish
                </Button>
              </Stack>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  if (!details) return null;

  return (
    <Box>
      <BreadcrumbNav category={details.category} title={details.title} />
      
      <Box maxW="container.xl" py={containerPadding}>
        <SlideFade in={true} offsetY="20px">
          <Grid 
            templateColumns={{ base: "1fr", custom900: "2fr 1fr" }} 
            gap={gridGap}
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
                  size={headingSize} 
                  mb={6} 
                  display="flex" 
                  alignItems="center"
                  flexWrap="wrap"
                  gap={2}
                >
                  <FaCog />
                  <Text>Xususiyatlar</Text>
                </Heading>
                <Card borderRadius="xl">
                  <CardBody p={{ base: 4, md: 6 }}>
                    <Characteristics characteristics={details.characteristics} />
                  </CardBody>
                </Card>
              </Box>

              <Divider my={{ base: 6, md: 8 }} />

              {/* Description */}
              <Box>
                <Heading size={headingSize} mb={6}>Tavsif</Heading>
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

              {/* Statistics */}
              <Box>
                <Heading size={headingSize} mb={6}>Statistika</Heading>
                <Card borderRadius="xl">
                  <CardBody p={{ base: 4, md: 6 }}>
                    <Statistics statistics={details.statistics} />
                  </CardBody>
                </Card>
              </Box>
            </GridItem>

            {/* Right Column */}
            <GridItem>
              <ScaleFade in={true} initialScale={0.9}>
                <SellerInfo 
                  author={details.author}
                  createdAt={details.created_at}
                />

                {/* Similar Products */}
                <Box mt={8} mb={40}>
                  <Heading 
                    size={{ base: 'sm', md: 'md' }} 
                    mb={6}
                    textAlign={{ base: 'center', md: 'left' }}
                  >
                    Sizga yoqishi mumkin
                  </Heading>
                  <Box display={'flex'} flexDir={{base: "column", custom380: "row", custom900: "column"}} alignItems={'flex-start'} gap={4}>
                    {[1, 2].map((item) => {
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
                                  O'xshash mahsulot {item}
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
              </ScaleFade>
            </GridItem>
          </Grid>
        </SlideFade>
      </Box>
    </Box>
  );
};

export default MobileHotOfferDetails;