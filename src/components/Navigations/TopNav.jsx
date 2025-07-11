import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  Image,
  Avatar,
  Divider,
  useDisclosure,
  useBreakpointValue
} from "@chakra-ui/react";
import { useTranslation } from 'react-i18next';
import {
  FaUser,
  FaHeart,
  FaWallet,
  FaUserCircle,
  FaClipboardList,
  FaShoppingBag,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import SecondNav from "./SecondNav";
import { useNavigate } from "react-router-dom";
import MessagesMobile from "../MessagesSection/MessagesMobile";
import { useEffect, useState } from "react";
import { useAuth } from "../../Pages/Auth/logic/AuthContext";

const TopNav = ({ title, subTitle }) => {
  const { i18n, t } = useTranslation();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const { logout, isAuthenticated, getUserProfile } = useAuth();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const currentLang = i18n.language;
  const isMobile = useBreakpointValue({ base: true, custom570: false });
  const userData = getUserProfile() || {};

  // Avatar URL ni sozlash
  useEffect(() => {
    if (!userData?.avatar) {
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

  // Navlar va tugmalar
  const navItems = [
    { name: t('second_nav.home', "Главная"), link: '/' },
    { name: t('second_nav.announcement', "Объявление"), link: '/ads?category_id=0', pathOnly: true },
    { name: t('second_nav.orders', "Заказы"), link: '/applications?category_id=0' },
    { name: t('second_nav.for_business', "Бизнесу"), link: '/business' },
    { name: t('second_nav.partners', "Партнёры"), link: '/companies' }
  ];

  const actionButtons = [
    { btn: t('second_nav.submit_ad', "Подать объявление"), link: '/create-ads' },
    { btn: t('second_nav.place_order', "Разместить заказ"), link: '/applications/create' }
  ];

  // Menu elementlari
  const menuItems = [
    { icon: FaUserCircle, text: t('user_menu.profile', 'Профиль'), path: '/profile' },
    { icon: FaShoppingBag, text: t('user_menu.my_orders', 'MМои заказы'), path: '/profile/orders' },
    { icon: FaClipboardList, text: t('user_menu.my_ads', 'Мои объявления'), path: '/profile/ads' },
    { icon: FaHeart, text: t('user_menu.my_favorites', 'Мои избранные'), path: '/profile/favorites' },
    { icon: FaWallet, text: t('user_menu.wallet', 'Кошелёк'), path: '/profile/balance' }
  ];

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  // Logo komponenti
  const Logo = () => (
    <Heading fontWeight="medium" fontSize="28px">
      <HStack as={'a'} href='/' cursor={'pointer'}>
        <Image src="/Images/logo.png" alt="logo" boxSize="40px" borderRadius={'md'} />
        <VStack alignItems="flex-start" spacing={0}>
          <Text fontSize="17px" fontWeight="700" lineHeight="17px">{title}</Text>
          <Text fontSize="10px" fontWeight="400" lineHeight="10px">{subTitle}</Text>
        </VStack>
      </HStack>
    </Heading>
  );

  // Til o'zgartirish tugmalari
  const LanguageButtons = () => (
    <>
      {['uz', 'ru'].map(lang => (
        <Text
          key={lang}
          onClick={() => changeLanguage(lang)}
          fontWeight={currentLang === lang ? 'bold' : 'normal'}
          cursor="pointer"
          _hover={{ color: 'orange.50' }}
          color={currentLang === lang ? 'orange.50' : 'p.black'}
        >
          {lang.toUpperCase()}
        </Text>
      ))}
    </>
  );

  // Foydalanuvchi havolalari
  const UserLinks = () => (
    <HStack spacing={4} fontSize="15px">
      <Text as="a" href="/wallet" cursor="pointer" display="flex" gap={2} _hover={{ color: 'blue.400' }}>
        {t('user_links.balance', 'Пополнить баланс')}
        <Text fontWeight="bold" color="black.60">( 0 )</Text>
      </Text>
      <Text onClick={() => setIsDrawerOpen(true)} cursor="pointer" _hover={{ color: 'blue.400' }}>
        {t('user_links.messages', 'Сообщения')}
      </Text>
      <Text as="a" href="/my-favourite" cursor="pointer" _hover={{ color: 'blue.400' }}>
        {t('user_links.saved', 'Избранное')}  
      </Text>
    </HStack>
  );

  // Login menu
  const LoginMenu = () => (
    <>
      <MenuButton
        p="10px"
        borderRadius="10px"
        bg="orange.100"
        _hover={{ bg: 'orange.50' }}
        _active={{ bg: 'orange.50' }}
        onClick={onToggle}
      >
        <Text fontSize="sm" display="flex" alignItems="center">
          <Icon as={FaUser} mr={2} /> {t('avatar.login', "Войти")}
        </Text>
      </MenuButton>
      <MenuList>
        <Flex alignItems="center" gap="2" flexDirection="column" p={4}>
          <MenuItem w="250px" onClick={() => {onClose(); navigate("/auth/register");}} fontWeight="500" as={Button} bg="orange.50" _hover={{ bg: 'orange.100' }}>
            {t('avatar.register', "Регистрация")}
          </MenuItem>
          <MenuItem w="250px" onClick={() => {onClose(); navigate("/auth/login");}} fontWeight="500" as={Button} bg="orange.50" _hover={{ bg: 'orange.100' }}>
            {t('avatar.login', "Войти")}
          </MenuItem>
        </Flex>
      </MenuList>
    </>
  );

  // User menu
  const UserMenu = () => (
    <>
      <MenuButton onClick={onToggle}>
        <HStack spacing={2} cursor="pointer" _hover={{ opacity: 0.8 }} maxW={"320px"}>
          <Avatar size="sm" src={avatarUrl} />
          <VStack alignItems="flex-start" spacing={1} display={{ base: "none", md: "flex" }}>
            <Text fontSize="14px" fontWeight="600" lineHeight="20px" whiteSpace={"wrap"} noOfLines={2}>
              {userData.fullName}
            </Text>
            <Text fontSize="12px" color="gray.500" lineHeight="11px">
              ID: {userData.id}
            </Text>
          </VStack>
          <Box pl={1}>
            <Icon 
              as={isOpen ? FaChevronUp : FaChevronDown} 
              boxSize={4} 
              color="gray.600"
              transition="transform 0.2s ease"
            />
          </Box>
        </HStack>
      </MenuButton>

      <MenuList>
        {menuItems.map(({ icon, text, path }) => (
          <MenuItem key={path} icon={<Icon as={icon} />} onClick={() => navigate(path)}>
            {text}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem icon={<FaSignOutAlt />} onClick={logout} color="red.500">
          {t('user_menu.logout', 'Выйти')}
        </MenuItem>
      </MenuList>
    </>
  );

  return (
    <>
      <Box px="4" bg="black.0" display={{ base: "none", custom900: "block" }}>
        <HStack h="16" justify="space-between" mx="auto">
          <Logo />
          
          <Flex alignItems="center" gap="4">
            <Menu isOpen={isOpen} onClose={onClose}>
              <HStack spacing={3}>
                {isAuthenticated && userData && <UserLinks />}
                <LanguageButtons />
              </HStack>
              
              {isAuthenticated && userData ? <UserMenu /> : <LoginMenu />}
            </Menu>
          </Flex>
        </HStack>
      </Box>

      <Box>
        <Box bg="black.0" />
        <SecondNav arrSecondNav={navItems} arrBtn={actionButtons} />
      </Box>

      {!isMobile && (
        <MessagesMobile isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      )}
    </>
  );
};

export default TopNav;