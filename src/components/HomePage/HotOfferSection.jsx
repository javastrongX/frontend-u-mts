import {
  Box,
  Image,
  Flex,
  Icon,
  Text,
  Tooltip,
  IconButton,
  useBreakpointValue,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { GiFlame } from "react-icons/gi";
import { useEffect, useState, useRef, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MAX_PER_PAGE = 14;

const HotOfferSection = () => {
  const { t } = useTranslation();
  const flameLink = "/";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, custom1130: false });

  // Ref for scroll container
  const scrollRef = useRef(null);

  // API dan hot offers ni olish
  useEffect(() => {
    const fetchHotOffers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://backend-u-mts.onrender.com/api/hot-offers");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Hot offers ni olishda xatolik:", err);
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchHotOffers();
  }, []);

  // Mahsulot bosilganda ko'rishlar sonini oshirish va sahifaga o'tish
  const handleProductClick = useCallback(async (product) => {
    // Slug mavjudligini tekshirish
    if (!product.slug) {
      console.error("Product slug mavjud emas:", product);
      return;
    }

    try {
      // Ko'rishlar sonini oshirish
      await fetch(`/api/hot-offers/${product.id}/increment-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Sahifaga o'tish
      navigate(`/hot-offers/product/${product.slug}`);
    } catch (err) {
      console.error("Ko'rishlar sonini oshirishda xatolik:", err);
      // Xatolik bo'lsa ham sahifaga o'tish (agar slug mavjud bo'lsa)
      navigate(`/product/${product.slug}`);
    }
  }, [navigate]);

  // Pagination logic for desktop
  const totalPages = Math.ceil(products.length / MAX_PER_PAGE);
  const currentItems = products.slice(
    page * MAX_PER_PAGE,
    (page + 1) * MAX_PER_PAGE
  );

  // Scroll amount per click
  const scrollAmount = 300;

  // Scroll handlers for mobile
  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  }, [scrollAmount]);

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, [scrollAmount]);

  const prevPage = useCallback(() => setPage((p) => Math.max(p - 1, 0)), []);
  const nextPage = useCallback(() => setPage((p) => Math.min(p + 1, totalPages - 1)), [totalPages]);

  // Loading holatini ko'rsatish
  if (loading) {
    return (
      <Box w="100%" px={4} mt={3}>
        <Flex align="center" justify="flex-start" mb={{base: 3, custom900: 5}} gap={4}>
          <Text fontWeight="700" fontSize={{base: "16px", custom900: '22px'}}>
            {t("hot_offers.hot_offer")}
          </Text>
        </Flex>
        <Flex justify="center" align="center" minH="150px">
          <Spinner size="lg" color="orange.500" />
        </Flex>
      </Box>
    );
  }

  // Xatolik holatini ko'rsatish
  if (error) {
    return (
      <Box w="100%" px={4} mt={3}>
        <Flex align="center" justify="flex-start" mb={{base: 3, custom900: 5}} gap={4}>
          <Text fontWeight="700" fontSize={{base: "16px", custom900: '22px'}}>
            {t("hot_offers.hot_offer")}
          </Text>
        </Flex>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  // Mahsulotlar yo'q bo'lsa
  if (products.length === 0) {
    return (
      <Box w="100%" px={4} mt={3}>
        <Flex align="center" justify="flex-start" mb={{base: 3, custom900: 5}} gap={4}>
          <Text fontWeight="700" fontSize={{base: "16px", custom900: '22px'}}>
            {t("hot_offers.hot_offer")}
          </Text>
        </Flex>
        <Box textAlign="center" py={8}>
          <Text color="gray.500">Hozircha hot offer mahsulotlar yo'q</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box w="100%" px={4} mt={3}>
      <Flex align="center" justify="flex-start" mb={{base: 3, custom900: 5}} gap={4}>
        <Text fontWeight="700" fontSize={{base: "16px", custom900: '22px'}}>
          {t("hot_offers.hot_offer")}
        </Text>
        <Text
          color="blue.200"
          cursor="pointer"
          fontWeight="400"
          fontSize={'14px'}
          as="a"
          href={flameLink}
        >
          {t("hot_offers.iwannaCome")}
        </Text>
        <Tooltip
          hasArrow
          label={t("hot_offers.hot_offer")}
          bg="rgba(255, 255, 255, 0.4)"
          color="p.black"
          p={2}
          boxShadow="lg"
          borderRadius="xl"
          fontSize="14px"
          sx={{
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <Text
            fontSize={{ base: "xs", custom1130: "sm" }}
            cursor="pointer"
            as={"a"}
            href={flameLink}
            color="orange.200"
          >
            <Icon fontSize="18px" as={GiFlame} />
          </Text>
        </Tooltip>
      </Flex>

      <Box>
        <Box
          minH={"150px"}
          overflowX={isMobile ? "auto" : "visible"}
          ref={isMobile ? scrollRef : null}
        >
          <Flex
            wrap={isMobile ? "nowrap" : "wrap"}
            justify="flex-start"
            gap={{ base: 1, custom900: 3 }}
            w={isMobile ? "max-content" : "100%"}
          >
            {(isMobile ? products : currentItems).map((item, index) => (
              <Box
                key={`hot-offer-${item.id}-${index}`}
                position="relative"
                w="145px"
                h="140px"
                m={{ base: 2, custom900: 0 }}
                flex={isMobile ? "0 0 auto" : "initial"}
                overflow="hidden"
                borderRadius="lg"
                boxShadow="md"
                transition="all 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
                role="group"
              >
                <Image
                  src={item.images?.[0]?.url || '/Images/d-image.png'}
                  alt={item.title || 'Product image'}
                  objectFit="cover"
                  onClick={() => handleProductClick(item)}
                  w="100%"
                  h="100%"
                  _hover={{ cursor: "pointer" }}
                  fallbackSrc="/Images/d-image.png"
                />

                {/* Top text */}
                <Text
                  position="absolute"
                  top={0}
                  left={0}
                  w="100%"
                  bg="rgba(0,0,0,0.6)"
                  color="white"
                  fontSize="sm"
                  fontWeight="bold"
                  px={2}
                  py={1}
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  transition="all 0.2s ease"
                  noOfLines={1}
                >
                  {item.title || 'Mahsulot nomi'}
                </Text>

                {/* Bottom text - price va description */}
                <Text
                  position="absolute"
                  bottom={0}
                  left={0}
                  w="100%"
                  bg="rgba(0,0,0,0.6)"
                  color="white"
                  fontSize="xs"
                  px={2}
                  py={1}
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  transition="all 0.2s ease"
                  noOfLines={2}
                >
                  {item.prices?.[0]?.price 
                    ? `${item.prices[0].price.toLocaleString()} ${item.prices[0].currency?.symbol || '₸'}`
                    : item.sub_title || item.description || 'Narx ko\'rsatilmagan'
                  }
                </Text>

                {/* Hot offer badge */}
                {item.rank_hot_offer && (
                  <Box
                    _groupHover={{ opacity: 0 }}
                    transition={"opacity 0.3s ease"}
                    position="absolute"
                    top={2}
                    left={2}
                    bg="red.500"
                    color="white"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={2}
                  >
                    <Icon as={GiFlame} mr={1} />
                    <Text>HOT</Text>
                  </Box>
                )}
              </Box>
            ))}
          </Flex>
        </Box>

        <Flex justify="flex-end" gap={2} align="center" mt={4}>
          {isMobile ? (
            <>
              <IconButton
                icon={<FaChevronLeft />}
                onClick={scrollLeft}
                aria-label="Oldingi"
                _hover={{border: "1px solid", borderColor: 'orange.50', bg: 'orange.100'}}
              />
              <IconButton
                icon={<FaChevronRight />}
                onClick={scrollRight}
                aria-label="Keyingi"
                _hover={{border: "1px solid", borderColor: 'orange.50', bg: 'orange.100'}}
              />
            </>
          ) : (
            <>
              <IconButton
                icon={<FaChevronLeft />}
                onClick={prevPage}
                isDisabled={page === 0}
                aria-label="Oldingi"
                _hover={{border: "1px solid", borderColor: 'orange.50', bg: 'orange.100'}}
              />
              <IconButton
                icon={<FaChevronRight />}
                onClick={nextPage}
                isDisabled={page >= totalPages - 1}
                aria-label="Keyingi"
                _hover={{border: "1px solid", borderColor: 'orange.50', bg: 'orange.100'}}
              />
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default HotOfferSection;