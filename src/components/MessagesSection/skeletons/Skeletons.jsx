import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Card,
  CardBody,
  Container,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  useColorModeValue
} from '@chakra-ui/react';

export const OrderCardSkeleton = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Card
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
    >
      <CardBody p="4">
        <HStack spacing="4" align="start">
          <SkeletonCircle size="60px" />
          
          <VStack align="start" spacing="3" flex="1" minW="0">
            <SkeletonText noOfLines={2} spacing="2" skeletonHeight="3" width="90%" />
            <Skeleton height="6" width="60%" borderRadius="md" />
            
            <HStack spacing="2" w="full" justify="space-between">
              <Skeleton height="6" width="50px" borderRadius="full" />
              <SkeletonCircle size="8" />
            </HStack>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

export const DateSectionSkeleton = () => {
  return (
    <Box mb="8">
      <HStack mb="4" spacing="4" flexWrap="wrap">
        <Skeleton height="8" width="120px" borderRadius="md" />
        <Skeleton height="6" width="100px" borderRadius="full" />
      </HStack>
      
      <Skeleton height="4" width="250px" mb="4" borderRadius="md" />
      
      <VStack spacing="4" align="stretch">
        {[1, 2, 3].map((item) => (
          <OrderCardSkeleton key={item} />
        ))}
      </VStack>
      
      <Skeleton 
        height="12" 
        width="full" 
        mt="4" 
        borderRadius="xl" 
      />
    </Box>
  );
};

export const TabsSkeleton = () => {
  return (
    <HStack
      mb="8"
      bg="white"
      p="2"
      borderRadius="xl"
      boxShadow="sm"
      spacing="2"
    >
      {[1, 2, 3, 4, 5, 6, 7].map((item) => (
        <Skeleton 
          key={item}
          height="10" 
          width="100px" 
          borderRadius="lg"
          flexShrink="0"
        />
      ))}
    </HStack>
  );
};

export const HeaderSkeleton = () => {
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bg={`${headerBg}E6`}
      borderBottom="1px"
      borderColor={borderColor}
      zIndex="1000"
      backdropFilter="blur(10px)"
      boxShadow="sm"
    >
      <Container maxW="container.xl" py="4">
        <HStack spacing="4">
          <SkeletonCircle size="10" />
          <HStack spacing="3">
            <SkeletonCircle size="12" />
            <VStack align="start" spacing="1">
              <Skeleton height="6" width="120px" />
              <Skeleton height="4" width="150px" />
            </VStack>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
};


