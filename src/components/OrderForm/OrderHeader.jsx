import { useTranslation } from "react-i18next";
import {
  Box, Heading, HStack, IconButton, Progress, SlideFade,
  Text, Tooltip, useColorModeValue, VStack
} from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect, useState } from "react";

export const OrderHeader = ({ onBack, step, totalSteps, isEditMode = false }) => {
  const { t } = useTranslation();
  const [isSticky, setIsSticky] = useState(true);
  const [maxStickyHeight, setMaxStickyHeight] = useState(2800);

  const bgGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.700)'
  );


  useEffect(() => {
    const calculateMaxHeight = () => {
      const width = window.innerWidth;

      if (width > 900) {
        setMaxStickyHeight(1800);
        return;
      }

      if (width <= 400) {
        setMaxStickyHeight(2800);
        return;
      }
      const extra = width - 400;
      const steps = Math.floor(extra / 20);
      const reduction = steps * 72;
      const calculated = 2800 - reduction;
      setMaxStickyHeight(Math.max(calculated, 1800)); // pastga cheklov
    };

    calculateMaxHeight();
    window.addEventListener('resize', calculateMaxHeight);
    return () => window.removeEventListener('resize', calculateMaxHeight);
  }, []);

  // 📌 Scroll kuzatuvchi sticky holatini boshqaradi
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY <= maxStickyHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [maxStickyHeight]);

  return (
    <Box 
      position={isSticky ? 'sticky' : 'relative'} 
      top={isSticky ? 1 : 'auto'}
      zIndex={10}
      transition="all 0.3s ease"
    >
      <SlideFade in={true} offsetY="-20px">
        <Box
          bgGradient={bgGradient}
          borderRadius="2xl"
          p={6}
          mb={8}
          position="relative"
          overflow="hidden"
          opacity={isSticky ? 1 : 0.8}
          transform={isSticky ? 'translateY(0)' : 'translateY(-10px)'}
          transition="all 0.3s ease"
        >
          <Box position="absolute" top="-50%" right="-20%" width="200px" height="200px" borderRadius="full" bg="whiteAlpha.100" />
          <Box position="absolute" bottom="-30%" left="-10%" width="150px" height="150px" borderRadius="full" bg="whiteAlpha.50" />
          <HStack spacing={4} position="relative" zIndex={1}>
            <Tooltip label={t("ApplicationForm.back", "Назад")} placement="bottom">
              <IconButton
                icon={<FiArrowLeft />}
                variant="ghost"
                onClick={onBack}
                aria-label="Назад"
                color="white"
                size="lg"
                _hover={{ bg: 'whiteAlpha.200', transform: 'translateX(-2px)' }}
                transition="all 0.2s"
              />
            </Tooltip>
            <VStack align="start" spacing={1}>
              <Heading size="lg" color="white">
                {isEditMode 
                ? t('ApplicationForm.edit_order.title', "Редактировать заказ") 
                : t('ApplicationForm.create_order.title', "Создать новый заказ")}
              </Heading>
              <Text color="whiteAlpha.800" fontSize="sm">
                {isEditMode 
                ? t('ApplicationForm.edit_order.subtitle', "Обновите ваш заказ за 3 минуты") 
                : t('ApplicationForm.create_order.subtitle', "Профессиональное обслуживание за 3 минуты")
                }
              </Text>
            </VStack>
          </HStack>
          <Progress
            value={(step / totalSteps) * 100}
            colorScheme="brown"
            bg="whiteAlpha.200"
            borderRadius="full"
            mt={4}
            height="6px"
          />
        </Box>
      </SlideFade>
    </Box>
  );
};
