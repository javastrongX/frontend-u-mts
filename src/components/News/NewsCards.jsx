import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardBody, 
  Heading, 
  Image, 
  Text, 
  VStack, 
  HStack, 
  Badge, 
  Container, 
  Center, 
  Button,
  IconButton,
  useBreakpointValue,
  Flex,
  Skeleton,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";

import Pagination from "./Pagination";
import { LoadingComponent } from "./SkeletonComponents";
import ShareModal from "./ShareModal";
import { FaEye as Eye, FaShare, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStats, statsManager } from "../PostStats"; // statsManager ni ham import qilish

const NewsCards = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [selectedNewsForShare, setSelectedNewsForShare] = useState(null);
  const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();
  const limit = 10;

  // NewsCards komponenti uchun stats tracking
  const { track } = useStats('news-cards-component');

  // Responsive breakpoint - faqat custom900 dan keyin view mode
  const isDesktop = useBreakpointValue({ base: false, custom900: true });

  // Fetch news data from API with pagination
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * limit;
        
        const response = await fetch(`/api/news/paginated?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        setNews(data.news || []);
        setTotalNews(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / limit));
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  // Component mount bo'lganda views ni track qilish
  useEffect(() => {
    track('views');
  }, [track]);

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle share with PostStats tracking
  const handleShare = (newsItem, event) => {
    event.stopPropagation(); // Prevent card click
    setSelectedNewsForShare(newsItem);
    onShareOpen();
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('ru-RU', { month: 'long' });
    const time = date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `${day} ${month} ${time}`;
  };

  // Unique key generator
  const generateUniqueKey = (newsItem, index) => {
    return `news-${newsItem.id}-page-${currentPage}-index-${index}`;
  };

  // Responsive icon sizes
  const iconSize = useBreakpointValue({ base: 10, md: 12 });
  const eyeIconSize = useBreakpointValue({ base: 10, md: 12 });

  // News card component with stats
  const NewsCardWithStats = ({ newsItem, index }) => {
    // Har bir news item uchun alohida stats
    const { stats } = useStats(`news-${newsItem.id}`);
    
    return (
      <Card
        key={generateUniqueKey(newsItem, index)}
        maxW={{base: "100%", custom900: "85%"}}
        minH={"100%"}
        display="flex"
        direction="row"
        overflow="hidden"
        variant="outline"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          shadow: 'lg',
          transform: 'translateY(-2px)',
        }}
        onClick={() => handleViewIncrement(newsItem.id)}
      >
        {/* Image section */}
        <Image
          onClick={() => navigate(`/news/${newsItem.id}`)}
          objectFit="cover"
          w={{ base: '140px', md: '160px', custom900: '280px' }}
          src={newsItem.poster}
          alt={newsItem.title}
          flexShrink={1}
          fallback={
            <Skeleton 
              w={{ base: '140px', md: '160px', custom900: '280px' }} 
            />
          }
        />

        {/* Content section */}
        <Box flex="1" display="flex" flexDirection="column" minW="0" h="full">
          <CardBody  
            pl={{ base: 3, md: 4, custom900: 6 }} 
            pr={{ base: 3, md: 4, custom900: 6 }}
            pb={0}
            pt={{base: 3, md: 4, custom900: 6}}   
            display="flex"
            flexDirection="column"
            justifyContent={'space-between'}
          >
            {/* Main content area */}
            <VStack onClick={() => navigate(`/news/${newsItem.id}`)} align="start" flex="1" w="full">
              {/* Title */}
              <Heading 
                fontSize={{ base: "sm", md: "md", custom900: "lg" }} 
                lineHeight="1.3"
                color="gray.800"
                noOfLines={{ base: 2, custom900: 2 }}
                w="full"
              >
                {newsItem.title}
              </Heading>
              
              {/* Description */}
              <Text 
                color="gray.600" 
                fontSize={{ base: "xs", md: "sm", custom900: "sm" }}
                lineHeight="1.4"
                noOfLines={{ base: 2, md: 3, custom900: 3 }}
                flex="1"
                w="full"
              >
                {newsItem.short_description}
              </Text>

              {/* Tags section - better positioning */}
              <Box w="full">
                <HStack 
                  spacing={{ base: 1, md: 2 }}
                  overflowX="auto"
                  overflowY="hidden"
                  pb={1}
                  sx={{
                    overflow: 'scroll',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none',            
                    }
                  }}
                >
                  {newsItem.news_tags && newsItem.news_tags.map((tag, tagIndex) => (
                    <Badge
                      key={`tag-${tag.id}-${tagIndex}`}
                      colorScheme="blue"
                      variant="subtle"
                      fontSize={{ base: "9px", md: "10px", custom900: "xs" }}
                      px={{ base: 2, md: 2, custom900: 3 }}
                      py={1}
                      borderRadius="full"
                      whiteSpace="nowrap"
                      flexShrink={0}
                    >
                      {tag.title}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            </VStack>
            
            {/* Bottom section with date, views and share */}
            <Box
              w="full"
              mt={1}
              p={"3px"}
              borderTop="1px"
              borderColor="gray.100"
            >
              <HStack 
                justify="space-between" 
                w="full"
                spacing={{ base: 2, custom900: 4 }}
                fontSize={{ base: "10px", md: "xs", custom900: "sm" }}
                color="gray.500"
              >
                <HStack spacing={1} flex="1" minW="0">
                  <FaCalendarAlt size={iconSize} />
                  <Text 
                    isTruncated
                    fontSize={{ base: "9px", md: "10px", custom900: "xs" }}
                  >
                    {formatDate(newsItem.created_at)}
                  </Text>
                </HStack>
                
                <HStack spacing={{ base: 2, custom900: 3 }} flexShrink={0}>
                  <HStack spacing={1}>
                    <Eye size={eyeIconSize} />
                    <Text fontSize={{ base: "9px", md: "10px", custom900: "xs" }}>
                      {/* PostStats dan views ko'rsatish yoki API dan */}
                      {stats.views > 0 ? stats.views : (newsItem.views || 0)}
                    </Text>
                  </HStack>
                  
                  <Tooltip label={t("hotOfferDetail.label_ulashish", "Поделиться")}>
                    <IconButton
                      icon={<FaShare />}
                      size={{ base: "xs", custom900: "sm" }}
                      variant="ghost"
                      color={'blue.400'}
                      onClick={(e) => handleShare(newsItem, e)}
                      _hover={{ bg: 'blue.50' }}
                      borderRadius="full"
                    />
                  </Tooltip>
                </HStack>
              </HStack>
            </Box>
          </CardBody>
        </Box>
      </Card>
    );
  };

  // Error state
  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <VStack spacing={4}>
            <Text color="red.500" fontSize="lg" textAlign="center">
              {t("partners.error_download", "❌ Ошибка загрузки:")} {error}
            </Text>
            <Button 
              colorScheme="blue" 
              onClick={() => window.location.reload()}
            >
              {t("adsfilterblock.refresh","Попробовать снова")}
            </Button>
          </VStack>
        </Center>
      </Container>
    );
  }

  // Loading state
  if (loading) {
    return <LoadingComponent isDesktop={isDesktop} />;
  }

  return (
    <Box maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header with title */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <VStack align="start" spacing={1}>
            <Heading size="xl" color="gray.800">
              {t("newscards.news", "Новости")}
            </Heading>
            <Text color="gray.500" fontSize="sm">
              {t("adsfilterblock.total", "Всего:")} {totalNews} {t("newscards.new", "новости")}
            </Text>
          </VStack>
        </Flex>
        
        {/* News List */}
        <VStack spacing={6} align="stretch">
          {news.map((newsItem, index) => (
            <NewsCardWithStats 
              key={generateUniqueKey(newsItem, index)}
              newsItem={newsItem} 
              index={index} 
            />
          ))}
        </VStack>
        
        {/* Empty state */}
        {news.length === 0 && !loading && (
          <Center py={12}>
            <VStack spacing={4}>
              <Text fontSize="6xl">📰</Text>
              <Heading size="md" color="gray.500">
                {t("newscards.no_news", "Новости не найдены")}
              </Heading>
              <Text color="gray.400" textAlign="center">
                {t("newscards.no_news_msg", "В данный момент новостей нет.")}<br />
                {t("newscards.no_news_msg_2", "Попробуйте обновить страницу позже.")}
              </Text>
              <Button 
                colorScheme="blue" 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                {t("adsfilterblock.refresh", "Обновить")}
              </Button>
            </VStack>
          </Center>
        )}
        
        {/* Pagination */}
        {!loading && news.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </VStack>

      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareOpen} 
        onClose={onShareClose} 
        newsItem={selectedNewsForShare}
      />
    </Box>
  );
};

export default NewsCards;