import {
  Box, Text, Image, Flex, Icon, HStack, Spacer, VStack
} from "@chakra-ui/react";
import {
  FaRegHeart, FaHeart, FaEye, FaMapMarkerAlt, FaCalendarAlt
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../Pages/Auth/logic/AuthContext";

const SimpleProductCard = ({ product }) => {
  const [viewCount, setViewCount] = useState(product.statistics?.viewed || 0);
  const [isLiked, setIsLiked] = useState(product.is_favorite || false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      window.location.href = "/auth/register";
      return;
    }
  };

  const isArenda = product.category.id === 2;

  return (
    <Box
      border={'1px solid'}
      borderColor={'black.20'}
      borderRadius="lg"
      p={{ base: 3, sm: 4 }}
      mt={3}
      position="relative"
      boxShadow="md"
      bg="#fff"
      maxW={'full'}
      minW="0"
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      sx={{
        '@media (min-width: 900px)': {
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          },
        },
      }}
    >
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
        <VStack lineHeight={isArenda ? 0.6 : 1}>
          {(!product.prices || product.prices.length === 0) ? (
            <Text
              fontWeight="semibold"
              fontSize={{ base: isArenda ? 'sm' : 'md', sm: 'lg' }}
              color="p.black"
              whiteSpace="nowrap"
              mr={10}
              flexShrink={0}
            >
              {t("productcard.agreed", "Договорная")}
            </Text>
          ) : (
            <>
              <Text
                fontWeight="semibold"
                fontSize={{ base: isArenda ? 'sm' : 'md', sm: 'lg' }}
                color="p.black"
                whiteSpace="nowrap"
                mr={10}
                flexShrink={0}
              >
                {product.prices[0]?.price.toLocaleString()} {t("currency.uzs", "сум")} {!isArenda && ""}
                {isArenda && t("isArenda.smena", "/ смена")}
              </Text>

              {isArenda && (
                <Text
                  fontWeight="semibold"
                  fontSize={{ base: 'sm', sm: 'lg' }}
                  color="p.black"
                  whiteSpace="nowrap"
                  mr={10}
                  flexShrink={0}
                >
                  {product.prices[0]?.price.toLocaleString()} {t("currency.uzs", "сум")} {t("isArenda.chas", "/ час")}
                </Text>
              )}
            </>
          )}
        </VStack>
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
          minW="0"
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
        mt={product?.characteristics?.length > 0 ? 2 : 4}
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
        
        {/* O'ng tomondagi ko'rishlar soni */}
        <HStack spacing={1} flexShrink={0}>
          <Icon as={FaEye} fontSize={{ base: "xs", sm: "sm" }} />
          <Text fontSize={{ base: '10px', sm: 'sm' }}>{viewCount}</Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default SimpleProductCard;