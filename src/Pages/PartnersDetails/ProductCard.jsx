import { AspectRatio, Badge, Box, Card, CardBody, Center, HStack, IconButton, Image, Skeleton, SkeletonText, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCamera, FiCheck, FiEye, FiHeart, FiMapPin, FiStar } from "react-icons/fi";

// Modern Loading Skeleton Component
const ProductSkeleton = () => (
  <Card 
    borderRadius="2xl" 
    overflow="hidden" 
    boxShadow="sm"
    bg="white"
    border="1px"
    borderColor="gray.100"
  >
    <CardBody p={0}>
      <Skeleton height="240px" borderTopRadius="2xl" />
      <Box p={5}>
        <SkeletonText noOfLines={2} spacing="3" mb={4} />
        <Skeleton height="24px" width="70%" mb={3} />
        <Skeleton height="16px" width="60%" />
      </Box>
    </CardBody>
  </Card>
);


// Product Card Component
export const ProductCard = ({ product, isLoading = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();
  if (isLoading) {
    return <ProductSkeleton />;
  }

  return (
    <Card 
      borderRadius="2xl"
      overflow="hidden" 
      bg="white"
      border="1px"
      borderColor="gray.100"
      _hover={{ 
        shadow: "2xl", 
        transform: "translateY(-8px)",
        borderColor: "blue.200"
      }}
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      cursor="pointer"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      position="relative"
    >
      <CardBody p={0}>
        <Box position="relative" overflow="hidden">
          {!imageError ? (
            <AspectRatio ratio={1}>
              <Image
                src={product.image}
                alt={product.title}
                objectFit="cover"
                onError={() => setImageError(true)}
                loading="lazy"
                transition="transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                transform={isHovered ? "scale(1.1)" : "scale(1)"}
              />
            </AspectRatio>
          ) : (
            <AspectRatio ratio={1}>
              <Center
                bg="gray.50"
                flexDirection="column"
              >
                <FiCamera size="32" color="gray.400" />
                <Text fontSize="sm" color="gray.500" mt={2}>
                  {t("partsmarketplace.productcard.image_notAvailable", "Изображение недоступно")}
                </Text>
              </Center>
            </AspectRatio>
          )}
          
          {/* Overlay gradient */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)"
            opacity={isHovered ? 1 : 0}
            transition="opacity 0.3s"
          />
          
          {/* Badges */}
          {/* <HStack position="absolute" top={3} left={3} spacing={2}>
            {product.isNew && (
              <Badge
                bg="green.400"
                color="white"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
                fontWeight="bold"
              >
                Новое
              </Badge>
            )}
            {product.discount && (
              <Badge
                bg="red.400"
                color="white"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
                fontWeight="bold"
              >
                -{product.discount}%
              </Badge>
            )}

          </HStack> */}
          
          <IconButton
            icon={<FiHeart />}
            position="absolute"
            top={3}
            right={3}
            bg="whiteAlpha.900"
            backdropFilter="blur(10px)"
            color={isFavorite ? "red.400" : "gray.600"}
            _hover={{ 
              bg: "white", 
              color: "red.400",
              transform: "scale(1.1)"
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            size="sm"
            borderRadius="full"
            aria-label="Add to favorites"
            transition="all 0.3s"
          />
          
          {product.imageCount > 1 && (
            <Badge
              position="absolute"
              bottom={3}
              right={3}
              bg="blackAlpha.800"
              color="white"
              fontSize="xs"
              display="flex"
              alignItems="center"
              gap={1}
              px={2}
              py={1}
              borderRadius="md"
              backdropFilter="blur(10px)"
            >
              <FiCamera size="12" />
              {product.imageCount}
            </Badge>
          )}

          {/* Quick stats overlay */}
          <HStack
            position="absolute"
            bottom={3}
            left={3}
            spacing={3}
            opacity={isHovered ? 1 : 0}
            transition="opacity 0.3s"
          >
            <HStack spacing={1}>
              <FiEye size="12" color="white" />
              <Text fontSize="xs" color="white" fontWeight="medium">
                {product.views}
              </Text>
            </HStack>
            <HStack spacing={1}>
              <FiStar size="12" color="white" />
              <Text fontSize="xs" color="white" fontWeight="medium">
                {product.rating}
              </Text>
            </HStack>
          </HStack>
        </Box>
        
        <Box p={5}>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="gray.800"
            mb={3}
            noOfLines={2}
            minH="40px"
            lineHeight="1.4"
          >
            {product.title}
          </Text>
          
          <VStack align="start" spacing={2} mb={3}>
            <HStack spacing={2}>
              <Text fontSize="lg" fontWeight="bold" color="blue.400">
                {product.price}
              </Text>
              {product.originalPrice && (
                <Text
                  fontSize="sm"
                  color="gray.400"
                  textDecoration="line-through"
                >
                  {product.originalPrice}
                </Text>
              )}
            </HStack>
            
            <HStack align="center" color="gray.500" fontSize="xs">
              <FiMapPin size="12" />
              <Text noOfLines={1}>
                {product.location}
              </Text>
            </HStack>
          </VStack>

          {/* Rating and status */}
          <HStack justify="space-between" align="center">
            <HStack spacing={1}>
              <FiStar size="14" color="#F6AD55" />
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                {product.rating}
              </Text>
            </HStack>
            
            {product.inStock && (
              <HStack spacing={1}>
                <FiCheck size="14" color="#48BB78" />
                <Text fontSize="xs" color="green.500" fontWeight="medium">
                  В наличии
                </Text>
              </HStack>
            )}
          </HStack>
        </Box>
      </CardBody>
    </Card>
  );
};