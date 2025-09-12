import { useMemo, useState, useCallback } from 'react';
import {
  Box,
  Flex,
  VStack,
  Text,
  Button,
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
  FiHome,
  FiMessageCircle,
  FiDollarSign,
  FiTarget,
  FiFolder,
  FiFileText,
  FiPhone,
  FiLifeBuoy
} from 'react-icons/fi';
import { FaRegNewspaper } from "react-icons/fa6";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";

import { ProfileHeader } from './ProfileHeader';
import MessagesMobile from '../MessagesSection/MessagesMobile';
import SideTranslator from '../../Pages/SideTranslator';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../Pages/Auth/logic/AuthContext';
import { AccountSwitcher } from '../AccountSwitcher/AccountSwitcher'; 

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

// Memoized Logo Component
const LogoSection = ({ t, prefersReducedMotion }) => (
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
        U
      </Text>
    </Box>
    <VStack align="start" spacing={0}>
      <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, yellow.400, orange.400)" bgClip="text">
        {t("avatar.brand", "UZMAT.uz")}
      </Text>
      <Text fontSize="sm" color="gray.500" fontWeight="medium">
        {t("avatar.brand_subtitle", "Professional Platform")}
      </Text>
    </VStack>
  </Flex>
);

// Memoized Menu Item Component
const MenuItem = ({ item, index, isActive, onMenuClick, prefersReducedMotion }) => (
  <Button
    key={item.id}
    variant={isActive ? 'solid' : 'ghost'}
    colorScheme={isActive ? item.color : 'gray'}
    justifyContent="flex-start"
    leftIcon={<item.icon />}
    onClick={() => onMenuClick(item)}
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

// Optimized SidebarContent Component - faqat bir marta yaratiladi
const SidebarContent = ({ activeTab, handleTabChange, isDrawerOpen, setIsDrawerOpen, onClose }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const shadowColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)');
  const prefersReducedMotion = usePrefersReducedMotion();
  const { t } = useTranslation();
  const { getUserProfile } = useAuth();

  // Memoized values
  const userData = useMemo(() => getUserProfile() || {}, [getUserProfile]);
  const isCompany = useMemo(() => localStorage.getItem("isCompany") === "true", []);
  const animation = prefersReducedMotion ? undefined : `${slideIn} 0.3s ease-out`;

  // Memoized menu items
  const menuItems = useMemo(() => [
    { id: 'profile', label: t("companyMenuItems.companySettings", "Профиль"), icon: FiUser, color: 'blue' },
    { id: 'messages', label: t("companyMenuItems.messages", "Сообщения"), icon: FiMessageSquare, color: 'green', badge: '3' },
    { id: 'balance', label: t("companyMenuItems.balance", "Баланс"), icon: FiCreditCard, color: 'purple', badge: '0' },
    { id: 'orders', label: t("second_nav.orders", 'Заказы'), icon: FiShoppingCart, color: 'orange' },
    { id: 'ads', label: t("second_nav.announcement", 'Объявления'), icon: FiEdit, color: 'teal' },
    { id: 'favorites', label: t("user_links.saved", 'Избранные'), icon: FiHeart, color: 'red' },
    { id: 'support', label: t("companyMenuItems.support", "Служба поддержки"), icon: FiHelpCircle, color: 'pink' },
    { id: 'about', label: t("companyMenuItems.about", "О UZMAT.uz"), icon: FiInfo, color: 'gray' },
  ], [t]);

  const companyMenuItems = useMemo(() => [
    { id: 'company', label: t("companyMenuItems.company", "Главная"), icon: FiHome, color: 'blue' },
    { id: 'company-settings', label: t("companyMenuItems.companySettings", "Профиль"), icon: FiUser, color: 'gray' },
    { id: 'messages', label: t("companyMenuItems.messages", "Сообщения"), icon: FiMessageCircle, badge: "3", color: 'green' },
    { id: 'balance', label: t("companyMenuItems.balance", "Баланс"), icon: FiDollarSign, badge: '0', color: 'yellow' },
    { id: 'leads', label: t("companyMenuItems.leads", "Лиды"), icon: FiTarget, badge: "5", color: 'orange' },
    { id: 'my-application', label: t("companyMenuItems.myApplication", "Мои заказы"), icon: FiFolder, color: 'purple' },
    { id: 'my-products', label: t("companyMenuItems.myProducts", "Мои объявления"), icon: FiFileText, color: 'teal' },
    { id: 'contacts', label: t("companyMenuItems.contacts", "Контакты"), icon: FiPhone, color: 'cyan' },
    { id: 'company-accounts', label: t("companyMenuItems.companyAccounts", "Реквизиты"), icon: LiaFileInvoiceDollarSolid, color: 'green' },
    { id: 'company-news', label: t("companyMenuItems.companyNews", "Новости"), icon: FaRegNewspaper, color: 'purple' },
    { id: 'documents', label: t("companyMenuItems.documents", "Документы"), icon: FiFolder, color: 'blackAlpha' },
    { id: 'support', label: t("companyMenuItems.support", "Служба поддержки"), icon: FiLifeBuoy, color: 'red' },
    { id: 'about', label: t("companyMenuItems.about", "О UZMAT.uz"), icon: FiInfo, color: 'pink' },
  ], [t]);

  const check = useBreakpointValue({
    base: true,
    custom570: false
  }, {
    fallback: 'base',
    ssr: false
  });

  // Optimized menu click handler
  const handleMenuClick = useCallback((item) => {
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
  }, [check, handleTabChange, setIsDrawerOpen, onClose]);

  // Current menu items based on user type
  const currentMenuItems = isCompany ? companyMenuItems : menuItems;

  return (
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
      {/* Logo Section */}
      <LogoSection t={t} prefersReducedMotion={prefersReducedMotion} />

      {/* Menu Items */}
      <VStack align="stretch" spacing={2}>
        {currentMenuItems.map((item, index) => {
          // Messages tugmasi uchun alohida logika
          const isMessagesActive = item.id === 'messages' && isDrawerOpen;
          const isRegularTabActive = item.id !== 'messages' && activeTab === item.id && !isDrawerOpen;
          const isActive = isMessagesActive || isRegularTabActive;

          return (
            <MenuItem
              key={item.id}
              item={item}
              index={index}
              isActive={isActive}
              onMenuClick={handleMenuClick}
              prefersReducedMotion={prefersReducedMotion}
            />
          );
        })}
      </VStack>

      <Divider my={8} />

      {/* Settings & Logout */}
      <VStack spacing={3}>
        <AccountSwitcher />
        <Button
          variant="ghost"
          colorScheme="red"
          justifyContent="flex-start"
          leftIcon={<FiLogOut />}
          width="full"
          size="lg"
          borderRadius="xl"
          _hover={{ transform: 'translateX(4px)', bg: "red.100"}}
          transition="all 0.2s"
        >
          {t('user_menu.logout', 'Выйти')}
        </Button>
      </VStack>
    </Box>
  );
};

// Optimized Sidebar Wrapper Component
const Sidebar = ({ activeTab, handleTabChange, isOpen, onClose, isDrawerOpen, setIsDrawerOpen }) => {
  const isMobile = useBreakpointValue({ base: true, custom900: false });

  // Shared props for SidebarContent
  const sidebarProps = {
    activeTab,
    handleTabChange,
    isDrawerOpen,
    setIsDrawerOpen,
    onClose,
    isMobile
  };

  // Mobile version - Drawer
  if (isMobile) {
    return (
      <Drawer isOpen={isOpen === true} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton size={'lg'} bg={'white'} zIndex={10} />
          <DrawerBody p={0} mt={5}>
            <SidebarContent {...sidebarProps} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop version - Sticky Box
  return (
    <Box 
      position="sticky" 
      top={0} 
      height="100vh" 
      overflowY="auto"
      overflowX={'hidden'}
      flexShrink={0}
    >
      <SidebarContent {...sidebarProps} />
    </Box>
  );
};

// Main ProfileDesktopSection Component
const ProfileDesktopSection = ({ activeTab, handleTabChange, children }) => {
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
    <>
      <SideTranslator />
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
    </>
  );
};

export default ProfileDesktopSection;