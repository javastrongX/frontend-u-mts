import { 
  Avatar, 
  Box, 
  Button, 
  Card, 
  CardBody, 
  Flex, 
  HStack, 
  IconButton, 
  Menu, 
  MenuButton, 
  MenuDivider, 
  MenuItem, 
  MenuList, 
  Text, 
  useBreakpointValue, 
  useColorModeValue, 
  VStack
} from "@chakra-ui/react";
import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaClipboardList, FaShoppingBag, FaUserCircle, FaWallet } from "react-icons/fa";
import { 
  FiChevronDown, 
  FiLogOut, 
  FiMenu, 
  FiPlus, 
  FiSettings, 
  FiShare, 
  FiShoppingCart, 
  FiUser 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Pages/Auth/logic/AuthContext";

export const ProfileHeader = ({ onMenuOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout, getUserProfile } = useAuth();
  
  const userData = useMemo(() => getUserProfile() || {}, [getUserProfile]);
  // const isCompany = useMemo(() => userData?.userType === "company" || userData?.isCompany === true, [userData]);
  const isCompany = useMemo(() => localStorage.getItem("isCompany") === "true", []);
  const isMobile = useBreakpointValue({ base: true, custom900: false });
  const isDesktop = useBreakpointValue({ base: true, custom1130: false });
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBg = useColorModeValue('orange.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

  const handleNavigation = useCallback((path) => {
    if (path === '/logout') {
      handleNavigation('/')
      return logout();
    }
    navigate(path);
  }, [navigate, logout]);

  const handleCompanyToggle = useCallback(() => {
    handleNavigation('/');
    localStorage.setItem("isCompany", "false");
    // API orqali user type ni o'zgartirish
    // updateUserType('user'); // API call
  }, [handleNavigation]);

  // Menu items configuration
  const menuItems = useMemo(() => [
    { 
      key: 'profile', 
      icon: isCompany ? FaUserCircle : FiUser,
      label: t('user_menu.profile', 'Профиль'),
      path: isCompany ? '/company' : '/profile'
    },
    { 
      key: 'orders', 
      icon: FaShoppingBag,
      label: t('user_menu.my_orders', 'MМои заказы'),
      path: isCompany ? '/my-application' : '/profile/orders'
    },
    { 
      key: 'ads', 
      icon: isCompany ? FaClipboardList : FiSettings,
      label: t('user_menu.my_ads', 'Мои объявления'),
      path: isCompany ? '/my-products' : '/profile/ads'
    },
    { 
      key: 'wallet', 
      icon: FaWallet,
      label: t('user_menu.wallet', 'Кошелёк'),
      path: '/profile/balance'
    }
  ], [isCompany, t]);

  const ActionButtons = () => {
    return (
      <HStack>
        <Button
          leftIcon={<FiPlus />}
          bg="#fed500"
          color="gray.800"
          size={{ base: 'xs', sm: 'sm', custom1200: 'md' }}
          borderRadius="xl"
          isLoading={isLoading}
          onClick={() => handleNavigation("/create-ads")}
          boxShadow="lg"
          _hover={{ 
            transform: 'translateY(-2px)', 
            boxShadow: '2xl',
            bg: '#fec000'
          }}
          _active={{ transform: 'translateY(0)' }}
          transition="all 0.2s ease"
          fontWeight="semibold"
        >
          {t('second_nav.submit_ad', "Подать объявление")}
        </Button>
        
        <Button
          leftIcon={<FiShoppingCart />}
          variant="outline"
          borderColor="#fed500"
          color="black"
          size={{ base: 'xs', sm: 'sm', custom1200: 'md' }}
          borderRadius="xl"
          borderWidth="2px"
          _hover={{ 
            transform: 'translateY(-2px)', 
            boxShadow: 'lg',
            bg: '#fed500',
            color: 'gray.800'
          }}
          _active={{ transform: 'translateY(0)' }}
          transition="all 0.2s ease"
          fontWeight="semibold"
          onClick={() => handleNavigation("/applications/create")}
        >
          {t('second_nav.place_order', "Разместить заказ")}
        </Button>
      </HStack>
    )
  }

  const UserAvatar = ({ size = "sm" }) => (
    <Avatar 
      size={size} 
      src={userData?.avatar}
      border="2px solid"
      borderColor="#fed500"
    />
  );

  const UserInfo = () => (
    <VStack align="start" spacing={0}>
      <Text fontSize="sm" color={textColor} fontWeight="600" lineHeight="20px" whiteSpace="wrap" noOfLines={2}>
        {userData.fullName}
      </Text>
      <Text fontSize="xs" color={mutedTextColor}>
        ID: {userData.id}
      </Text>
    </VStack>
  );

  const MenuItemComponent = ({ item, onClick }) => (
    <MenuItem 
      onClick={onClick} 
      icon={<item.icon />} 
      borderRadius="lg"
      _hover={{ bg: hoverBg }}
      transition="all 0.2s ease"
    >
      {item.label}
    </MenuItem>
  );

  const UserMenu = ({ isMobile: mobile = false }) => (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<FiChevronDown />}
        variant="ghost"
        size={{ base: 'sm', md: 'md' }}
        borderRadius="xl"
        _hover={{ bg: "gray.100" }}
        transition="all 0.2s ease"
      >
        <HStack spacing={3}>
          <UserAvatar />
          {!mobile && <UserInfo />}
        </HStack>
      </MenuButton>
      <MenuList 
        borderRadius="xl" 
        boxShadow="2xl"
        border="1px solid"
        borderColor={borderColor}
        bg={bgColor}
      >
        {isCompany && (
          <MenuItem 
            onClick={handleCompanyToggle} 
            icon={<FiShare />} 
            borderRadius="lg"
            _hover={{ bg: hoverBg }}
            transition="all 0.2s ease"
          >
            {t("ProfileHeader.goToUMTS", "Перейти на UZMAT.uz")}
          </MenuItem>
        )}

        {menuItems.map(item => (
          <MenuItemComponent 
            key={item.key} 
            item={item} 
            onClick={() => handleNavigation(item.path)} 
          />
        ))}

        <MenuDivider />
        <MenuItem 
          onClick={() => handleNavigation('/logout')}
          icon={<FiLogOut />} 
          color="red.500" 
          borderRadius="lg"
          _hover={{ bg: 'red.50', color: 'red.600' }}
          transition="all 0.2s ease"
        >
          {t('user_menu.logout', 'Выйти')}
        </MenuItem>
      </MenuList>
    </Menu>
  );

  return (
    <Card 
      mb={6} 
      boxShadow="xl" 
      borderRadius="2xl" 
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
    >
      <CardBody p={{ base: 5, md: 6 }}>
        <Flex align="center" wrap="wrap" gap={4} justify="space-between">
          
          {/* Left Section */}
          <HStack spacing={4} minW={{base: "150px", custom1200: "200px"}} flex={1} justify="space-between">
            <HStack>
              {isMobile && (
                <IconButton
                  icon={<FiMenu />}
                  variant="ghost"
                  onClick={onMenuOpen}
                  size="lg"
                  borderRadius="xl"
                  _hover={{ bg: hoverBg }}
                  transition="all 0.2s ease"
                />
              )}
              {!isCompany ? (
                <Button
                  onClick={() => handleNavigation('/business')}
                  size={{ base: 'sm', custom1200: 'md' }}
                  bg="#fed500"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="transparent"
                  _hover={{ bg: "orange.100", borderColor: "#fed500" }}
                  transition="all 0.2s ease"
                  fontWeight="600"
                >
                  {t("ProfileHeader.becomePartner", "Стать компанией")}
                </Button>
              ) : (
                <Text 
                  fontSize={{base: "sm", custom1200: "md"} }
                  color="blue.400" 
                  onClick={handleCompanyToggle}
                  cursor="pointer"
                >
                  {t("ProfileHeader.goToUMTS", "Перейти на UZMAT.uz")}
                </Text>
              )}
            </HStack>
          </HStack>

          {/* Right Section - Actions and Desktop User Menu */}
          <HStack spacing={3} wrap="wrap" justify="flex-end">
            <Box display={{base: 'none', md: "block", custom900: "none", lg: "block"}}>
              <ActionButtons />
            </Box>
            <UserMenu isMobile={isDesktop} />
          </HStack>
          <Box display={{base: 'flex', md: 'none', custom900: "flex", lg: "none"}} alignItems={'center'} justifyContent={'center'} w={'full'}>
            <ActionButtons />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};