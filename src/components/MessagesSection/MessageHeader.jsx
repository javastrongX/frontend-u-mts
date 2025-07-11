import React from 'react';
import {
  Box,
  Container,
  HStack,
  VStack,
  Text,
  Heading,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import { FiMessageSquare, FiChevronLeft, FiMenu } from 'react-icons/fi';
import { HeaderSkeleton } from './skeletons/Skeletons';

export const MessageHeader = ({ 
  isInitialLoading, 
  navigate, 
  isDesktop = false, 
  setIsDrawerOpen 
}) => {
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (isInitialLoading) {
    return <HeaderSkeleton />;
  }

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
        <HStack 
          spacing="4" 
          justifyContent={isDesktop ? "space-between" : "flex-start"}
          align="center"
        >
          <IconButton 
            fontSize={'25px'} 
            onClick={() => navigate(-1)} 
            icon={<FiChevronLeft/>} 
            bg={'transparent'} 
            _hover={{bg: "blue.100"}} 
            aria-label="Go back"
          />
          
          <HStack spacing="3">
            <Box
              w="12"
              h="12"
              bgGradient="linear(to-br, blue.500, blue.600)"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="lg"
            >
              <Box as={FiMessageSquare} color="white" size="20px" />
            </Box>
            <VStack align="start" spacing="0">
              <Heading size="lg" color="gray.800">
                Сообщения
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Управление заказами
              </Text>
            </VStack>
          </HStack>

          {isDesktop && (
            <IconButton
              icon={<FiMenu />}
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Меню"
            />
          )}
        </HStack>
      </Container>
    </Box>
  );
};

