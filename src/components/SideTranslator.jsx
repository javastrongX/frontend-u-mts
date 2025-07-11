import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  HStack, 
  useBreakpointValue, 
  IconButton,
  Text,
  VStack,
  useDisclosure
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GrLanguage } from "react-icons/gr";

const MotionBox = motion.create(Box);

const SideTranslator = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { i18n, t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const changeLanguage = (lng) => {
    setCurrentLang(lng);
    i18n.changeLanguage(lng);
    onClose();
  };

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.translator-container')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Mobile swipe trigger
  const MobileSwipeButton = () => {
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleTouchStart = (e) => {
      setStartX(e.touches[0].clientX);
      setCurrentX(e.touches[0].clientX);
      setIsDragging(true);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      setCurrentX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      
      const diff = currentX - startX;
      if (diff > 50) { // Swipe right threshold
        onOpen();
      }
      
      setIsDragging(false);
      setStartX(0);
      setCurrentX(0);
    };

    return (
      <Box
        position="fixed"
        left={0}
        top="50%"
        transform="translateY(-50%)"
        zIndex={1000}
        w="20px"
        h="60px"
        bg="rgba(0, 0, 0, 0.1)"
        borderRadius="0 10px 10px 0"
        cursor="pointer"
        display="flex"
        alignItems="center"
        justifyContent="center"
        opacity={isDragging ? 0.8 : 0.3}
        transition="opacity 0.2s ease"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={onOpen}
        className="translator-container"
      >
        <Box
          w="3px"
          h="30px"
          bg="rgba(0, 0, 0, 0.963)"
          borderRadius="2px"
        />
      </Box>
    );
  };

  // Desktop floating button
  const DesktopFloatingButton = () => (
    <MotionBox
      position="fixed"
      right={6}
      top="50%"
      transform="translateY(-50%)"
      zIndex={1000}
      className="translator-container"
    >
      <MotionBox
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <IconButton
        onClick={onOpen}
        icon={<GrLanguage color="#333" />}
        aria-label="Open language selector"
        bg="linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)"
        color="#333"
        borderRadius="full"
        size="lg"
        boxShadow="0 4px 16px rgba(0, 0, 0, 0.1)"
        _hover={{
            bg: "linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%)",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
        }}
        _active={{
            transform: "translateY(0px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
        }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        />

      </MotionBox>
    </MotionBox>
  );

  // Language panel
  const LanguagePanel = () => (
    <AnimatePresence>
      {isOpen && (
        <MotionBox
          position="fixed"
          top="50%"
          left={isMobile ? "50%" : "auto"}
          right={isMobile ? "auto" : "6"}
          transform={isMobile ? "translate(-50%, -50%)" : "translateY(-50%)"}
          zIndex={1001}
          className="translator-container"
        >
          <MotionBox
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              y: isMobile ? 20 : 0,
              x: isMobile ? 0 : 20
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              x: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              y: isMobile ? 20 : 0,
              x: isMobile ? 0 : 20
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3
            }}
            bg="rgba(255, 255, 255, 0.95)"
            backdropFilter="blur(20px)"
            borderRadius="24px"
            p={6}
            boxShadow="0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.08)"
            border="1px solid rgba(255, 255, 255, 0.2)"
            minW={isMobile ? "280px" : "320px"}
          >
            <VStack spacing={4}>
              <Text 
                fontSize="lg" 
                fontWeight="bold" 
                color="gray.700"
                textAlign="center"
              >
                {t("choose_lang", "Выберите язык")}
              </Text>
              
              <HStack spacing={3}>
                {[
                  { code: 'uz', name: 'O\'zbek', flag: '🇺🇿' },
                  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
                ].map((lang) => {
                  const isActive = currentLang === lang.code;
                  return (
                    <MotionBox
                      key={lang.code}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => changeLanguage(lang.code)}
                        size="lg"
                        px={6}
                        py={3}
                        fontWeight="semibold"
                        borderRadius="16px"
                        bg={isActive ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" : "gray.100"}
                        color={isActive ? "white" : "gray.700"}
                        _hover={{
                          bg: isActive 
                            ? "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)" 
                            : "gray.200",
                          transform: "translateY(-2px)",
                          boxShadow: isActive 
                            ? "0 8px 25px rgba(79, 172, 254, 0.3)" 
                            : "0 4px 12px rgba(0, 0, 0, 0.1)"
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        leftIcon={<Box fontSize="lg">{lang.flag}</Box>}
                      >
                        {lang.name}
                      </Button>
                    </MotionBox>
                  );
                })}
              </HStack>
              
            </VStack>
          </MotionBox>
        </MotionBox>
      )}
    </AnimatePresence>
  );

  // Backdrop overlay
  const Backdrop = () => (
    <AnimatePresence>
      {isOpen && (
        <MotionBox
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.2)"
          backdropFilter="blur(4px)"
          zIndex={999}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        />
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Backdrop />
      {isMobile ? <MobileSwipeButton /> : <DesktopFloatingButton />}
      <LanguagePanel />
    </>
  );
};

export default SideTranslator;