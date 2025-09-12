import React, { useEffect, useState, useCallback, use } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Divider,
  useColorModeValue,
  Flex,
  Badge,
  ScaleFade,
  IconButton,
  Tooltip,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  useDisclosure,
  AvatarBadge
} from '@chakra-ui/react';
import {
  FiShoppingBag,
  FiSpeaker,
  FiHeadphones,
  FiInfo,
  FiLogOut,
  FiChevronRight,
  FiCopy,
  FiSettings,
  FiCheck
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Pages/Auth/logic/AuthContext';
import { useTranslation } from 'react-i18next';
import { AccountSwitcher } from '../AccountSwitcher/AccountSwitcher';

// Utility functions
const profileUtils = {
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return false;
    }
  },

  getMenuItems: (t) => ({
    myItems: [
      { id: 'orders', icon: FiShoppingBag, text: t('ProfileMobile.orders', 'Заказы'), badge: ' ', badgeColor: 'blue' },
      { id: 'ads', icon: FiSpeaker, text: t('ProfileMobile.ads', 'Объявления'), badge: ' ', badgeColor: 'green' }
    ],
    additionalItems: [
      { id: 'support', icon: FiHeadphones, text: t('ProfileMobile.support', 'Служба поддержки'), isOnline: true },
      { id: 'about', icon: FiInfo, text: t('ProfileMobile.about', 'О UZMAT.uz') }
    ],
    dangerItems: [
      { id: 'logout', icon: FiLogOut, text: t('ProfileMobile.logout', 'Выход'), isDestructive: true }
    ]
  }),
};

// AvatarModal component
const AvatarModal = React.memo(({ isOpen, onClose, avatarUrl, userName, t }) => {
  const modalBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent bg={modalBg} borderRadius="xl" maxW="90vw" maxH="90vh">
        <ModalHeader color={textColor} textAlign="center">
          {t('ProfileMobile.profilePhoto', 'Фото профиля')}
        </ModalHeader>
        <ModalCloseButton color={textColor} />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Box 
              borderRadius="full" 
              overflow="hidden"
              boxShadow="xl"
              border="4px solid"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={userName}
                  w="250px"
                  h="250px"
                  objectFit="cover"
                  fallback={
                    <Avatar
                      size="2xl"
                      name={userName}
                      bgGradient="linear(45deg, blue.400, purple.500)"
                      color="white"
                      fontSize="4xl"
                    />
                  }
                />
              ) : (
                <Avatar
                  size="2xl"
                  name={userName}
                  bgGradient="linear(45deg, blue.400, purple.500)"
                  color="white"
                  fontSize="4xl"
                />
              )}
            </Box>
            <Text fontSize="lg" fontWeight="semibold" color={textColor} textAlign="center">
              {userName}
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

AvatarModal.displayName = 'AvatarModal';

