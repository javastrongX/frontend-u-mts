import {
  Box,
  HStack,
  Heading,
  Icon,
  Stack,
  Text,
  VStack,
  Image,
  Button,
} from "@chakra-ui/react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbSettingsCog } from "react-icons/tb";
import { GrUserSettings } from "react-icons/gr";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiOutlineUserGroup } from "react-icons/hi";

const Sidenav = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const isActiveLink = (link) => location.pathname === link;

  const navLinks = [
    {
      icon: MdOutlineShoppingCart,
      text: t("side_nav.sell_special_tech", "Продажа спецтехники"),
      link: "/ads?category_id=1",
    },
    {
      icon: null,
      image: "/arenda.svg",
      text: t("side_nav.rent", "Аренда спецтехники"),
      link: "/ads?category_id=2",
    },
    {
      icon: IoDocumentTextOutline,
      text: t("side_nav.orders", "Заказы"),
      link: "/applications",
    },
    {
      icon: TbSettingsCog,
      text: t("side_nav.spare_parts", "Запчасти"),
      link: "/ads?category_id=3",
    },
    { 
      icon: GrUserSettings,
      text: t("side_nav.repair", "Ремонт"),
      link: "/ads?category_id=4",
    },
    {
      icon: null,
      image: "/userdriver.svg",
      text: t("side_nav.drivers", "Водители"),
      link: "/ads?category_id=5",
    },
    {
      icon: null,
      image: "/lokatr.svg",
      text: t("side_nav.news", "Новости"),
      link: "/news",
    },
    {
      icon: HiOutlineUserGroup,
      text: t("second_nav.partners", "Партнёры"),
      link: "/companies",
    }
  ];

  const title = t("avatar.brand", "TService.uz");
  const subTitle = t("avatar.brand_subtitle", "Мир спецтехники");

  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language;
  
  return (
    <Stack
      bg="white"
      justify="space-between"
      boxShadow={{ base: "none", lg: "lg" }}
      w={{ base: "full", lg: "16rem" }}
      h="100%"
    >
      <Box>
        <Heading textAlign="center" fontSize="20px" as="h1" pt="3.5rem">
          <HStack as="a" href="/" cursor="pointer">
            <Image src="/Images/logo.png" alt="logo" boxSize="40px" borderRadius="md" />
            <VStack alignItems="flex-start" spacing={0}>
              <Text fontSize="17px" fontWeight="700" lineHeight="17px">
                {title}
              </Text>
              <Text fontSize="10px" fontWeight="400" lineHeight="10px">
                {subTitle}
              </Text>
            </VStack>
          </HStack>
        </Heading>

        <Box mt="6" mx="1">
          {navLinks.map((nav) => (
            <Link to={nav.link} key={nav.text}>
              <HStack
                bg={isActiveLink(nav.link) ? "#F3F3F7" : "transparent"}
                color={isActiveLink(nav.link) ? "#171717" : "#797E82"}
                borderRadius="10px"
                px="3"
                py="2"
              >
                {nav.icon ? (
                  <Icon as={nav.icon} color={'orange.150'} fontSize={'20px'} />
                ) : (
                  <Image src={nav.image} boxSize="20px" />
                )}
                <Text fontSize="14px" fontWeight="medium">
                  {nav.text}
                </Text>
              </HStack>
            </Link>
          ))}
        </Box>
      </Box>

      <Box mt="6" mx="3" mb="6">
        <HStack
          spacing={2}
          p={1}
          bg="gray.100"
          borderRadius="full"
          w="fit-content"
        >
          {["uz", "ru"].map((lng) => {
            const isActive = currentLang === lng;

            return (
              <Button
                key={lng}
                size="sm"
                px={4}
                fontWeight="semibold"
                borderRadius="full"
                bg={isActive ? "orange.400" : "transparent"}
                color={isActive ? "white" : "gray.600"}
                _hover={{ bg: isActive ? "orange.500" : "gray.200" }}
                onClick={() => changeLanguage(lng)}
                transition="all 0.2s ease"
              >
                {lng.toUpperCase()}
              </Button>
            );
          })}
        </HStack>
      </Box>
    </Stack>
  );
};

export default Sidenav;
