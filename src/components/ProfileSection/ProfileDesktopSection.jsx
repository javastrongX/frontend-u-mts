import { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  Text,
  Button,
  useColorMode,
  Badge,
  useColorModeValue,
  Divider,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

import {
  FiUser,
  FiMessageSquare,
  FiCreditCard,
  FiShoppingCart,
  FiHeart,
  FiHelpCircle,
  FiInfo,
  FiEdit,
  FiLogOut,
  FiSun,
  FiMoon
} from 'react-icons/fi';

import { ProfileHeader } from './ProfileHeader';
import MessagesMobile from '../MessagesSection/MessagesMobile';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// Enhanced Sidebar Component
const Sidebar = ({ activeTab, handleTabChange, isOpen, onClose, isDrawerOpen, setIsDrawerOpen }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const shadowColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)');
  const prefersReducedMotion = usePrefersReducedMotion();
  

  const animation = prefersReducedMotion ? undefined : `${slideIn} 0.3s ease-out`;

  const menuItems = [
    { id: 'profile', label: 'Профиль', icon: FiUser, color: 'blue' },
    { id: 'messages', label: 'Сообщения', icon: FiMessageSquare, color: 'green', badge: '3' },
    { id: 'balance', label: 'Баланс', icon: FiCreditCard, color: 'purple', badge: '0' },
    { id: 'orders', label: 'Заказы', icon: FiShoppingCart, color: 'orange' },
    { id: 'ads', label: 'Объявления', icon: FiEdit, color: 'teal' },
    { id: 'favorites', label: 'Избранные', icon: FiHeart, color: 'red' },
    { id: 'support', label: 'Поддержка', icon: FiHelpCircle, color: 'pink' },
    { id: 'about', label: 'О Tservice.uz', icon: FiInfo, color: 'gray' },
  ];

  const check = useBreakpointValue({
    base: true,
    custom570: false
  }, {
    fallback: 'base',
    ssr: false
  });

  const handleMenuClick = (item) => {
    if (item.id === 'messages') {
      setIsDrawerOpen(true);
      if (check) {
        handleTabChange(item.id);
      }
    } else {
      handleTabChange(item.id);
      setIsDrawerOpen(false);
    }
    if (onClose) {
      onClose();
    }
  };

  const SidebarContent = () => (
    <Box
      w={'100%'}
      bg={bgColor}
      borderColor={borderColor}
      p={6}
      boxShadow={{ base: 'none', md: `0 0 20px ${shadowColor}` }}
      animation={animation}
      overflowY="auto"
      h={"100vh"}
    >
      {/* Logo Section with Animation */}
      <Flex as={"a"} href='/' align="center" mb={8} position="relative">
        <Box
          w={12}
          h={12}
          bgGradient="linear(45deg, yellow.400, orange.400)"
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mr={4}
          boxShadow="lg"
          animation={prefersReducedMotion ? undefined : `${float} 3s ease-in-out infinite`}
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            bgGradient: 'linear(45deg, yellow.400, orange.400, yellow.400)',
            borderRadius: 'xl',
            zIndex: -1,
            animation: prefersReducedMotion ? undefined : `${pulse} 2s infinite`
          }}
        >
          <Text fontSize="xl" fontWeight="black" color="white">
            T 
          </Text>
        </Box>
        <VStack align="start" spacing={0}>
          <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, yellow.400, orange.400)" bgClip="text">
            TService.uz
          </Text>
          <Text fontSize="sm" color="gray.500" fontWeight="medium">
            Professional Platform
          </Text>
        </VStack>
      </Flex>

      {/* Menu Items */}
      <VStack align="stretch" spacing={2}>
        {menuItems.map((item, index) => {
          // Messages tugmasi uchun alohida logika
          const isMessagesActive = item.id === 'messages' && isDrawerOpen;
          const isRegularTabActive = item.id !== 'messages' && activeTab === item.id && !isDrawerOpen;
          const isActive = isMessagesActive || isRegularTabActive;

          return (
            <Button
              key={item.id}
              variant={isActive ? 'solid' : 'ghost'}
              colorScheme={isActive ? item.color : 'gray'}
              justifyContent="flex-start"
              leftIcon={<item.icon />}
              onClick={() => handleMenuClick(item)}
              rightIcon={
                item.badge ? (
                  <Badge 
                    colorScheme={item.color} 
                    borderRadius="full"
                    animation={prefersReducedMotion ? undefined : `${pulse} 1s infinite`}
                  >
                    {item.badge}
                  </Badge>
                ) : null
              }
              size="lg"
              fontWeight="medium"
              borderRadius="xl"
              position="relative"
              _hover={{
                transform: 'translateX(4px)',
                boxShadow: 'lg'
              }}
              transition="all 0.2s"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </VStack>

      <Divider my={8} />

      {/* Settings & Logout */}
      <VStack spacing={2}>
        <Button
          variant="ghost"
          colorScheme="red"
          justifyContent="flex-start"
          leftIcon={<FiLogOut />}
          width="full"
          size="lg"
          borderRadius="xl"
          _hover={{ transform: 'translateX(4px)' }}
          transition="all 0.2s"
        >
          Выход
        </Button>
      </VStack>
    </Box>
  );

  const isMobile = useBreakpointValue({ base: true, custom900: false });
  if (isMobile) {
    return (
      <Drawer isOpen={isOpen === true} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton size={'lg'} bg={'white'} zIndex={10} />
          <DrawerBody p={0} mt={5}>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Box 
      position="sticky" 
      top={0} 
      height="100vh" 
      overflowY="auto"
      flexShrink={0}
    >
      <SidebarContent />
    </Box>
  );
};

// Main ProfileDesktopSection Component
const ProfileDesktopSection = ({activeTab, handleTabChange, children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useBreakpointValue({
    base: true,
    custom570: false
  }, {
    fallback: 'base',
    ssr: false
  });

  return (
    <Flex minH="100vh">
      <Sidebar 
        activeTab={activeTab} 
        handleTabChange={handleTabChange}
        isOpen={isOpen}
        onClose={onClose}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
      
      <Box 
        flex={1} 
        p={{ base: 2, custom1130: 6 }} 
        bg={'#F7F8FC'} 
        pb={{base: '40px', custom570: '10px'}}
        overflowY="auto"
        height="100vh"
      >
        <Box display={'flex'} justifyContent={'center'} flexDir={'column'} maxW="100%">
          <ProfileHeader onMenuOpen={onOpen} />
          {children}
        </Box>
      </Box>
      {!isMobile && (
        <MessagesMobile isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      )}
    </Flex>
  );
};

export default ProfileDesktopSection;