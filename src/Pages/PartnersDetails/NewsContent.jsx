import React, { useState, useMemo, useCallback } from 'react';
import { 
  Badge, 
  Box, 
  Card, 
  CardBody, 
  Heading, 
  HStack, 
  Text, 
  VStack, 
  Image, 
  Flex,
  useBreakpointValue
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Pagination } from './Pagination';
import { FaRegNewspaper } from "react-icons/fa6";

// Mock data - в реальном приложении это будет приходить из API
const mockNewsData = [
  {
    id: 1,
    title: "Новые поступления запчастей John Deere",
    shortDesc: "В наш ассортимент поступили новые оригинальные запчасти для техники John Deere. Теперь доступны детали для моделей серии 6000 и 7000...",
    date: "15 мая 2024",
    category: "Новинки",
    categoryColor: "blue",
    image: ""
  },
  {
    id: 2,
    title: "Расширение складских площадей",
    shortDesc: "Мы увеличили наши складские мощности на 40% для лучшего обслуживания клиентов и более быстрой отгрузки товаров...",
    date: "28 апреля 2024",
    category: "Развитие",
    categoryColor: "green",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: "Новая система онлайн заказов",
    shortDesc: "Запущена обновленная система онлайн заказов с улучшенным интерфейсом и расширенными возможностями поиска запчастей...",
    date: "12 апреля 2024",
    category: "Технологии",
    categoryColor: "purple",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
  },
  {
    id: 4,
    title: "Партнерство с ведущими производителями",
    shortDesc: "Заключены новые партнерские соглашения с крупнейшими производителями сельскохозяйственной техники...",
    date: "05 апреля 2024",
    category: "Партнерство",
    categoryColor: "orange",
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400&h=250&fit=crop"
  },
  {
    id: 5,
    title: "Открытие нового филиала в Ташкенте",
    shortDesc: "В столице Узбекистана открыт новый филиал нашей компании с современным складом и центром обслуживания...",
    date: "22 марта 2024",
    category: "Расширение",
    categoryColor: "cyan",
    image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=400&h=250&fit=crop"
  },
  {
    id: 6,
    title: "Сертификация ISO 9001:2015",
    shortDesc: "Наша компания успешно прошла сертификацию по международному стандарту качества ISO 9001:2015...",
    date: "10 марта 2024",
    category: "Качество",
    categoryColor: "red",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
  }
];

// Кастомный хук для пагинации
const usePagination = (data, itemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);
  
  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);
  
  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);
  
  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};

// Оптимизированный компонент новостной карточки
const NewsCard = React.memo(({ news, isSmallScreen }) => {
  const { t } = useTranslation();
  
  // Оптимизированная функция для обработки ошибок загрузки изображений
  const handleImageError = useCallback((e) => {
    e.target.src = '/Images/d-image.png';
  }, []);
  
  const cardContent = (
    <>
      {/* Изображение */}
      <Box 
        flexShrink={0}
        w={isSmallScreen ? "200px" : "100%"}
        h={isSmallScreen ? "150px" : "200px"}
      >
        <Image
          src={news.image || '/Images/d-image.png'}
          alt={news.title}
          fallbackSrc='/Images/d-image.png'
          w="100%"
          h="100%"
          objectFit="cover"
          borderRadius={isSmallScreen ? "lg" : "xl xl 0 0"}
          onError={handleImageError}
          loading="lazy" // Ленивая загрузка для оптимизации
        />
      </Box>
      
      {/* Контент */}
      <Box flex="1" p={isSmallScreen ? 4 : 6}>
        <HStack justify="space-between" mb={3} flexWrap="wrap" gap={2}>
          <Badge 
            colorScheme={news.categoryColor} 
            px={isSmallScreen ? 2 : 3}
            py={1} 
            borderRadius="full"
            fontSize="xs"
          >
            {t(`partsmarketplace.newscontent.${news.category.toLowerCase()}`, news.category)}
          </Badge>
          <Text fontSize="xs" color="gray.500" flexShrink={0}>
            {news.date}
          </Text>
        </HStack>
        
        <Heading 
          size={isSmallScreen ? "sm" : "md"}
          mb={3} 
          color="gray.800"
          lineHeight="short"
          noOfLines={2}
        >
          {news.title}
        </Heading>
        
        <Text 
          fontSize="xs" 
          color="gray.600" 
          lineHeight="tall"
          noOfLines={isSmallScreen ? 2 : 3}
        >
          {news.shortDesc}
        </Text>
      </Box>
    </>
  );
  
  return (
    <Card 
      w="100%" 
      borderRadius={isSmallScreen ? "lg" : "xl"}
      border="1px" 
      borderColor="gray.100"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ 
        transform: "translateY(-1px)", 
        shadow: "sm" 
      }}
    >
      <CardBody p={0}>
        <Flex
          direction={isSmallScreen ? "row" : "column"}
          align={isSmallScreen ? "center" : "stretch"}
        >
          {cardContent}
        </Flex>
      </CardBody>
    </Card>
  );
});



// Empty state komponenti
const EmptyState = React.memo(() => {
  const { t } = useTranslation();
  
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      py={8}
      px={4}
      textAlign="center"
    >
      <Box
        w="80px"
        h="80px"
        bg="gray.100"
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={4}
      >
        <Text color="gray.400"><FaRegNewspaper size={35}/></Text>
      </Box>
      
      <Heading fontSize={{base: "16px", sm: "18px"}} color="gray.600" mb={3}>
        {t("partsmarketplace.newscontent.no_news_title", "Янгиликлар йўқ")}
      </Heading>
      
      <Text color="gray.500" maxW="300px" lineHeight="tall" fontSize="sm">
        {t("partsmarketplace.newscontent.no_news_desc", "Ҳозирча янги хабарлар йўқ. Тез орада қизиқарли янгиликлар билан қайтамиз!")}
      </Text>
    </Flex>
  );
});

export const NewsContent = () => {
  const { t } = useTranslation();
  const isSmallScreen = useBreakpointValue({ base: false, sm: true });
  
  // Использование кастомного хука для пагинации
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    hasNext,
    hasPrev
  } = usePagination(mockNewsData, 5);
  
  // В реальном приложении здесь будет API запрос
  // const { data: newsData, loading, error } = useNewsAPI({
  //   page: currentPage,
  //   limit: 5
  // });
  
  // Agar yangiliklar bo'lmasa
  const hasNews = mockNewsData && mockNewsData.length > 0;
  
  return (
    <Box mb={{base: "60px", custom900: '10px'}}>
      <Heading 
        size={isSmallScreen ? "md" : "sm"}
        mb={4} 
        color="gray.800"
      >
        {t("partsmarketplace.newscontent.title", "Новости компании")}
      </Heading>
      
      {hasNews ? (
        <>
          <VStack spacing={4} align="stretch">
            {paginatedData.map((news) => (
              <NewsCard 
                key={news.id} 
                news={news} 
                isSmallScreen={isSmallScreen}
              />
            ))}
          </VStack>
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </>
      ) : (
        <EmptyState />
      )}
    </Box>
  );
};

// Экспорт хука для использования в других компонентах
export { usePagination };