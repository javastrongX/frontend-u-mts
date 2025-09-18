import { 
  Badge, 
  Box, 
  Button, 
  Heading, 
  HStack, 
  IconButton, 
  Text, 
  Tooltip, 
  VStack,
  useBreakpointValue,
  Flex,
  Stack,
  SimpleGrid
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { 
  FaCalendarAlt, 
  FaEnvelope, 
  FaFacebook, 
  FaFire, 
  FaHeart, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaShare, 
  FaTelegram, 
  FaWhatsapp 
} from "react-icons/fa";

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

// Product Info Component - Fully Responsive
export const ProductInfo = ({ details, isLiked, onLike, onShare }) => {
  
  const { t } = useTranslation();

  // Responsive values
  const headingSize = useBreakpointValue({ 
    base: 'lg', 
    md: 'xl', 
    lg: '2xl' 
  });
  
  const badgeSize = useBreakpointValue({ 
    base: 'xs', 
    md: 'sm' 
  });
  
  const buttonSize = useBreakpointValue({ 
    base: 'md', 
    md: 'lg' 
  });
  
  const spacing = useBreakpointValue({ 
    base: 4, 
    md: 6 
  });

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ' + currency;
  };
  const formatPhone = (phone) => {
    return `+998 ${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 7)} ${phone.slice(7, 9)}`;
  };
  const isArenda = details.category.id === 2;
  const shareText = `${details.title} \n ${details.sub_title} \n ${t("adsfilterblock.category_label_price", "Price:")}: ${details.prices[0].price}`
  
  const currency = CURRENCIES.find(c => c.id === details.currency)?.symbol || 'uzs';

  return (
    <VStack align="start" spacing={spacing} w="full">
      {/* Badges and Title */}
      <Box w="full">
        <Flex 
          mb={3} 
          flexWrap="wrap" 
          gap={2}
          align="center"
        >
          <Badge 
            colorScheme="blue" 
            fontSize={badgeSize} 
            px={{ base: 2, md: 3 }} 
            py={1} 
            borderRadius="full"
          >
            {details.category?.title}
          </Badge>
          
          {details.rank_hot_offer && (
            <Badge 
              colorScheme="red" 
              fontSize={badgeSize} 
              px={{ base: 2, md: 3 }} 
              py={1} 
              borderRadius="full"
            >
              <HStack spacing={1}>
                <FaFire size={badgeSize === 'xs' ? '10px' : '12px'} />
                <Text>Hot Offer</Text>
              </HStack>
            </Badge>
          )}
          
          {details.rank_premium && (
            <Badge 
              colorScheme="purple" 
              fontSize={badgeSize} 
              px={{ base: 2, md: 3 }} 
              py={1} 
              borderRadius="full"
            >
              Premium
            </Badge>
          )}
        </Flex>
        
        <Heading 
          size={headingSize} 
          mb={3} 
          lineHeight="1.2"
          wordBreak="break-word"
        >
          {details.title}
        </Heading>
        
        {details.sub_title && (
          <Text 
            color="gray.600" 
            fontSize={{ base: 'md', md: 'lg' }} 
            mb={3}
            lineHeight="1.4"
          >
            {details.sub_title}
          </Text>
        )}
        
        <Stack 
          direction={{ base: 'column', sm: 'row' }}
          spacing={{ base: 2, sm: 4 }} 
          color="gray.500"
          fontSize={{ base: 'sm', md: 'md' }}
        >
          <HStack>
            <FaMapMarkerAlt />
            <Text>{details.city?.title}</Text>
          </HStack>
          <HStack>
            <FaCalendarAlt />
            <Text>{new Date(details.created_at).toLocaleDateString('ru-RU')}</Text>
          </HStack>
        </Stack>
      </Box>

      {/* Price */}
      <Box w="full">
        <Text 
          fontSize={{ base: 'xs', md: 'sm' }} 
          color="gray.600" 
          mb={1}
        >
          {t("adsfilterblock.category_label_price", "Цена")}
        </Text>
        <HStack letterSpacing={'tight'}>
          <Heading 
            fontSize={{ base: isArenda ? '15px' : "20px", md: '30px', lg: "40px" }}
            color="green.500" 
            fontWeight="bold"
            wordBreak="break-word"
          >
            {details.prices?.[0] ? 
              isArenda 
              ? `${formatPrice(details.prices[0].price, currency)} ${t("isArenda.smena", "/ смена")}` :
              `${formatPrice(details.prices[0].price, currency)}` : 
              t("productcard.agreed", "Договорная")
            }
          </Heading>
          
          {isArenda && (
            <>
            <Text>-</Text>
              <Heading 
                fontSize={{ base: '15px', md: '30px', lg: "40px" }}
                color="green.500" 
                fontWeight="bold"
                wordBreak="break-word"
              >
                {details.prices?.[0] ? 
                  `${formatPrice(details.prices[0].price, t("currency.uzs", "сум"))} ${t("isArenda.chas", "/ час")}` : 
                  t("productcard.agreed", "Договорная")
                }
              </Heading>
            </>
          )}
        </HStack>
      </Box>

      {/* Action Buttons */}
      <VStack spacing={3} w="full">
        {/* Main Phone Button */}
        <Button
          leftIcon={<FaPhone />}
          colorScheme="green"
          size={buttonSize}
          w="full"
          h={{ base: "10", md: "12" }}
          fontSize={{ base: 'sm', md: 'lg' }}
          borderRadius="xl"
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
          transition="all 0.2s"
          flexShrink={0}
          as={'a'} 
          href={`tel:${details.phones?.[0] || ''}`}
        >
          <Text isTruncated>
            {formatPhone(details.phones?.[0]) || t("orderlist.phone_err", "Номер телефона отсутствует")}
          </Text>
        </Button>
        
        {/* Like and Share Buttons */}
        <Stack 
          direction={'row'}
          spacing={3} 
          w="full"
        >
          <Tooltip 
            label={isLiked ? t("hotOfferDetail.add_favourite", "Добавлено в избранное") : t("hotOfferDetail.remove_favourite", "Удалено из избранного")}
            placement="top"
          >
            <IconButton
              icon={<FaHeart />}
              colorScheme={isLiked ? "red" : "gray"}
              variant={isLiked ? "solid" : "outline"}
              onClick={onLike}
              aria-label="Sevimlilar"
              flex={1}
              h={{ base: "10", md: "12" }}
              borderRadius="xl"
              _hover={{ transform: "translateY(-2px)" }}
              transition="all 0.2s"
            />
          </Tooltip>
          
          <Tooltip label={t("hotOfferDetail.label_ulashish", "Поделиться")} placement="top">
            <IconButton
              icon={<FaShare />}
              color={'blue.400'}
              variant="outline"
              size={buttonSize}
              onClick={onShare}
              aria-label="Ulashish"
              flex={1}
              h={{ base: "10", md: "12" }}
              borderRadius="xl"
              _hover={{ transform: "translateY(-2px)" }}
              transition="all 0.2s"
            />
          </Tooltip>
        </Stack>

        {/* Contact Options */}
        <SimpleGrid 
          columns={{ base: 1, sm: 3 }} 
          spacing={2} 
          w="full"
        >
          <Button 
            leftIcon={<FaWhatsapp />} 
            colorScheme="green" 
            variant="outline" 
            size={{ base: 'sm', md: 'md' }}
            fontSize={{ base: 'xs', md: 'sm' }}
            h={{ base: "8", md: "10" }}
            borderRadius="lg"
            _hover={{ transform: "translateY(-1px)" }}
            transition="all 0.2s"
            as={"a"}
            href={`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + window.location.origin)}`}
            target="_blank"
          >
            WhatsApp
          </Button>
          
          <Button 
            leftIcon={<FaTelegram />} 
            color={'blue.400'} 
            _hover={{ bg: "blue.50", transform: "translateY(-1px)" }} 
            variant="outline" 
            size={{ base: 'sm', md: 'md' }}
            fontSize={{ base: 'xs', md: 'sm' }}
            h={{ base: "8", md: "10" }}
            borderRadius="lg"
            transition="all 0.2s"
            as={"a"}
            href={`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}/ads/${details.slug}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
          >
            Telegram
          </Button>
          
          <Button 
            leftIcon={<FaFacebook />} 
            colorScheme="gray" 
            variant="outline" 
            size={{ base: 'sm', md: 'md' }}
            fontSize={{ base: 'xs', md: 'sm' }}
            h={{ base: "8", md: "10" }}
            borderRadius="lg"
            _hover={{ transform: "translateY(-1px)" }}
            transition="all 0.2s"
            as={"a"}
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}/ads/${details.slug}`}
            target="_blank"
          >
            Facebook
          </Button>
        </SimpleGrid>
      </VStack>
    </VStack>
  );
};