import React, { useEffect, useState } from 'react';
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
  useToast
} from '@chakra-ui/react';
import {
  FiShoppingBag,
  FiSpeaker,
  FiHeadphones,
  FiInfo,
  FiLogOut,
  FiChevronRight,
  FiCopy,
  FiSettings
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Pages/Auth/logic/AuthContext';

// Utility functions
const profileUtils = {
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      
      return true;
    } catch (err) {
      console.log('Copy failed');
      return false;
    }
  },

  getMenuItems: () => ({
    myItems: [
      { id: 'orders', icon: FiShoppingBag, text: 'Заказы', badge: '3', badgeColor: 'blue' },
      { id: 'ads', icon: FiSpeaker, text: 'Объявления', badge: '12', badgeColor: 'green' }
    ],
    additionalItems: [
      { id: 'support', icon: FiHeadphones, text: 'Служба поддержки', isOnline: true },
      { id: 'about', icon: FiInfo, text: 'О TService.uz' }
    ],
    dangerItems: [
      { id: 'logout', icon: FiLogOut, text: 'Выход', isDestructive: true }
    ]
  }),

  getUserData: () => ({
    name: 'Gaybullayev Jorabek',
    lastName: 'Alisher ogli',
    id: '28079',
    balance: 0,
    bonus: 0,
    isPro: true
  })
};

// UserInfo component
const UserInfo = ({ userData }) => {
  const [copiedId, setCopiedId] = useState(false);
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

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


  const handleCopy = async () => {
    const success = await profileUtils.copyToClipboard(userData.id);
    if (success) {
      setCopiedId(true);
      toast({
        title: 'ID copied',
        description: 'ID copied to clipboard',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <HStack spacing={4} w="full" align="center">
      <Box position="relative">
        <Avatar 
          size="lg" 
          bg="gradient"
          src={avatarUrl}
          bgGradient="linear(45deg, blue.400, purple.500)"
          _hover={{
            transform: 'scale(1.05)',
            transition: 'transform 0.2s ease'
          }}
        />
        {/* {userData.isPro && (
          <Badge
            position="absolute"
            bottom="-2px"
            right="-2px"
            colorScheme="green"
            borderRadius="full"
            px={2}
            fontSize="xs"
          >
            Pro
          </Badge>
        )} */}
      </Box>
      <VStack align="start" spacing={1} flex={1}>
        <Text fontSize="lg" fontWeight="bold" color={textColor}>
          {userData.fullName}
        </Text>
        <HStack spacing={2}>
          <Text fontSize="sm" color={secondaryTextColor}>
            ID: {userData.id}
          </Text>
          <Tooltip label={copiedId ? "Ko'chirildi!" : "ID ni nusxalash"}>
            <IconButton
              icon={<FiCopy />}
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
  );
};

// BalanceCard component
const BalanceCard = ({ balance, bonus, handleTabChange }) => {
  const [isVisible, setIsVisible] = useState(true);
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  const handleBalanceClick = () => {
    handleTabChange('balance'); // URL ham o'zgaradi
  };

  return (
    <VStack spacing={4} w="full" align="start" mt={4}>
      <HStack justify="space-between" w="full">
        <Text fontSize="lg" fontWeight="medium" color={textColor}>
          Баланс
        </Text>
        <Text 
          fontSize="xs" 
          color={accentColor} 
          cursor="pointer"
          onClick={() => setIsVisible(!isVisible)}
          _hover={{ textDecoration: 'underline' }}
        >
          {isVisible ? 'Yashirish' : "Ko'rsatish"}
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
            {bonus} бонус
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
        Пополнить баланс
      </Button>
    </VStack>
  );
};

// MenuItem component
const MenuItem = ({ 
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
  
  const handlePointerEnter = () => setIsHovered(true);
  const handlePointerLeave = () => setIsHovered(false);

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
        {badge && (
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
};

// Main ProfileMobileSection component
export default function ProfileMobileSection({ handleTabChange}) {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

  const navigate = useNavigate();

  const { logout, getUserProfile } = useAuth();

  const userData = getUserProfile() || {};
  const menuItems = profileUtils.getMenuItems();


  const handleMenuClick = (itemId) => {
    console.log(`Clicked: ${itemId}`);
    handleTabChange(itemId); // URL ham o'zgaradi
    
    if (itemId === 'logout') {
      console.log('Logging out...');
      logout()
      navigate("/")
      return;
    }
  };

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
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          {/* Header */}
          <Box bgGradient="linear(135deg, blue.400, purple.500, pink.400)" p={1}>
            <VStack bg={cardBg} borderRadius="lg" p={6} spacing={4} m={1}>
              <Flex w="full" justify="space-between" align="center">
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  Профиль
                </Text>
                <Tooltip label="Sozlamalar">
                  <IconButton
                    icon={<FiSettings />}
                    fontSize={'18px'}
                    variant="ghost"
                    colorScheme="gray"
                    aria-label="Settings"
                    onClick={() => navigate('/profile/settings')}
                    _hover={{ 
                      transform: 'rotate(90deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </Tooltip>
              </Flex>
              
              <UserInfo userData={userData} />
              <BalanceCard 
                // balance={userData.balance} 
                balance={0} 
                // bonus={userData.bonus} 
                bonus={0} 
                handleTabChange={handleTabChange} 
              />
            </VStack>
          </Box>

          {/* Menu */}
          <Box bg={cardBg}>
            <VStack spacing={0} align="stretch">
              {/* Мои section */}
              <Box px={6} py={4}>
                <Text fontSize="sm" color={secondaryTextColor} fontWeight="semibold" letterSpacing="wide">
                  МОИ
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
                  ДОПОЛНИТЕЛЬНО
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
}