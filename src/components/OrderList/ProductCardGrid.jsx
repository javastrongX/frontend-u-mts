import { 
  Box, 
  Text, 
  Button, 
  HStack, 
  Badge, 
  VStack,
  Tooltip,
} from '@chakra-ui/react';
import { AiOutlineEye, AiOutlinePhone } from 'react-icons/ai';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useStats } from '../PostStats';

// Valyuta malumotlari
const CURRENCIES = [
  {
    id: 'uzs',
    symbol: "so'm",
  },
  {
    id: 'usd',
    symbol: '$',
  },
  {
    id: 'eur',
    symbol: '€',
  },
  {
    id: 'rub',
    symbol: '₽',
  }
];

export const ProductCardGrid = ({ product, onPhoneClick, formatDate }) => {
  // Stats hook ishlatish
  const { stats, track } = useStats(product?.id);
  
  const { t } = useTranslation();
  const navigate = useNavigate();

  // View tracking - Component mount bo'lganda
  useEffect(() => {
    if (product?.id) {
      track('views');
    }
  }, [product?.id, track]);

  // Ma'lumotlar mavjudligini tekshirish
  if (!product) {
    return (
      <Box
        bg="gray.100"
        h="180px"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="gray.500">{t("productcard.data_notfound", "Данные не найдены")}</Text>
      </Box>
    );
  }

  const handlePhoneClick = (e) => {
    e.stopPropagation();
    track('calls'); // Phone click ni track qilish
    if (onPhoneClick) {
      onPhoneClick(product.phones?.[0] || null, product);
    }
  };

  const handleNavigateClick = (e) => {
    if (e) e.stopPropagation();
    track('clicks'); // Click ni track qilish
    navigate(`/order-details/product/${product.slug}`);
  };

  const currencyId = product?.prices?.[0]?.currency;

  const currency = CURRENCIES.find(c => c.id === currencyId) || {
    symbol: 'so\'m',
  };

  return (
    <Box
      bg="white"
      h={{base: "220px", custom1080: '190px'}}
      borderRadius="md"
      boxShadow="sm"
      border="1px"
      borderColor="gray.200"
      overflow="hidden"
      _hover={{ 
        boxShadow: "lg", 
        transform: "translateY(-2px)",
        borderColor: "blue.400"
      }}
      transition="all 0.3s ease"
      p={4}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      cursor="pointer"
      position="relative"
      onClick={handleNavigateClick}
    >
      {/* Yuqori qism: Sarlavha va Telefon tugmasi */}
      <HStack justify="space-between" align="flex-start" mb={2} spacing={2}>
        <Tooltip 
          color={'p.black'} 
          bg="rgba(255, 255, 255, 0.4)" 
          label={product.title} 
          placement="top-start" 
          hasArrow
          sx={{
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          isDisabled={!product.title || product.title.length < 50}
          >
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="blue.400"
            cursor="pointer"
            noOfLines={2}
            flex={1}
            _hover={{ color: "blue.800" }}
            lineHeight="1.3"
            onClick={handleNavigateClick}
          >
            {product.title || t("productcard.no_title", "Заголовок не указан")}
          </Text>
        </Tooltip>
        
        <Button
          variant="outline"
          color={'blue.400'}
          size="xs"
          fontSize="xs"
          leftIcon={<AiOutlinePhone />}
          onClick={handlePhoneClick}
          minW="fit-content"
          px={2}
          py={1}
          h="auto"
          whiteSpace="nowrap"
        >
          {product.phones?.[0] ? t("productcard.show_phone", "Связаться") : " " }
        </Button>
      </HStack>

      {/* O'rta qism: Narx va Badge */}
      <HStack 
        onClick={handleNavigateClick} 
        justify="space-between" 
        mb={1}
        cursor="pointer"
      >
        <Text 
          fontSize="sm" 
          fontWeight="bold" 
          color="green.600"
          bg="green.50"
          px={2}
          py={1}
          borderRadius="md"
        >
          {product.prices?.[0]?.price || product.prices?.[0]?.type !== 'negotiable'
            ? `${product.prices[0].price} ${currency.symbol}` 
            : t("productcard.agreed", "Договорная")}
        </Text>
        
        {product.author?.is_official && (
          <Badge 
            bg={"blue.400"}
            fontSize="xs"
            variant="solid"
            borderRadius="full"
            px={2}
            textTransform={"uppercase"}
          >
            {t("orderlist.lizing", "Лизинг")}
          </Badge>
        )}
      </HStack>

      {/* Tavsif */}
      {product.sub_title && (
        <Text 
          fontSize="xs" 
          noOfLines={{base: 3, custom1080: 2}} 
          lineHeight={"18px"}
          onClick={handleNavigateClick}
          color="gray.600"
          mb={2}
          cursor="pointer"
        >
          {product.sub_title}
        </Text>
      )}

      {/* Kompaniya turi */}
      {product.author?.is_company && product.author?.is_company === true && (
        <Text fontSize="xs" color="blue.400" fontWeight="medium" mb={2}>
          {t("productcard.company", "Компания:")} {product.author.name || "UZMAT"}
        </Text>
      )}

      {/* Pastki qism: Sana, Joylashuv, Muallif, Ko'rishlar */}
      <VStack 
        onClick={handleNavigateClick} 
        spacing={1} 
        align="stretch"
        cursor="pointer"
      >
        <HStack justify="space-between" fontSize="xs" color="gray.500">
          <Text>{formatDate(product.created_at)}</Text>
          <HStack spacing={3}>
            <HStack spacing={1}>
              <Box w={2} h={2} bg="gray.400" borderRadius="full" />
              <Text noOfLines={1}>
                {product.city?.title ? `${product.city.title}` : t("productcard.no_city", "Не указано")}
              </Text>
            </HStack>
            
            <HStack spacing={1}>
              <Box w={2} h={2} bg="blue.400" borderRadius="full" />
              <Text noOfLines={1} maxW="80px">
                {product.author?.name || t("productcard.no_author", "Анонимно")}
              </Text>
            </HStack>
            
            {/* Ko'rishlar soni - Stats dan olinadi */}
            <HStack spacing={1}>
              <AiOutlineEye size={12} />
              <Text>{stats.views}</Text>
            </HStack>

          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};