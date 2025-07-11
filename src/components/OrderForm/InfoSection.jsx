import { Box, Card, CardBody, Heading, HStack, Image, ScaleFade, SimpleGrid, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiZap } from "react-icons/fi";


// Enhanced Info Section with animations
export const InfoSection = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('blue.200', 'blue.600');
  
  const { t } = useTranslation();

  const features = [
    { icon: '/OrderFormHelpIcons/rocket.png', title: t("Orderform.how_it_works.steps.fast_service", "Быстрое обслуживание"), desc: t("Orderform.how_it_works.steps.fast_service_desc", "Разместите заказ за 3 минуты") },
    { icon: '/OrderFormHelpIcons/group.png', title: t("Orderform.how_it_works.steps.verified_experts", "Проверенные специалисты"), desc: t("Orderform.how_it_works.steps.verified_experts_desc", "База подтвержденных специалистов") },
    { icon: '/OrderFormHelpIcons/diamond.png', title: t("Orderform.how_it_works.steps.best_offers", "Лучшие предложения"), desc: t("Orderform.how_it_works.steps.best_offers_desc", "Конкурентоспособные цены и качество") }
  ];

  return (
    <ScaleFade in={true} initia lScale={0.9}>
      <Card
        mb={8}
        bg={cardBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="xl"
        overflow="hidden"
        position="relative"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          height="4px"
          bgGradient="linear(to-r, blue.400, purple.500, pink.400)"
        />
        <CardBody p={8}>
          <HStack mb={6} spacing={3}>
            <Box
              p={3}
              bgGradient="linear(to-r, blue.400, purple.500)"
              borderRadius="full"
              color="white"
            >
              <FiZap size={24} />
            </Box>
            <VStack align="start" spacing={0}>
              <Heading size="md" color="gray.800">
                {t("Orderform.how_it_works.title", "Как работает сервис?")}
              </Heading>
              <Text color="gray.600" fontSize="sm">
                {t("Orderform.how_it_works.subtitle", "Профессиональное обслуживание за 3 минуты")}
              </Text>
            </VStack>
          </HStack>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {features.map((feature, index) => (
              <ScaleFade key={index} in={true} delay={index * 0.1}>
                <VStack
                  p={6}
                  bg="blue.50"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="blue.100"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'lg',
                    borderColor: 'blue.300'
                  }}
                  transition="all 0.3s"
                  cursor="pointer"
                >
                  <Image pointerEvents={'none'} src={feature.icon} h={{base: "40px", md: "50px"}} objectFit={'cover'} w={{base: "40px", md: "50px"}}/>
                  <Text fontWeight="bold" color="gray.800" textAlign="center">
                    {feature.title}
                  </Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    {feature.desc}
                  </Text>
                </VStack>
              </ScaleFade>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    </ScaleFade>
  );
};