// UserInfo component
const UserInfo = React.memo(({ userData, t }) => {
  const [copiedId, setCopiedId] = useState(false);
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (!userData || !userData.avatar) {
      setAvatarUrl('');
      return;
    }

    if (userData.avatar instanceof File) {
      const url = URL.createObjectURL(userData.avatar);
      setAvatarUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setAvatarUrl(userData.avatar);
    }
  }, [userData?.avatar]);

  const handleCopy = useCallback(async () => {
    if (!userData?.id) return;
    
    const success = await profileUtils.copyToClipboard(userData.id);
    if (success) {
      setCopiedId(true);
      toast({
        title: t('ProfileMobile.idCopied', 'ID скопирован'),
        description: t('ProfileMobile.idCopiedToClipboard', 'ID скопирован в буфер обмена'),
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      setTimeout(() => setCopiedId(false), 2000);
    }
  }, [userData?.id, toast, t]);

  const handleAvatarClick = useCallback(() => {
    onOpen();
  }, [onOpen]);

  return (
    <>
      <HStack spacing={4} w="full" align="center">
        <Box position="relative">
          <Avatar 
            size="lg" 
            bg="gradient"
            src={avatarUrl}
            bgGradient="linear(45deg, blue.400, purple.500)"
            cursor="pointer"
            onClick={handleAvatarClick}
            _active={{
              transform: 'scale(0.98)',
              transition: 'transform 0.1s ease'
            }}
          >
            <AvatarBadge right={"2px"} bottom={'2px'} boxSize='1em' border={'4px solid'} borderColor='white' bg='purple.700' />
          </Avatar>
        </Box>
        <VStack align="start" spacing={1} flex={1}>
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            {userData?.fullName}
          </Text>
          <HStack spacing={2}>
            <Text fontSize="sm" color={secondaryTextColor}>
              ID: {userData?.id}
            </Text>
            <Tooltip label={copiedId ? t('ProfileMobile.copied', 'Скопировано!') : t('ProfileMobile.copyId', "Скопировать ID")}>
              <IconButton
                icon={copiedId ? <FiCheck /> : <FiCopy />}
                size="xs"
                variant="ghost"
                colorScheme={copiedId ? "green" : "gray"}
                aria-label="Copy ID"
                onClick={handleCopy}
                _hover={{ 
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </Tooltip>
          </HStack>
        </VStack>
      </HStack>

      <AvatarModal 
        isOpen={isOpen} 
        onClose={onClose} 
        avatarUrl={avatarUrl} 
        userName={userData?.fullName} 
        t={t}
      />
    </>
  );
});

UserInfo.displayName = 'UserInfo';

// BalanceCard component
const BalanceCard = React.memo(({ balance, bonus, handleTabChange, t }) => {
  const [isVisible, setIsVisible] = useState(true);
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  const handleBalanceClick = useCallback(() => {
    handleTabChange('balance');
  }, [handleTabChange]);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  return (
    <VStack spacing={4} w="full" align="start" mt={4}>
      <HStack justify="space-between" w="full">
        <Text fontSize="lg" fontWeight="medium" color={textColor}>
          {t("ProfileMobile.balance", "Баланс")}
        </Text>
        <Text 
          fontSize="xs" 
          color={accentColor} 
          cursor="pointer"
          onClick={toggleVisibility}
          _hover={{ textDecoration: 'underline' }}
        >
          {isVisible ? t('ProfileMobile.hide', 'Скрыть') : t('ProfileMobile.show', "Показать")}
        </Text>
      </HStack>
      
      <ScaleFade in={isVisible}>
        <HStack spacing={3} align="baseline">
          <Text 
            fontSize="3xl" 
            fontWeight="bold" 
            color={textColor}
            bgGradient="linear(45deg, blue.400, purple.500)"
            bgClip="text"
          >
            {balance}
          </Text>
          <Badge colorScheme="orange" borderRadius="full" px={3}>
            {bonus} {t("ProfileMobile.bonus", "бонус")}
          </Badge>
        </HStack>
      </ScaleFade>
      
      <Button 
        bg="linear-gradient(135deg, #FFD700, #FFA500)"
        color="white" 
        size="lg" 
        w="full" 
        fontWeight="semibold"
        borderRadius="xl"
        _hover={{ 
          transform: 'translateY(-2px)',
          boxShadow: 'xl',
          bg: "linear-gradient(135deg, #FFA500, #FF8C00)"
        }}
        _active={{ transform: 'translateY(0px)' }}
        transition="all 0.2s ease"
        onClick={handleBalanceClick}
      >
        {t("ProfileMobile.topup", "Пополнить баланс")}
      </Button>
    </VStack>
  );
});

BalanceCard.displayName = 'BalanceCard';

// MenuItem component
const MenuItem = React.memo(({ 
  icon: Icon, 
  text, 
  textColor = "gray.800", 
  badge, 
  badgeColor = "blue",
  isOnline = false,
  isDestructive = false,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
  const handlePointerEnter = useCallback(() => setIsHovered(true), []);
  const handlePointerLeave = useCallback(() => setIsHovered(false), []);
  const getBadgeType = (badge) => {
    if (!badge) return 'none';
      if (badge.trim() === '') return 'dot';
      return 'text';
  };

  const badgeType = getBadgeType(badge);
  return (
    <HStack 
      px={6} 
      py={4} 
      spacing={4} 
      cursor="pointer"
      bg={isHovered ? hoverBg : 'transparent'}
      transition="all 0.2s ease"
      transform={isHovered ? 'translateX(4px)' : 'translateX(0px)'}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
    >
      <Box position="relative">
        <Icon 
          size={22} 
          color={textColor === "red.500" ? "#E53E3E" : undefined}
          style={{
            transition: 'transform 0.2s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        />
        {isOnline && (
          <Box
            position="absolute"
            top="-2px"
            right="-2px"
            w="8px"
            h="8px"
            bg="green.400"
            borderRadius="full"
            border="2px solid white"
          />
        )}
      </Box>
      
      <Text color={textColor} flex={1} fontWeight="medium">
        {text}
      </Text>
      
      <HStack spacing={2}>
        {badgeType === 'text' && (
          <Badge 
            colorScheme={badgeColor} 
            borderRadius="full" 
            px={2}
            transform={isHovered ? 'scale(1.1)' : 'scale(1)'}
            transition="transform 0.2s ease"
          >
            {badge}
          </Badge>
        )} 
        {badgeType === 'dot' && (
          <Box
            borderRadius="full" 
            h={2}
            w={2}
            bg="red.500"
            transform={isHovered ? 'scale(1.1)' : 'scale(1)'}
            transition="transform 0.2s ease"
          />
        )}

        
        <FiChevronRight 
          size={16} 
          color={textColor === "red.500" ? "#E53E3E" : undefined}
          style={{
            transition: 'transform 0.2s ease',
            transform: isHovered ? 'translateX(4px)' : 'translateX(0px)',
            opacity: isDestructive ? 0.7 : 0.5
          }}
        />
      </HStack>
    </HStack>
  );
});

MenuItem.displayName = 'MenuItem';

// Main ProfileMobileSection component
const ProfileMobileSection = ({ handleTabChange }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { logout, getUserProfile } = useAuth();

  const userData = getUserProfile() || {};
  const menuItems = profileUtils.getMenuItems(t);

  const handleMenuClick = useCallback((itemId) => {
    handleTabChange(itemId);
    
    if (itemId === 'logout') {
      logout();
      navigate("/");
      return;
    }
  }, [handleTabChange, logout, navigate]);

  const handleSettingsClick = useCallback(() => {
    navigate('/profile/settings');
  }, [navigate]);

  return (
    <Box bg={bgColor} minH="100vh" p={4} pb={'100px'}>
      <ScaleFade initialScale={0.9} in={true}>
        <Box 
          maxW="xl" 
          mx="auto" 
          bg={cardBg} 
          borderRadius="xl" 
          overflow="hidden"
          boxShadow="xl"
          border="1px solid"
          borderColor={borderColor}
        >
          {/* Header */}
          <Box bgGradient="linear(135deg, blue.400, purple.500, pink.400)" p={1}>
            <VStack bg={cardBg} borderRadius="lg" p={6} spacing={4} m={1}>
              <Flex w="full" justify="space-between" align="center">
                <HStack>
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    {t('ProfileMobile.profile', "Профиль")}
                  </Text>
                  <AccountSwitcher isMobileProfile={true} />
                </HStack>
                <Tooltip label={t("ProfileMobile.settings", "Настройки")}>
                  <IconButton
                    icon={<FiSettings />}
                    fontSize={'18px'}
                    variant="ghost"
                    colorScheme="gray"
                    aria-label="Settings"
                    onClick={handleSettingsClick}
                    _hover={{ 
                      transform: 'rotate(90deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </Tooltip>
              </Flex>
              
              <UserInfo userData={userData} t={t} />
              <BalanceCard 
                balance={0} 
                bonus={0} 
                handleTabChange={handleTabChange}
                t={t}
              />
            </VStack>
          </Box>

          {/* Menu */}
          <Box bg={cardBg}>
            <VStack spacing={0} align="stretch">
              {/* Мои section */}
              <Box px={6} py={4}>
                <Text fontSize="sm" color={secondaryTextColor} fontWeight="semibold" letterSpacing="wide">
                  {t("ProfileMobile.my", "МОИ")}
                </Text>
              </Box>
              
              {menuItems.myItems.map((item) => (
                <MenuItem 
                  key={item.id}
                  icon={item.icon}
                  text={item.text}
                  textColor={textColor}
                  badge={item.badge}
                  badgeColor={item.badgeColor}
                  onClick={() => handleMenuClick(item.id)}
                />
              ))}

              <Divider mx={6} />

              {/* Дополнительно section */}
              <Box px={6} py={4}>
                <Text fontSize="sm" color={secondaryTextColor} fontWeight="semibold" letterSpacing="wide">
                  {t("ProfileMobile.more", "ДОПОЛНИТЕЛЬНО")}
                </Text>
              </Box>
              
              {menuItems.additionalItems.map((item) => (
                <MenuItem 
                  key={item.id}
                  icon={item.icon}
                  text={item.text}
                  textColor={textColor}
                  isOnline={item.isOnline}
                  onClick={() => handleMenuClick(item.id)}
                />
              ))}

              <Divider mx={6} />

              {menuItems.dangerItems.map((item) => (
                <MenuItem 
                  key={item.id}
                  icon={item.icon}
                  text={item.text}
                  textColor="red.500"
                  isDestructive={item.isDestructive}
                  onClick={() => handleMenuClick(item.id)}
                />
              ))}
            </VStack>
          </Box>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default ProfileMobileSection;