import {
  Card,
  CardBody,
  Box,
  VStack,
  HStack,
  Skeleton,
  SkeletonText,
  Container,
  Flex
} from '@chakra-ui/react';

// Skeleton Card Component
export const SkeletonCard = () => (
  <Card
    maxW="80%"
    direction={"row"}
    overflow="hidden"
    variant="outline"
  >
    <Skeleton
      w={{ base: '120px', custom900: '300px' }}
      // h={{ base: '120px', custom900: '300px' }}
      flexShrink={0}
    />
    
    <Box flex="1">
      <CardBody p={{ base: 4, custom900: 6 }}>
        <VStack align="start" spacing={4} h="100%">
          <VStack align="start" spacing={2} w="full">
            <HStack spacing={2}>
              <Skeleton height="20px" width="60px" borderRadius="full" />
              <Skeleton height="20px" width="80px" borderRadius="full" />
            </HStack>
            
            <SkeletonText 
              mt="2" 
              noOfLines={3} 
              spacing="2" 
              skeletonHeight="4"
            />
          </VStack>
          
          <SkeletonText 
            mt="2" 
            noOfLines={3} 
            spacing="2" 
            skeletonHeight="3"
            flex="1"
          />
          
          <HStack 
            justify="space-between" 
            w="full" 
            pt={4}
            borderTop="1px"
            borderColor="gray.100"
          >
            <Skeleton height="16px" width="120px" />
            <Skeleton height="16px" width="60px" />
          </HStack>
        </VStack>
      </CardBody>
    </Box>
  </Card>
);

// Loading Component
export const LoadingComponent = ({ isDesktop }) => (
  <Container maxW="container.xl" py={8}>
    <VStack spacing={8} align="stretch">
      {/* Header skeleton */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
        <Skeleton height="40px" width="200px" />
        {isDesktop && (
          <HStack spacing={2}>
            <Skeleton height="32px" width="32px" />
            <Skeleton height="32px" width="32px" />
          </HStack>
        )}
      </Flex>
      
      {/* Cards skeleton */}
      <VStack spacing={6} align="stretch">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} isGrid={false} />
        ))}
      </VStack>
    </VStack>
  </Container>
);