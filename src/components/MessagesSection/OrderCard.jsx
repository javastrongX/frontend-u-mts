import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardBody,
  IconButton,
  useColorModeValue,
  Image
} from '@chakra-ui/react';
import { 
  FiShoppingCart,
  FiRefreshCw,
  FiArrowRight
} from 'react-icons/fi';

const OrderCard = ({ order, index }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Hooklar komponent tepasida
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const imageBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  
  const getPrioritycolorScheme = (priority) => {
    switch(priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getPriorityBg = (priority) => {
    switch(priority) {
      case 'high': return 'red.50';
      case 'medium': return 'orange.100';
      case 'low': return 'green.50';
      default: return 'gray.50';
    }
  };

  const handleViewMore = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Card
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
        borderColor: 'blue.300'
      }}
      cursor="pointer"
      position="relative"
      sx={{
        opacity: 0,
        animation: `slideInUp 0.6s ease forwards ${index * 0.1}s`,
        animationFillMode: 'forwards'
      }}
    > 
      <CardBody p={{ base: "3", sm: "4" }}>
        <HStack spacing={{ base: "3", sm: "4" }} align="center">
          <Box
            w={{ base: "90px", sm: "80px" }}
            h={{ base: "90px", sm: "80px" }}
            borderRadius="lg"
            overflow="hidden"
            flexShrink="0"
            position="relative"
          >
            {order.imageUrl ? (
              <Image
                src={order.imageUrl}
                alt={order.title}
                w="100%"
                h="100%"
                objectFit="cover"
                bg={imageBg}
              />
            ) : (
              <Box
                w="100%"
                h="100%"
                bg={getPriorityBg(order.priority)}
                border="1px solid"
                borderColor={`${getPrioritycolorScheme(order.priority)}.200`}
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box 
                  as={FiShoppingCart} 
                  color={`${getPrioritycolorScheme(order.priority)}.500`} 
                  size="30px"
                />
              </Box>
            )}
          </Box>
          
          {/* Content Area */}
          <VStack align="start" spacing="2" flex="1" minW="0">
            <Text
              fontSize={{ base: "sm", sm: "md" }}
              fontWeight="600"
              lineHeight="1.3"
              noOfLines={2}
              color={textColor}
            >
              {order.title}
            </Text>
            
            <Badge
              colorScheme="blue"
              fontSize="xs"
              textTransform="none"
              borderRadius="md"
              px="2"
              py="1"
              maxW="full"
              isTruncated
            >
              {order.category}
            </Badge>
            
            <HStack spacing="2" w="full" justify="space-between" align="center">
              <Badge
                colorScheme={getPrioritycolorScheme(order.priority)}
                size="sm"
                borderRadius="full"
                textTransform="uppercase"
                fontSize="xs"
              >
                {order.priority}
              </Badge>
              
              <IconButton
                icon={isLoading ? 
                  <Box 
                    as={FiRefreshCw} 
                    sx={{ 
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }} 
                  /> : 
                  <FiArrowRight />
                }
                size="sm"
                variant="ghost"
                colorScheme="blue"
                borderRadius="full"
                onClick={handleViewMore}
                _hover={{ bg: 'blue.50' }}
                aria-label="View more"
              />
            </HStack>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default OrderCard;