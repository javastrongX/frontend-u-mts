import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Avatar,
  Text,
  VStack,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Badge,
  useColorModeValue,
  useDisclosure,
  Portal,
  useBreakpointValue,
} from '@chakra-ui/react';

import {
  FiMail,
  FiChevronDown as ChevronDownIcon,
  FiCheckCircle,
  FiUserPlus
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Mock data - bu real loyihalarda API dan keladi
const ACCOUNTS = [
  {
    id: '1',
    name: 'Jorabek',
    email: 'test@gmail.com',
    avatar: '',
    role: 'user',
    isActive: true,
    notifications: 3,
    // organization: 'java_strong' 
  },
  {
    id: '2',
    name: 'UZMAT',
    email: 'info@uzmat.uz',
    avatar: '',
    role: 'company',
    isActive: false,
    notifications: 10,
    organization: 'UZMAT Coo'
  }
];

// Constants - : Bir joyda barcha konstantalar
const CONSTANTS = {
  STORAGE_KEY: 'activeAccountId',
  MAX_ACCOUNTS: 2,
  MAX_NOTIFICATION_DISPLAY: 9,
  ICON_SIZES: {
    CHEVRON: 20,
    USER_PLUS: 16,
    MAIL: 12
  },
  NAVIGATION: {
    COMPANY: '/company',
    REGISTRATION: '/auth/registration-performer'
  },
  COLORS: {
    BUSINESS_BUTTON: '#ff4479',
    WHITE: '#fff'
  }
};


// : Notification formatter
const formatNotificationCount = (count) => 
  count > CONSTANTS.MAX_NOTIFICATION_DISPLAY ? `${CONSTANTS.MAX_NOTIFICATION_DISPLAY}+` : count;

// : Common styles hook
const useCommonStyles = () => ({
  bgColor: useColorModeValue('white', 'gray.800'),
  hoverBg: useColorModeValue('gray.50', 'gray.700'),
  borderColor: useColorModeValue('gray.300', 'gray.600'),
  textColor: useColorModeValue('gray.800', 'white'),
  subtextColor: useColorModeValue('gray.600', 'gray.400'),
});

// : Notification Badge Component -
const NotificationBadge = ({ count, position = "absolute", top = "-1", right = "-1" }) => {
  if (count <= 0) return null;
  
  return (
    <Badge
      position={position}
      top={top}
      right={right}
      colorScheme="red"
      borderRadius="full"
      fontSize="xs"
      minW="18px"
      h="18px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {formatNotificationCount(count)}
    </Badge>
  );
};

// : Account Info Component
const AccountInfo = ({ account, size = "sm", showEmail = false, showBadge = true }) => {
  const { textColor, subtextColor } = useCommonStyles();
  const { t } = useTranslation();


  // : Role badge color mapping
  const ROLE_BADGE_COLORS = {
    user: {
      name: t('account_switcher.user', "Пользователь"),
      color: 'blue',
    },
    company: {
      name: t('account_switcher.company', "Компания"),
      color: "purple"
    }
  }

  return (
    <HStack spacing={size === "md" ? 3 : 2}>
      <Box position="relative">
        <Avatar
          size={size}
          src={account.avatar}
          name={account.name}
          border={account.isActive ? "2px solid" : "none"}
          borderColor="blue.500"
        />
        <NotificationBadge count={account.notifications} />
      </Box>
      
      <VStack 
        align={account.organization ? "start" : "center"} 
        spacing={size === "md" ? 1 : 0}
      >
        <HStack>
          <Text 
            fontSize={size === "md" ? "md" : "sm"} 
            fontWeight={size === "md" ? "semibold" : "medium"} 
            color={textColor}
            noOfLines={1}
          >
            {account.name}
          </Text>
          {account.isActive && size === "md" && (
            <Box right={-5} pos="relative" bg={CONSTANTS.COLORS.WHITE}>
              <FiCheckCircle color="green" />
            </Box>
          )}
        </HStack>
        
        {showEmail && (
          <HStack spacing={1}>
            <FiMail size={CONSTANTS.ICON_SIZES.MAIL} color="gray" />
            <Text fontSize="xs" color={subtextColor}>
              {account.email}
            </Text>
          </HStack>
        )}
        
        {account.organization && (
          <Text fontSize="xs" color={subtextColor} noOfLines={1}>
            {account.organization}
          </Text>
        )}
        
        {showBadge && (
          <HStack spacing={2}>
            <Badge
              size={size === "md" ? "sm" : "xs"}
              colorScheme={ROLE_BADGE_COLORS[account.role].color|| 'gray'}
              variant="subtle"
              borderRadius="md"
            >
              {ROLE_BADGE_COLORS[account.role].name}
            </Badge>
            {account.organization && size === "sm" && (
              <Text fontSize="xs" color={subtextColor}>
                {account.organization}
              </Text>
            )}
          </HStack>
        )}
      </VStack>
    </HStack>
  );
};

// : Account Item Component - memoized to prevent re-renders
const AccountItem = React.memo(({ account, isActive, onSelect, loading }) => {
  const { hoverBg } = useCommonStyles();
  
  return (
    <MenuItem
      onClick={() => onSelect(account.id)}
      border="1px solid transparent"
      bg={isActive ? "purple" : "transparent"}
      _hover={{ bg: hoverBg, borderColor: "green" }}
      _focus={{ bg: hoverBg }}
      p={3}
      borderRadius="md"
      position="relative"
      isDisabled={loading}
    >
      <AccountInfo account={account} />
    </MenuItem>
  );
});

// : Menu Content Component 
const MenuContent = ({ 
  activeAccount, 
  inactiveAccounts, 
  accounts, 
  handleAccountSwitch, 
  loading, 
  navigate 
}) => {
  const { bgColor, borderColor, hoverBg, subtextColor } = useCommonStyles();
  const { t } = useTranslation();
  return (
    <MenuList
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      shadow="xl"
      minW="280px"
      p={2}
      zIndex={1000}
    >
      {/* Current account header */}
      <Box p={3} mb={2} borderRadius="lg" border="1px solid green">
        <AccountInfo account={activeAccount} size="md" showEmail={true} />
      </Box>

      <MenuDivider />

      {/* Account list */}
      {inactiveAccounts.length > 0 && (
        <>
          <Text fontSize="xs" color={subtextColor} px={3} py={1} fontWeight="semibold" textTransform="uppercase">
            {t("account_switcher.switch", "Сменить аккаунт")}
          </Text>
          
          {inactiveAccounts.map((account) => (
            <AccountItem
              key={account.id}
              account={account}
              isActive={account.isActive}
              onSelect={handleAccountSwitch}
              loading={loading}
            />
          ))}

          <MenuDivider />
        </>
      )}

      {/* Add Account button */}
      {accounts.length < CONSTANTS.MAX_ACCOUNTS && (
        <MenuItem
          fontSize="sm"
          _hover={{ bg: hoverBg }}
          borderRadius="md"
          display="flex"
          alignItems="center"
          gap={3}
          onClick={() => navigate(CONSTANTS.NAVIGATION.REGISTRATION)}
          isDisabled={loading}
        >
          <Box bg={CONSTANTS.COLORS.BUSINESS_BUTTON} px={1} py={1} borderRadius="full">
            <FiUserPlus size={CONSTANTS.ICON_SIZES.USER_PLUS} color={CONSTANTS.COLORS.WHITE} />
          </Box>
          <Text fontWeight="500" transition="0.3s all" _hover={{letterSpacing: "wider"}}>
            {t("account_switcher.add_account", "Добавление бизнес-аккаунта")}
          </Text>
        </MenuItem>
      )}
    </MenuList>
  );
};

// API integration functions (commented out for now)
/*
const API_BASE_URL = 'https://api.yourapp.com';

const fetchUserAccounts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/accounts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.accounts || [];
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return ACCOUNTS;
  }
};

const switchAccountAPI = async (accountId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/switch-account`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountId }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error switching account:', error);
    throw error;
  }
};

const fetchNotificationsCount = async (accountId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/count/${accountId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return 0;
  }
};
*/

export const AccountSwitcher = ({isMobileProfile=false}) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  // : Common styles
  const { hoverBg, subtextColor } = useCommonStyles();
  const placement = useBreakpointValue({ base: 'auto', md: 'auto-start' });
  const Menu_Portal = useBreakpointValue({ base: false, custom900: true });

  // Initialize accounts from localStorage or mock data
  useEffect(() => {
    const initializeAccounts = async () => {
      setLoading(true);
      try {
        const apiAccounts = ACCOUNTS;
        const savedActiveId = localStorage.getItem(CONSTANTS.STORAGE_KEY);
        
        const initializedAccounts = apiAccounts.map(acc => ({
          ...acc,
          isActive: savedActiveId ? acc.id === savedActiveId : acc.isActive || false
        }));
        
        if (!initializedAccounts.some(acc => acc.isActive) && initializedAccounts.length > 0) {
          initializedAccounts[0].isActive = true;
          localStorage.setItem(CONSTANTS.STORAGE_KEY, initializedAccounts[0].id);
        }
        
        setAccounts(initializedAccounts);
      } catch (error) {
        console.error('Error initializing accounts:', error);
        setAccounts(ACCOUNTS);
      } finally {
        setLoading(false);
      }
    };

    initializeAccounts();
  }, []);
  
  const activeAccount = useMemo(() => 
    accounts.find(acc => acc.isActive) || accounts[0], 
    [accounts]
  );
  
  const inactiveAccounts = useMemo(() => 
    accounts.filter(acc => !acc.isActive), 
    [accounts]
  );
  
  const handleAccountSwitch = useCallback(async (accountId) => {
    try {
      setLoading(true);
      
      setAccounts(prev => prev.map(acc => ({
        ...acc,
        isActive: acc.id === accountId
      })));
      
      localStorage.setItem(CONSTANTS.STORAGE_KEY, accountId);
      navigate(CONSTANTS.NAVIGATION.COMPANY);
      onClose();
    } catch (error) {
      console.error('Error switching account:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate, onClose]);


  if (loading || !activeAccount) {
    return (
      <Box w={isMobileProfile ? '100%' : '225px'} h="40px" bg="gray.100" borderRadius="lg" />
    );
  }
  
  return (
    <Box>
      <Menu 
        isOpen={isOpen} 
        onOpen={onOpen} 
        onClose={onClose}
        placement={placement}
        isLazy
      >
        <MenuButton
          as={IconButton}
          variant="ghost"
          bg={isMobileProfile ? "transparent" : "gray.100"}
          w={isMobileProfile ? '100%' : '225px'}
          size="lg"
          _hover={{ 
            bg: isMobileProfile ? "transparent" : hoverBg,
            borderColor: 'blue.300',
            transform: 'scale(1.02)'
          }}
          _active={{ 
            bg: isMobileProfile ? "transparent" : hoverBg,
            transform: 'scale(0.98)'
          }}
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          borderRadius="lg"
          p={1}
          isDisabled={loading}
        >
          <HStack spacing={2} justify="space-between">
            <Box 
              position="relative" 
              w="100%" 
              display={isMobileProfile ? 'none' : 'flex'} 
              gap={3} 
              px={1}
              justifyContent="space-between"
              alignItems="center"
            >
              <AccountInfo account={activeAccount} showBadge={false} />
              <NotificationBadge count={activeAccount.notifications} position="relative" top="0" right="0" />
            </Box>
            
            <Box
              transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
              transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              color={subtextColor}
            >
              <ChevronDownIcon
                size={CONSTANTS.ICON_SIZES.CHEVRON}
                color={subtextColor}
              />
            </Box>
          </HStack>
        </MenuButton>

        {/* : Menu content with Portal */}
        {Menu_Portal ? (
          <Portal>
            <MenuContent 
              activeAccount={activeAccount}
              inactiveAccounts={inactiveAccounts}
              accounts={accounts}
              handleAccountSwitch={handleAccountSwitch}
              loading={loading}
              navigate={navigate}
            />
          </Portal>
        ) : (
          <MenuContent 
            activeAccount={activeAccount}
            inactiveAccounts={inactiveAccounts}
            accounts={accounts}
            handleAccountSwitch={handleAccountSwitch}
            loading={loading}
            navigate={navigate}
          />
        )}
      </Menu>
    </Box>
  );
};