import {
  Box, Text, Image, Flex, Icon, HStack, Spacer,
  Tooltip
} from "@chakra-ui/react";
import {
  FaRegHeart, FaHeart, FaEye, FaMapMarkerAlt, FaCalendarAlt,
  FaStar, FaCrown, FaGem, FaFire
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { IoSearchCircle } from "react-icons/io5";
import { GiFlame } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBreakpointValue } from "@chakra-ui/react";
import { useAuth } from "../../Pages/Auth/logic/AuthContext";

const ProductCard = ({ product }) => {
  const [viewCount, setViewCount] = useState(product.statistics?.viewed || 0);
  const [isLiked, setIsLiked] = useState(product.is_favorite || false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { isAuthenticated } = useAuth();

  // Breakpoint values
  const isMobile = useBreakpointValue({
    base: true,
    custom570: false
  }, {
    fallback: 'base',
    ssr: false
  });

  // Product ranklarini product obyektidan olish
  const rank_search = product.rank_search || false;
  const rank_hotOffer = product.rank_hot_offer || false;
  const rank_premium = product.rank_premium || false;

  // Rank konfiguratsiyasi - faqat 3 ta variant
  const getRankConfig = () => {
    if (rank_premium && rank_search && rank_hotOffer) {
      return {
        level: 'premium',
        text: 'PREMIUM',
        icon: FaCrown,
        bgGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 60%, #FF6B35 100%)',
        bgColor: 'rgba(255, 215, 0, 0.95)',
        shadowColor: 'rgba(255, 215, 0, 0.6)',
        glowColor: 'rgba(255, 215, 0, 0.8)',
        cardBg: "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.15), rgba(255, 107, 53, 0.15))"
      };
    } else if (rank_search && rank_hotOffer) {
      return {
        level: 'hot',
        text: 'QAYNOQ',
        icon: FaFire,
        bgGradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD700 100%)',
        bgColor: 'rgba(255, 107, 53, 0.95)',
        shadowColor: 'rgba(255, 107, 53, 0.6)',
        glowColor: 'rgba(255, 107, 53, 0.8)',
        cardBg: "linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(247, 147, 30, 0.15))"
      };
    } else if (rank_search) {
      return {
        level: 'top',
        text: 'TOP',
        icon: FaGem,
        bgGradient: 'linear-gradient(135deg, #4299E1 0%, #3182CE 50%, #2B6CB0 100%)',
        bgColor: 'rgba(66, 153, 225, 0.95)',
        shadowColor: 'rgba(66, 153, 225, 0.6)',
        glowColor: 'rgba(66, 153, 225, 0.8)',
        cardBg: "linear-gradient(135deg, rgba(66, 153, 225, 0.15), rgba(49, 130, 206, 0.15))"
      };
    }
    return null;
  };

  const rankConfig = getRankConfig();

  // Card background rangini aniqlash
  const getCardBackground = () => {
    return rankConfig ? rankConfig.cardBg : "#fff";
  };

  // Rank bor/yo'qligini tekshirish
  const hasAnyRank = rank_premium || rank_search || rank_hotOffer;

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      window.location.href = "/auth/register";
      return;
    }
  };

  return (
    <Box
      border={'1px solid'}
      borderColor={'black.20'}
      borderRadius="lg"
      p={{ base: 3, sm: 4 }}
      mt={3}
      position="relative"
      boxShadow={hasAnyRank ? 'xl' : 'md'}
      bg={getCardBackground()}
      maxW={'full'}
      minW="0"
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      sx={{
        '@media (min-width: 900px)': {
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: hasAnyRank ? '0 20px 40px rgba(0,0,0,0.1)' : '0 10px 30px rgba(0,0,0,0.1)',
            '& .rank-badge': {
              transform: 'translate(50px, -12px) rotate(0deg) scale(1.05)',
              opacity: 1,
            },
          },
        },
      }}
    >
      {/* ank indicator badge */}
      {hasAnyRank && rankConfig && (
        <Box
          className="rank-badge"
          position="absolute"
          onClick={() => navigate(`/ads/${product.slug}`)} 
          top={{base: -1, custom900: -2}}
          left={-3}
          px={{base: 2, custom570: 3}}
          py={{base: 1, custom570: 1.5}}
          borderRadius="full"
          fontSize="xs"
          fontWeight="bold"
          bgGradient={rankConfig.bgGradient}
          color="white"
          zIndex={3}
          transform="translate(30px, -18px) rotate(-5deg)"
          opacity={{base: 1, custom900: 0.9}}
          transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          transformOrigin="center"
          whiteSpace="nowrap"
          boxShadow={`0 8px 25px ${rankConfig.shadowColor}, 0 0 20px  ${!isMobile && rankConfig.glowColor}`}
          border="2px solid rgba(255, 255, 255, 0.3)"
          sx={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 'inherit',
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
              animation: 'shimmer 2s infinite',
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' }
            }
          }}
          _hover={{
            transform: 'translate(50px, -12px) rotate(0deg) scale(1.1)',
            boxShadow: `0 12px 35px ${rankConfig.shadowColor}, 0 0 30px ${!isMobile && rankConfig.glowColor}`,
          }}
        >
          <HStack spacing={1.5} align="center">
            <Icon as={rankConfig.icon} fontSize="xs" />
            <Text fontSize="xs" fontWeight="black" letterSpacing="wider">
              {rankConfig.text}
            </Text>
          </HStack>
        </Box>
      )}

      <Icon
        as={isLiked ? FaHeart : FaRegHeart}
        position="absolute"
        top={{ base: 3, sm: 4 }}
        right={{ base: 3, sm: 4 }}
        fontSize={{ base: "18px", sm: "20px" }}
        color={isLiked ? "red.400" : "gray.400"}
        cursor="pointer"
        onClick={handleLikeClick}
        transition="all 0.2s ease"
        _hover={{
          transform: "scale(1.1)",
          color: isLiked ? "red.500" : "gray.500"
        }}
      />

      <Flex 
        align="flex-start" 
        justify="space-between" 
        flexDir={{ base: 'column', sm: 'row' }}
        gap={{ base: 2, sm: 0 }}
        onClick={() => navigate(`/ads/${product.slug}`)} 
      >
        <Text
          fontWeight="bold"
          cursor={'pointer'}
          _hover={{textDecor: "underline"}}
          fontSize={{ base: "sm", sm: "md" }}
          color="blue.400"
          noOfLines={2}
          flex="1"
          minW="0"
        >
          {product.title}
        </Text>

        <Text
          fontWeight="bold"
          fontSize={{ base: "md", sm: "lg" }}
          color="p.black"
          whiteSpace="nowrap"
          mr={10}
          flexShrink={0}
        >
          {product.prices[0]?.price.toLocaleString()} ₸
        </Text>
      </Flex>

      <Flex 
        mt={{ base: 3, sm: 2 }} 
        mb={(product?.characteristics?.length > 0) ? 0 : "30px"}
        alignItems="flex-start" 
        gap={{ base: 2, sm: 3 }} 
        h={{ base: "80px", sm: "100px" }}
        onClick={() => navigate(`/ads/${product.slug}`)} 
      >
        {/* Rasm qismi */}
        <Box 
          flexShrink={0} 
          cursor={'pointer'}
        >
          <Image
            src={product.images[0]?.url || "/Images/d-image.png"}
            alt={product.title}
            h={{ base: "96px", sm: "115px" }}
            w={{ base: "150px", sm: "165px" }}
            objectFit="cover"
            borderRadius="md"
          />
        </Box>

        {/* Matn qismi */}
        <Box
          overflow="hidden"
          flex={1}
          minW="0" // Flexbox shrinking uchun
        >
          <Box
            fontSize={{ base: "xs", sm: "sm" }}
            color="p.black"
            display="-webkit-box"
            _hover={{ cursor: 'pointer' }}
            sx={{
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            <Text as="span" fontWeight="bold">
              {product.category?.title}
            </Text>
            <Text whiteSpace="normal" color={'p.black'}>
              {product.description}
            </Text>
          </Box>
        </Box>
      </Flex>

      {/* Karakteristikalar */}
      {product?.characteristics?.length > 0 && (
        <HStack
          mt={7}
          overflowX="auto"
          spacing={2}
          align="center"
          whiteSpace="nowrap"
          sx={{
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {product.characteristics.map((item, index) => (
            <Box
              key={index}
              px={2}
              py={1}
              gap={10}
              borderRadius="6px"
              fontSize={{ base: "9px", sm: "10px" }}
              bg="orange.100"
              display="inline-flex"
              alignItems="center"
              height={{ base: "20px", sm: "24px" }}
              flexShrink={0}
              onClick={() => navigate(`/ads/${product.slug}`)} 
            >   
              {item.characteristic?.title}
            </Box>
          ))}
        </HStack>
      )}

      <HStack
        mt={hasAnyRank && product?.characteristics?.length > 0 ? 2 : 4}
        color="gray.500"
        fontSize={{ base: "xs", sm: "sm" }}
        borderTop="1px solid"
        borderColor="black.20"
        pt={{base: 1, sm: 2}}
        h={{base: "20px", custom900: "15px"}}
        spacing={{ base: 2, sm: 3 }}
        flexWrap={{ base: "wrap", sm: "nowrap" }}
      >
        {/* Chap tomondagi ma'lumotlar */}
        <HStack spacing={1} flexShrink={0}>
          <Icon as={FaMapMarkerAlt} fontSize={{ base: "xs", sm: "sm" }} />
          <Text fontSize={{ base: '10px', sm: 'sm' }} noOfLines={1}>
            {product.city?.title}
          </Text>
        </HStack>
        
        <HStack spacing={1} flexShrink={0}>
          <Icon as={FaCalendarAlt} fontSize={{ base: "xs", sm: "sm" }} />
          <Text fontSize={{ base: '10px', sm: 'sm' }}>
            {new Date(product.created_at).toLocaleDateString()}
          </Text>
        </HStack> 
        
        <Spacer />
        
        {/* O'ng tomondagi iconlar */}
        <HStack spacing={{ base: 1, sm: 2 }} flexShrink={0}>
          <HStack spacing={1}>
            <Icon as={FaEye} fontSize={{ base: "xs", sm: "sm" }} />
            <Text fontSize={{ base: '10px', sm: 'sm' }}>{viewCount}</Text>
          </HStack>
          
          {/* Rank iconlari */}
          {rank_search && (
            <Tooltip
              hasArrow
              label={`${product.rank_search_value || 1}` + t("mobile_hot_offers.rank_search")}
              bg="rgba(255, 255, 255, 0.9)"
              color="p.black"
              p={2}
              boxShadow="lg"
              borderRadius="xl"
              sx={{
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <Icon 
                fontSize={"25px"}
                cursor={'pointer'} 
                color={'blue.400'} 
                as={IoSearchCircle} 
              />
            </Tooltip>
          )}
          
          {rank_hotOffer && (
            <Tooltip
              hasArrow
              label={`${product.rank_hot_offer_value || 1}` + t("mobile_hot_offers.rank_hot_offer")}
              bg="rgba(255, 255, 255, 0.9)"
              color="p.black"
              p={2}
              boxShadow="lg"
              borderRadius="xl"
              sx={{
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <Icon 
                fontSize={"18px"}
                cursor={'pointer'} 
                color={'orange.200'} 
                as={GiFlame} 
              />
            </Tooltip>
          )}
          
          {rank_premium && (
            <Tooltip
              hasArrow
              label={`${product.rank_premium_value || 1}` + t("mobile_hot_offers.premium_product")}
              bg="rgba(255, 255, 255, 0.9)"
              color="p.black"
              p={2}
              boxShadow="lg"
              borderRadius="xl"
              sx={{
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <Icon 
                fontSize={"18px"}
                cursor={'pointer'} 
                color={'orange.250'} 
                as={FaStar} 
              />
            </Tooltip>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default ProductCard;