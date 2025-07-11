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
import {
  FiMessageSquare as DefaultMainIcon,
  FiChevronLeft as DefaultBackIcon
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { HeaderSkeleton } from '../MessagesSection/skeletons/Skeletons';

const HeaderForTabs = ({
  isInitialLoading = false,
  MainIcon = DefaultMainIcon,
  BackIcon = DefaultBackIcon,
  title = 'Сообщения',
  subtitle = 'Управление заказами'
}) => {
  const navigate = useNavigate();
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
      display={{base: 'block', custom570: 'none'}}
    >
      <Container maxW="container.xl" py="4">
        <HStack spacing="4" align="center">
          <IconButton
            fontSize="25px"
            onClick={() => navigate(-1)}
            icon={<BackIcon />}
            bg="transparent"
            _hover={{ bg: 'orange.100' }}
            aria-label="Go back"
          />

          <HStack spacing="3">
            <Box
              w="12"
              h="12"
              bgGradient="linear(to-br, yellow.400, orange.400)"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="lg"
            >
              <Box as={MainIcon} color="white" fontSize="20px" />
            </Box>
            <VStack align="start" spacing="0">
              <Heading size="lg" color="gray.800">
                {title}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {subtitle}
              </Text>
            </VStack>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
};

export default HeaderForTabs;