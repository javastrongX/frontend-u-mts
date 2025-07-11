import { Grid, GridItem, Icon, IconButton, Link, Text, VStack, Avatar, Box, useBreakpointValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiHeart } from "react-icons/fi";
import { HiPlus } from "react-icons/hi";
import { RiHome3Line } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { TbMessages } from "react-icons/tb";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Pages/Auth/logic/AuthContext";
import MarqueeText from "./MarqueeText";

const BottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, getUserProfile } = useAuth();
  
  const userProfile = getUserProfile() || {};

  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (!userProfile || !userProfile.avatar) {
      setAvatarUrl('');
      return;
    }

    if (userProfile.avatar instanceof File) {
      const url = URL.createObjectURL(userProfile.avatar);
      setAvatarUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setAvatarUrl(userProfile.avatar);
    }
  }, [userProfile?.avatar]);

  const activePath = location.pathname;

  const navItems = useMemo(() => [
    { icon: RiHome3Line, label: t("bottom_nav.home", "Главная"), link: "/" },
    { icon: FiHeart, label: t("bottom_nav.favorites", "Избранное"), link: "/profile/favorites" },
    { icon: <HiPlus />, label: "", isCenter: true, link: "/create-ads" },
    { icon: TbMessages, label: t("bottom_nav.messages", "Сообщения"), link: "/profile/messages" },
    { 
      icon: CgProfile, 
      label: isAuthenticated ? userProfile?.fullName : t("bottom_nav.profile", "Профиль"), 
      link: "/profile",
      isProfile: true
    },
  ], [t, isAuthenticated, userProfile]);

  const handleNavigation = (link) => {
    navigate(link);
  };

  const hoverEffect = useBreakpointValue({
    base: {},
    custom570: {
      transform: "scale(1.2)",
      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
    },
  });


  return (
    <Grid
      templateColumns="repeat(5, 1fr)"
      w="100vw"
      position="fixed"
      bottom="0"
      left="0"
      zIndex="100"
      bg="whiteE6"
      sx={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        animation: "slideUp 0.6s cubic-bezier(0.25, 0.50, 0.45, 0.94)",
        "@keyframes slideUp": {
          "0%": { transform: "translateY(100%)", opacity: 0 },
          "100%": { transform: "translateY(0%)", opacity: 1 },
        },
      }}
      py={2}
      px={2} // O'ng va chap tarafdan joy qo'shish
      display={{ base: "grid", custom900: "none" }}
      boxShadow="0px -2px 4px rgba(0, 0, 0, 0.117)"
    >
      {navItems.map((item, index) => {
        const isActive = activePath === item.link;
        const isProfileActive = item.isProfile && isAuthenticated;

        return (
          <GridItem
            key={index}
            display="flex"
            justifyContent="center"
            alignItems="center"
            minH="60px" // Minimal balandlik
            px={1} // Har bir element orasida joy
            sx={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              "@keyframes fadeInUp": {
                "0%": { opacity: 0, transform: "translateY(20px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            {item.isCenter ? (
              <IconButton
                icon={item.icon}
                isRound
                size="sm"
                bg="orange.50"
                color="black.0"
                onClick={() => handleNavigation(item.link)}
                fontSize="30px"
                _hover={{
                  bg: "orange.50",
                  transform: "scale(1.1) rotate(90deg)",
                }}
                sx={{
                  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%, 100%": {
                      boxShadow: "0 0 0 0 rgba(255, 165, 0, 0.4)",
                    },
                    "50%": {
                      boxShadow: "0 0 0 10px rgba(255, 165, 0, 0)",
                    },
                  },
                }}
                cursor="pointer"
                aria-label="Add"
              />
            ) : (
              <VStack
                spacing={1}
                alignItems="center"
                color="black.80"
                onClick={() => handleNavigation(item.link)}
                cursor="pointer"
                w="100%" // To'liq kenglik
                maxW="70px" // Maksimal kenglik
                _hover={{
                  transform: "translateY(-3px) scale(1.05)",
                  filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.15))",
                }}
                sx={{
                  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  borderRadius: "md",
                  py: 1,
                }}
              >
                {item.isProfile && isAuthenticated ? (
                  <Avatar
                    size="xs"
                    src={avatarUrl}
                    sx={{
                      transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      cursor: "pointer",
                      filter: isActive
                        ? "drop-shadow(0 0 8px rgba(255, 165, 0, 0.7))"
                        : "none",
                      transform: isActive ? "scale(1.2)" : "scale(1)",
                      ...hoverEffect,
                    }}
                    border={isActive ? "2px solid #fed500" : "none"}
                  />
                ) : (
                  <Icon
                    p={1}
                    fontSize="24px" // Bir oz kichikroq icon
                    as={item.icon}
                    borderRadius="md"
                    bg={isActive ? "orange.50" : "transparent"}
                    sx={{
                      transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      cursor: "pointer",
                      filter: isActive
                        ? "drop-shadow(0 0 8px rgba(255, 165, 0, 0.7))"
                        : "none",
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                      _hover: {
                        transform: "scale(1.1) rotate(5deg)",
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                      },
                    }}
                  />
                )}
                <Box
                  fontSize="10px" // Kichikroq font
                  w="100%"
                  textAlign="center"
                  lineHeight="1.2"
                  sx={{
                    transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    fontWeight: isActive ? "semibold" : "normal",
                    filter: isActive
                      ? "drop-shadow(0 0 6px rgba(255, 165, 0, 0.7))"
                      : "none",
                    _hover: {
                      fontWeight: "semibold",
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  {isProfileActive ? (
                    <MarqueeText
                      text={item.label}
                      active={true}
                      speed={4}
                    />
                  ) : (
                    <Text 
                      w="100%" 
                      textAlign="center"
                      whiteSpace={"nowrap"}
                      // noOfLines={2} // Maksimal 2 qator
                      fontSize="10px"
                      lineHeight="1.2"
                      overflow="hidden"
                      // sx={{
                      //   wordBreak: "break-word",
                      //   hyphens: "auto",
                      // }}
                    >
                      {item.label}
                    </Text>
                  )}
                </Box>
              </VStack>
            )}
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default BottomNav;