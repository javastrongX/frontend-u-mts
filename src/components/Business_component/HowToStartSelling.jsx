import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Text,
  Circle,
  useBreakpointValue,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const HowToStartSelling = () => {
  const isMobile = useBreakpointValue({ base: true, custom900: false });
  const stepSpacing = useBreakpointValue({ base: 8, custom900: 0 });
  const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const steps = [
    {
      number: "1",
      title: t("business.tips_step1_title", "Зарегистрируйтесь"),
      description: t("business.tips_step1", "Укажите телефон, адрес электронной почты."),
    },
    {
      number: "2",
      title: t("business.tips_step2_title", "Разместите товары"),
      description:
        t("business.tips_step2", "Загрузите фотографии и описания. На TService.uz работает импорт товаров в несколько кликов."),
    },
    {
      number: "3",
      title: t("business.tips_step3_title", "Получайте заказы"),
      description:
        t("business.tips_step3", "Быстро обрабатывайте каждый заказ, ведь покупатель ждет его."),
    },
  ];



  return (
    <Box 
      py={{ base: 12, md: 14, lg: 16 }} 
      px={containerPadding} 
      maxW="100%" 
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <VStack maxW={'75rem'} spacing={{ base: 8, md: 12 }} align="stretch">
        {/* Header */}
        <Heading 
          as="h2" 
          textAlign="center" 
          fontSize={{base: "24px", custom900: '38px'}}
          color="p.black"
          fontWeight="bold"
        >
          {t("business.tips_title", "Как начать продавать?")}
        </Heading>

        {/* Steps Container */}
        <Box position="relative" w="100%">
          {/* Desktop Layout */}
          {!isMobile ? (
            <HStack spacing={0} align="flex-start" justify="space-between">
              {steps.map((step, index) => (
                <Flex
                  key={index}
                  direction="column"
                  align="center"
                  flex="1"
                  position="relative"
                  maxW="300px"
                >
                  {/* Connecting Line (Desktop) */}
                  {index < steps.length - 1 && (
                    <Box
                      position="absolute"
                      top="30px"
                      left={"calc(55% + 30px)"}
                      right={"calc(-45% + 30px)"}
                      height="4px"
                      bg="orange.50"
                      zIndex={0}
                    />
                  )}

                  {/* Step Content */}
                  <VStack spacing={4} align="center" zIndex={1}>
                    <Circle
                      size="60px"
                      bg="orange.50"
                      color="black.0"
                      fontWeight="bold"
                      fontSize="30px"
                      boxShadow="lg"
                      transition="all 0.3s ease"
                      _hover={{ 
                        transform: "scale(1.1)", 
                        boxShadow: "xl" 
                      }}
                    >
                      {step.number}
                    </Circle>
                    
                    <Text 
                      fontWeight="bold" 
                      fontSize={{ base: "md", md: "lg" }}
                      textAlign="center"
                      color="p.black"
                    >
                      {step.title}
                    </Text>
                    
                    <Text 

                      color="black.80" 
                      fontSize={{ base: "sm", md: "md" }}
                      textAlign="center"
                      lineHeight="1.6"
                      px={2}
                    >
                      {step.description}
                    </Text>
                  </VStack>
                </Flex>
              ))}
            </HStack>
          ) : (
            /* Mobile Layout */
            <VStack spacing={stepSpacing} align="center">
              {steps.map((step, index) => (
                <Box key={index} position="relative" w="100%">

                  {/* Step Content */}
                  <VStack spacing={4} align="center" zIndex={1} bg="white" py={2}>
                    <Circle
                      size="60px"
                      bg="orange.50"
                      color="black.0"
                      fontWeight="bold"
                      fontSize="30px"
                      boxShadow="lg"
                    >
                      {step.number}
                    </Circle>
                    
                    <Text 
                      fontWeight="bold" 
                      fontSize="lg"
                      textAlign="center"
                      color="gray.800"
                    >
                      {step.title}
                    </Text>
                    
                    <Text 
                      color="gray.600" 
                      fontSize="md"
                      textAlign="center"
                      lineHeight="1.6"
                      maxW="300px"
                      px={4}
                    >
                      {step.description}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>

        {/* Call to Action Button */}
        <Center pt={{ base: 4, md: 8 }}>
          <Button
            size={{base: "md", custom900: "lg"}}
            bg="orange.50"
            w={{ base: "100%", md: "auto" }}
            color="black"
            fontWeight="bold"
            borderRadius="xl"
            boxShadow="lg"
            onClick={() => navigate('/auth/registration-performer')}
            _hover={{
              bg: "orange.50",
            }}
            _active={{
              transform: "translateY(1px)",
              boxShadow: "lg",
              bg: "orange.150",
            }}
          >
            {t("business.all_btn", "Начать продавать")}
          </Button>
        </Center>
      </VStack>
    </Box>
  );
};

export default HowToStartSelling;