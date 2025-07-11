import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Skeleton,
  SkeletonText,
  Badge,
  Image,
  IconButton,
  Divider,
  Container,
  Avatar,
  useDisclosure,
  Flex,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { FaEye, FaShareAlt } from "react-icons/fa";
import ShareModal from "../../components/News/ShareModal";

const SharedNews = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await fetch(`https://backend-u-mts.onrender.com/api/news/${id}`);
        if (!response.ok) throw new Error("Ma'lumot topilmadi");
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err.message || "Xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [id]);

  if (loading)
    return (
      <Container maxW={{ base: "100%", md: "4xl", lg: "6xl" }} py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
        <VStack align="stretch" spacing={{ base: 4, md: 6 }}>
          <Skeleton height={{ base: "24px", md: "32px" }} width={{ base: "80%", md: "60%" }} />
          <Skeleton height="20px" width={{ base: "60%", md: "40%" }} />
          <Skeleton height="20px" width={{ base: "50%", md: "30%" }} />
          <Skeleton 
            height={{ base: "200px", md: "320px", lg: "400px" }} 
            borderRadius="md" 
          />
          <SkeletonText mt="4" noOfLines={{ base: 4, md: 6 }} spacing="4" />
        </VStack>
      </Container>
    );

  if (error)
    return (
      <Container maxW={{ base: "100%", md: "4xl", lg: "6xl" }} py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
        <Text color="red.500" fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>
          {error}
        </Text>
      </Container>
    );

  if (!news)
    return (
      <Container maxW={{ base: "100%", md: "4xl", lg: "6xl" }} py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
        <Text color="gray.500" fontSize={{ base: "md", md: "lg" }}>Yangilik topilmadi</Text>
      </Container>
    );

  return (
    <Container mb={'80px'} maxW={{ base: "100%", md: "4xl", lg: "6xl" }} py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
      <VStack align="stretch" spacing={{ base: 4, md: 6, lg: 8 }}>
        {/* Breadcrumbs */}
        <Text 
          fontSize={{ base: "xs", md: "sm" }} 
          color="gray.500"
          display={{ base: "none", sm: "block" }}
        >
          <Text as={'a'} href={`/`}>Главная</Text> &nbsp;/&nbsp; <Text as={'a'} href={`/news`}>Новости</Text> &nbsp;/&nbsp;{" "}
          <span style={{ color: "#222" }}>{news.title}</span>
        </Text>

        {/* Header section with title and share button */}
        <Flex 
          direction={{ base: "column", md: "row" }} 
          justify="space-between" 
          align={{ base: "stretch", md: "flex-start" }}
          gap={{ base: 4, md: 6 }}
        >
          <Box flex="1">
            {/* Title */}
            <Heading 
              size={{ base: "md", md: "lg", lg: "xl" }} 
              color="gray.800" 
              fontWeight="bold"
              lineHeight={{ base: 1.3, md: 1.4 }}
              mb={{ base: 3, md: 4 }}
            >
              {news.title}
            </Heading>

            {/* Meta information */}
            <Flex 
              direction={{ base: "column", sm: "row" }}
              align={{ base: "flex-start", sm: "center" }}
              gap={{ base: 2, sm: 4 }}
              color="gray.500" 
              fontSize={{ base: "xs", md: "sm" }}
              mb={{ base: 3, md: 0 }}
            >
              <Text>
                {new Date(news.created_at).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <HStack>
                <FaEye />
                <Text>{news.views || 0}</Text>
              </HStack>
            </Flex>
          </Box>

          {/* Share Button */}
          <Box alignSelf={{ base: "flex-start", md: "flex-start" }}>
            <HStack>
              <IconButton
                aria-label="Поделиться"
                icon={<FaShareAlt />}
                colorScheme="yellow"
                variant="solid"
                size={{ base: "sm", md: "md" }}
                onClick={onOpen}
              />
              <Text 
                fontWeight="bold" 
                color="gray.700" 
                fontSize={{ base: "sm", md: "md" }}
                display={{ base: "none", sm: "block" }}
              >
                Поделиться
              </Text>
            </HStack>
          </Box>
        </Flex>

        {/* Main content area */}
        <Box>
          {/* Image */}
          <Box 
            borderRadius={{ base: "md", md: "lg" }} 
            overflow="hidden"
            mb={{ base: 4, md: 6 }}
            boxShadow={{ base: "none", md: "md" }}
          >
            <Image
              src={news.poster}
              alt={news.title}
              w="100%"
              h={{ base: "200px", sm: "280px", md: "400px", lg: "500px" }}
              objectFit="cover"
              flexShrink={0}
            />
          </Box>

          {/* Short Description */}
          <Text 
            fontSize={{ base: "md", md: "lg" }} 
            color="gray.600" 
            fontWeight="medium"
            lineHeight={{ base: 1.5, md: 1.6 }}
            mb={{ base: 4, md: 6 }}
          >
            {news.short_description}
          </Text>

          {/* Tags */}
          {news.news_tags && news.news_tags.length > 0 && (
            <Box mb={{ base: 4, md: 6 }}>
              <Wrap spacing={{ base: 2, md: 3 }}>
                {news.news_tags.map((tag) => (
                  <WrapItem key={tag.id}>
                    <Badge
                      colorScheme="yellow"
                      variant="subtle"
                      fontSize={{ base: "xs", md: "sm" }}
                      px={{ base: 2, md: 3 }}
                      py={{ base: 1, md: 1 }}
                      borderRadius="full"
                    >
                      #{tag.title}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          )}
        </Box>

        <Divider />

        {/* Author section */}
        <Flex 
          direction={{ base: "column", sm: "row" }}
          align={{ base: "flex-start", sm: "center" }}
          justify="space-between"
          pt={{ base: 2, md: 4 }}
          gap={{ base: 3, sm: 4 }}
        >
          <HStack spacing={{ base: 3, md: 4 }}>
            <Avatar 
              size={{ base: "sm", md: "md" }} 
              name="TService.uz" 
            />
            <VStack align="flex-start" spacing={0}>
              <Text 
                fontWeight="medium" 
                color="gray.700"
                fontSize={{ base: "sm", md: "md" }}
              >
                TService.uz
              </Text>
              <Text 
                fontSize={{ base: "xs", md: "sm" }} 
                color="gray.500"
                display={{ base: "none", md: "block" }}
              >
                Автор новости
              </Text>
            </VStack>
          </HStack>

          {/* Additional actions for larger screens */}
          <Box display={{ base: "none", lg: "block" }}>
            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.500">
                Понравилась статья?
              </Text>
              <IconButton
                aria-label="Поделиться снова"
                icon={<FaShareAlt />}
                size="sm"
                variant="ghost"
                colorScheme="gray"
                onClick={onOpen}
              />
            </HStack>
          </Box>
        </Flex>
      </VStack>

      {/* Share Modal */}
      <ShareModal isOpen={isOpen} onClose={onClose} newsItem={news} />
    </Container>
  );
};

export default SharedNews;