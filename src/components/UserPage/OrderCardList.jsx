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
  useToast
} from '@chakra-ui/react';
import { AiOutlineEye, AiOutlinePhone, AiOutlineEnvironment } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const OrderCardList = ({ product }) => {
  const buttonSize = useBreakpointValue({ base: "xs", sm: "sm", md: "sm" });
  const buttonFontSize = useBreakpointValue({ base: "xs", sm: "sm", md: "sm" });
  const buttonPaddingX = useBreakpointValue({ base: 2, sm: 4 });

  const priceFontSize = useBreakpointValue({ base: "sm", custom900: "lg" });
  const pricePaddingX = useBreakpointValue({ base: 2, sm: 3 });
  const pricePaddingY = useBreakpointValue({ base: 1, sm: 1.5 });
  const toast = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate(); 

  // Responsive qiymatlar
  const titleSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const showFullInfo = useBreakpointValue({ base: false, md: true });

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Phone click handler
  const handlePhoneClick = useCallback((phone) => {
    if (phone) {
      toast({
        title: t("orderlist.phone", "Номер телефона"),
        description: `${t("orderlist.phone_desc", "Номер:")} ${phone}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: t("orderlist.phone_err", "Номер телефона отсутствует"),
        description: t("orderlist.phone_err_desc", "Для этого заказа не указан номер телефона"),
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

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
            onClick={() => handlePhoneClick(product.phones?.[0])}
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
              textTransform={"uppercase"}
            >
              {t("orderlist.lizing", "Лизинг")}
            </Badge>
          )}
        </Flex>

        {/* Tashkilot turi */}
        {product.author?.is_company && (
          <Text fontSize="sm" color="blue.600" fontWeight="medium">
            <Text as="span" color="gray.500">{t("productcard.company", "Компания:")}</Text>{' '}
            {product.author.company_type || ""}
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
              <Text fontSize="sm">{product.statistics?.viewed || 0}</Text>
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
OrderCardList.defaultProps = {
  product: null,
};