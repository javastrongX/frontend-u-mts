import { 
  Box, 
  Text, 
  Button, 
  HStack, 
  VStack,
  Flex,
  Badge,
  Tooltip,
  useBreakpointValue,
  Skeleton,
  SkeletonText
} from '@chakra-ui/react';
import { AiOutlineEye, AiOutlinePhone, AiOutlineEnvironment } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const ProductCardList = ({ 
  product, 
  onPhoneClick, 
  isLoading = false,
  formatDate
}) => {
  const [viewCount, setViewCount] = useState(product?.statistics?.viewed || 0);


  const buttonSize = useBreakpointValue({ base: "xs", sm: "sm", md: "sm" });
  const buttonFontSize = useBreakpointValue({ base: "xs", sm: "sm", md: "sm" });
  const buttonPaddingX = useBreakpointValue({ base: 2, sm: 4 });

  const priceFontSize = useBreakpointValue({ base: "sm", custom900: "lg" });
  const pricePaddingX = useBreakpointValue({ base: 2, sm: 3 });
  const pricePaddingY = useBreakpointValue({ base: 1, sm: 1.5 });

  const { t } = useTranslation();
  const navigate = useNavigate(); 

  // ViewCount logic
  useEffect(() => {
    if (!product?.id) return;

    const viewedKey = `viewed-equipment-${product.id}`;
    const alreadyViewed = localStorage.getItem(viewedKey);

    if (!alreadyViewed) {
      localStorage.setItem(viewedKey, "true");

      fetch(`https://backend-u-mts.onrender.com/api/equipment/${product.id}/increment-view`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setViewCount(data.views);
        })
        .catch((err) => console.error("View count error:", err));
    } else {
      setViewCount(product.statistics?.viewed || 0);
    }
  }, [product?.id, product?.statistics?.viewed]);

  // Responsive qiymatlar
  const titleSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const showFullInfo = useBreakpointValue({ base: false, md: true });

  // Loading holati
  if (isLoading) {
    return (
      <Box
        bg="white"
        borderRadius="md"
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

  // Ma'lumotlar tekshiruvi
  if (!product) {
    return (
      <Box
        bg="gray.50"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        p={4}
        textAlign="center"
      >
        <Text color="gray.500" fontSize="sm">
          {t("productcard.data_notfound", "Данные не найдены")}
        </Text>
      </Box>
    );
  }

  const handlePhoneClick = (e) => {
    e.stopPropagation();
    if (onPhoneClick) {
      onPhoneClick(product.phones?.[0] || null, product);
    }
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      border="1px"
      borderColor="gray.200"
      p={4}
      _hover={{ 
        boxShadow: 'lg',
        borderColor: 'blue.300',
        transform: 'translateY(-1px)'
      }}
      transition="all 0.3s ease"
      cursor="pointer"

      position="relative"
      w={"100%"}
    >
      <VStack align="stretch" spacing={3}>
        {/* Sarlavha va Telefon tugmasi */}
        <Flex 
          justify="space-between" 
          align="flex-start"
          wrap={{ base: 'wrap', md: 'nowrap' }}
        >
          <Tooltip 
            label={product.title} 
            placement="top-start" 
            hasArrow
            isDisabled={!product.title || product.title.length < 50}
            sx={{
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
            bg={"rgba(255, 255, 255, 0.4)"}
            color="p.black"
          >
            <Text
              fontSize={titleSize}
              fontWeight="semibold"
              color="blue.400"
              _hover={{ color: 'blue.800' }}
              cursor="pointer"
              flex={1}
              lineHeight="1.4"
              noOfLines={3}
              onClick={() => navigate(`/order-details/product/${product.slug}`)}
            >
              {product.title || t("productcard.no_title", "Заголовок не указан")}
            </Text>
          </Tooltip>
          
          <Button
            variant="outline"
            color="blue.400"
            size={buttonSize}
            leftIcon={<AiOutlinePhone size={16} />}
            onClick={handlePhoneClick}
            flexShrink={0}
            fontSize={buttonFontSize}
            px={buttonPaddingX}
            transition="all 0.2s"
          >
            {product.phones?.[0] ? t("productcard.show_phone", "Связаться") : " "}
          </Button>
        </Flex>

        {/* Qisqacha tavsif */}
        {product.sub_title && (
          <Text 
            fontSize="sm"
            onClick={() => navigate(`/order-details/product/${product.slug}`)} 
            color="gray.600" 
            lineHeight="1.5"
            noOfLines={3}
          >
            {product.sub_title}
          </Text>
        )}

        {/* Narx va Badge */}
        <Flex onClick={() => navigate(`/order-details/product/${product.slug}`)} justify="space-between" align="center" wrap="wrap" gap={2}>
          <Text 
            fontSize={priceFontSize}
            color="green.600"
            fontWeight="bold"
            bg="green.50"
            px={pricePaddingX}
            py={pricePaddingY}
            borderRadius="md"
            border="1px"
            borderColor="green.200"
          >
            {product.prices?.[0]?.price 
              ? `${product.prices[0].price} ${product.prices[0].currency?.symbol}` 
              : t("productcard.agreed", "Договорная")}
          </Text>
          
          {product.author?.is_official && (
            <Badge 
              bg={'blue.400'}
              fontSize="xs" 
              px={3}
              py={1}
              borderRadius="full"
              variant="solid"
            >
              LIZING
            </Badge>
          )}
        </Flex>

        {/* Tashkilot turi */}
        {product.author?.is_company && (
          <Text fontSize="sm" color="blue.600" fontWeight="medium">
            <Text as="span" color="gray.500">{t("productcard.company", "Компания:")}</Text>{' '}
            {product.author.company_type || "IP"}
          </Text>
        )}

        {/* Pastki qator: Joylashuv, Sana, Ko'rishlar */}
        <Flex 
          justify="space-between" 
          align="center" 
          fontSize="sm" 
          color="gray.500"
          wrap={{ base: 'wrap', md: 'nowrap' }}
          gap={2}
        >
          <HStack 
            spacing={showFullInfo ? 4 : 2} 
            wrap="wrap"
            divider={showFullInfo ? <Box w="1px" h="16px" bg="gray.300" /> : null}
          >
            {/* Joylashuv */}
            <HStack spacing={1} minW="fit-content">
              <AiOutlineEnvironment size={14} color="gray" />
              <Text fontSize="sm" noOfLines={1}>
                {product.city?.title ? `${product.city.title}` : t("productcard.no_city", "Не указано")}
              </Text>
            </HStack>
            
            {/* Muallif */}
            <HStack spacing={1} minW="fit-content">
              <Box w={2} h={2} bg="blue.400" borderRadius="full" />
              <Text fontSize="sm" noOfLines={1} maxW="120px">
                {product.author?.name || t("productcard.no_author", "Анонимно")}
              </Text>
            </HStack>

            {/* Sana */}
            {showFullInfo && (
              <Text fontSize="sm" minW="fit-content">
                {formatDate(product.created_at)}
              </Text>
            )}
          </HStack>

          <HStack spacing={3} align="center" flexShrink={0}>
            {/* Ko'rishlar soni */}
            <HStack spacing={1}>
              <AiOutlineEye size={14} />
              <Text fontSize="sm">{viewCount}</Text>
            </HStack>
          </HStack>
        </Flex>

        {/* Mobil uchun sana (agar showFullInfo false bo'lsa) */}
        {!showFullInfo && (
          <Text fontSize="xs" color="gray.400" textAlign="right">
            {formatDate(product.created_at)}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

// PropTypes
ProductCardList.defaultProps = {
  product: null,
  onPhoneClick: null,
  onTitleClick: null,
  isLoading: false,
};