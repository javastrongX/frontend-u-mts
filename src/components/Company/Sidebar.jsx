import React, { useState } from 'react';
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Tooltip,
  IconButton,
  useBreakpointValue,
  Badge,
  Avatar
} from '@chakra-ui/react';
import {
  FiHome,
  FiUser,
  FiMessageCircle,
  FiTarget,
  FiShoppingCart,
  FiFolder,
  FiFileText,
  FiAward,
  FiBookOpen,
  FiInfo,
  FiTrendingUp,
  FiUsers,
  FiLifeBuoy,
  FiLogOut,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiPhone,
} from 'react-icons/fi';

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Navigation items - komponent ichida e'lon qilingan
  const navigationItems = [
    { id: 'home', label: 'Главная', icon: FiHome, path: '/' },
    { id: 'profile', label: 'Профиль', icon: FiUser, path: '/profile' },
    { id: 'messages', label: 'Сообщения', icon: FiMessageCircle, path: '/messages', badge: 3 },
    { id: 'balance', label: 'Баланс', icon: FiDollarSign, path: '/balance', amount: '0' },
    { id: 'leads', label: 'Лиды', icon: FiTarget, path: '/leads', badge: 5 },
    { id: 'incoming-orders', label: 'Входящие заказы', icon: FiShoppingCart, path: '/incoming-orders', badge: 2 },
    { id: 'my-orders', label: 'Мои заказы', icon: FiFolder, path: '/my-orders' },
    { id: 'my-ads', label: 'Мои объявления', icon: FiFileText, path: '/my-ads' },
    { id: 'banners', label: 'Баннеры', icon: FiAward, path: '/banners' },
    { id: 'news', label: 'Новости', icon: FiBookOpen, path: '/news' },
    { id: 'contacts', label: 'Контакты', icon: FiPhone, path: '/contacts' },
    { id: 'requisites', label: 'Реквизиты', icon: FiInfo, path: '/requisites' },
    { id: 'documents', label: 'Документы', icon: FiFolder, path: '/documents' },
    { id: 'currency-converter', label: 'Конвертер валют', icon: FiTrendingUp, path: '/converter' },
    { id: 'employees', label: 'Сотрудники', icon: FiUsers, path: '/employees' },
    { id: 'support', label: 'Служба поддержки', icon: FiLifeBuoy, path: '/support' },
    { id: 'about', label: 'О UZMAT.uz', icon: FiInfo, path: '/about' }
  ];
  
  const sidebarBg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeColor = useColorModeValue('blue.500', 'blue.400');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const hoverBg = useColorModeValue('gray.50', 'gray.800');
  const logoColor = useColorModeValue('blue.500', 'blue.400');
  const shadowColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.3)');
  
  const sidebarWidth = isCollapsed ? '80px' : '280px';
  const mobileSidebarWidth = isMobileOpen ? '280px' : '0px';

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleItemClick = (itemId) => {
    setActiveTab(itemId);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Navigation Item Component
  const NavigationItem = ({ item, isActive, isCollapsed }) => {
    const button = (
      <Button
        leftIcon={!isCollapsed ? <Icon as={item.icon} boxSize={5} /> : undefined}
        variant="ghost"
        justifyContent={isCollapsed ? 'center' : 'flex-start'}
        color={isActive ? activeColor : textColor}
        bg={isActive ? activeBg : 'transparent'}
        _hover={{ 
          bg: isActive ? activeBg : hoverBg,
          transform: 'translateY(-1px)',
          shadow: 'md'
        }}
        _active={{ transform: 'translateY(0)' }}
        onClick={() => handleItemClick(item.id)}
        size="md"
        h="48px"
        w="full"
        px={isCollapsed ? 0 : 4}
        fontWeight={isActive ? 'semibold' : 'normal'}
        borderRadius="xl"
        mb={1}
        position="relative"
        transition="all 0.3s ease"
        fontSize="sm"
      >
        {isCollapsed ? (
          <Box position="relative">
            <Icon as={item.icon} boxSize={5} />
            {item.badge && (
              <Badge
                position="absolute"
                top="-8px"
                right="-8px"
                colorScheme="red"
                borderRadius="full"
                fontSize="xs"
                minW="18px"
                h="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {item.badge}
              </Badge>
            )}
          </Box>
        ) : (
          <HStack w="full" justify="space-between">
            <Text>{item.label}</Text>
            {item.badge && (
              <Badge colorScheme="red" borderRadius="full" fontSize="xs">
                {item.badge}
              </Badge>
            )}
            {item.amount && (
              <Text fontSize="sm" color="green.400" fontWeight="semibold">
                {item.amount}
              </Text>
            )}
          </HStack>
        )}
      </Button>
    );

    if (isCollapsed) {
      return (
        <Tooltip
          label={item.label}
          placement="right"
          hasArrow
          bg="gray.700"
          color="white"
          fontSize="sm"
          borderRadius="md"
          px={3}
          py={2}
        >
          {button}
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.600"
          zIndex={1001}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      {isMobile && (
        <IconButton
          icon={<FiMenu />}
          position="fixed"
          top={4}
          left={4}
          zIndex={1002}
          onClick={toggleSidebar}
          variant="ghost"
          color={textColor}
          bg={sidebarBg}
          shadow="md"
          borderRadius="xl"
          size="md"
        />
      )}

      {/* Sidebar */}
      <Box
        position="fixed"
        left={0}
        top={0}
        bottom={0}
        w={isMobile ? mobileSidebarWidth : sidebarWidth}
        bg={sidebarBg}
        borderRight="1px"
        borderColor={borderColor}
        shadow={`0 0 20px ${shadowColor}`}
        zIndex={1000}
        transition="all 0.3s ease"
        transform={isMobile && !isMobileOpen ? 'translateX(-100%)' : 'translateX(0)'}
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Header */}
        <Box p={4} borderBottom="1px" borderColor={borderColor} position="relative">
          <HStack justify="space-between" align="center">
            <HStack spacing={3} minW={0}>
              <Box
                w="40px"
                h="40px"
                bg={logoColor}
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                shadow="md"
              >
                <Text fontWeight="bold" fontSize="lg" color="white">
                  UT
                </Text>
              </Box>
              {!isCollapsed && (
                <VStack align="start" spacing={0} minW={0}>
                  <Text
                    fontWeight="bold"
                    color={textColor}
                    fontSize="md"
                    noOfLines={1}
                  >
                    UZMAT.uz
                  </Text>
                  <Text fontSize="xs" color="gray.400" noOfLines={1}>
                    Мир специалистов
                  </Text>
                </VStack>
              )}
            </HStack>
            
            {!isMobile && (
              <IconButton
                icon={<Icon as={isCollapsed ? FiChevronRight : FiChevronLeft} />}
                size="sm"
                variant="ghost"
                onClick={toggleSidebar}
                color={textColor}
                _hover={{ bg: hoverBg }}
                borderRadius="lg"
              />
            )}
          </HStack>
        </Box>

        {/* Navigation */}
        <Box flex={1} overflowY="auto" p={3}>
          <VStack spacing={1} align="stretch">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                isCollapsed={isCollapsed}
              />
            ))}
          </VStack>
        </Box>

        {/* Bottom Section */}
        <Box borderTop="1px" borderColor={borderColor}>
          {/* Instagram Banner */}
          <Box p={4}>
            {!isCollapsed ? (
              <HStack
                as="a"
                href="https://www.instagram.com/vodiy_kuzatuv?utm_source=qr&igsh=MXBlNWZoYTBsZW5udg=="
                target="_blank"
                spacing={3}
                p={3}
                borderRadius="xl"
                bg={hoverBg}
                _hover={{ 
                  bg: activeBg,
                  transform: 'translateY(-1px)',
                  shadow: 'md'
                }}
                transition="all 0.3s ease"
                cursor="pointer"
              >
                <Avatar
                  src="/insta.png"
                  size="sm"
                  name="Instagram"
                />
                <VStack align="start" spacing={0} minW={0}>
                  <Text
                    fontWeight="bold"
                    color="pink.500"
                    fontSize="sm"
                    noOfLines={1}
                  >
                    @vodiy_kuzatuv
                  </Text>
                  <Text fontSize="xs" color="gray.400" noOfLines={1}>
                    Подписывайтесь
                  </Text>
                </VStack>
              </HStack>
            ) : (
              <Tooltip
                label="@vodiy_kuzatuv - Подписывайтесь на наш Instagram"
                placement="right"
                hasArrow
                bg="gray.700"
                color="white"
                fontSize="sm"
                borderRadius="md"
                px={3}
                py={2}
              >
                <Box
                  as="a"
                  href="https://www.instagram.com/vodiy_kuzatuv?utm_source=qr&igsh=MXBlNWZoYTBsZW5udg=="
                  target="_blank"
                  display="flex"
                  justifyContent="center"
                  p={2}
                  borderRadius="xl"
                  _hover={{ bg: hoverBg }}
                  transition="all 0.3s ease"
                  cursor="pointer"
                >
                  <Avatar
                    src="/insta.png"
                    size="sm"
                    name="Instagram"
                  />
                </Box>
              </Tooltip>
            )}
          </Box>

          {/* Logout Button */}
          <Box p={4} pt={0}>
            {!isCollapsed ? (
              <Button
                leftIcon={<Icon as={FiLogOut} />}
                variant="ghost"
                justifyContent="flex-start"
                color="red.400"
                _hover={{ 
                  bg: 'red.50',
                  color: 'red.500',
                  transform: 'translateY(-1px)',
                  shadow: 'md'
                }}
                _active={{ transform: 'translateY(0)' }}
                size="md"
                w="full"
                borderRadius="xl"
                transition="all 0.3s ease"
              >
                Выход
              </Button>
            ) : (
              <Tooltip
                label="Выход"
                placement="right"
                hasArrow
                bg="gray.700"
                color="white"
                fontSize="sm"
                borderRadius="md"
                px={3}
                py={2}
              >
                <IconButton
                  icon={<Icon as={FiLogOut} />}
                  variant="ghost"
                  color="red.400"
                  _hover={{ 
                    bg: 'red.50',
                    color: 'red.500',
                    transform: 'translateY(-1px)',
                    shadow: 'md'
                  }}
                  _active={{ transform: 'translateY(0)' }}
                  size="md"
                  w="full"
                  borderRadius="xl"
                  transition="all 0.3s ease"
                />
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;