import { Box, Button, Card, CardBody, Collapse, HStack, SimpleGrid, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiClock, FiHelpCircle, FiMail, FiPhone, FiStar, FiX } from "react-icons/fi";



// Enhanced Support Section
export const SupportSection = ({ showSupport, setShowSupport }) => {
  const cardBg = useColorModeValue('orange.100', 'orange.900');
  
  const { t } = useTranslation();

  return (
    <Card mb={8} bg={cardBg} borderRadius="2xl" borderLeft="4px solid" borderLeftColor="orange.400">
      <CardBody p={6}>
        <Box display={'flex'} alignItems={'center'} gap={{base: 2, sm: 0}} justifyContent="space-between" flexDir={{base: "column", sm: "row"}}>
          <HStack spacing={3}>
            <Box p={2} bg="orange.400" borderRadius="full" color="white">
              <FiHelpCircle size={20} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" color="gray.800">
                {t("Orderform.need_help.title", "Нужна помощь?")}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {t("Orderform.need_help.desc", "Наши специалисты готовы помочь вам")}
              </Text>
            </VStack>
          </HStack>
          <Button
            size="sm"
            colorScheme="orange"
            variant={showSupport ? "solid" : "outline"}
            onClick={() => setShowSupport(!showSupport)}
            leftIcon={showSupport ? <FiX /> : <FiHelpCircle />}
            transition="all 0.2s"
            _hover={{
                bg: showSupport? 'orange.400' : 'transparent',
            }}
          >
            {showSupport ? t("Orderform.need_help.close", "Закрыть") : t("Orderform.need_help.btn", "Связаться")}
          </Button>
        </Box>
        
        <Collapse in={showSupport} animateOpacity>
          <Box mt={6} p={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <VStack align="start" spacing={3}>
                <HStack>
                  <FiPhone color="#F56500" />
                  <Text fontWeight="medium">+998 90 123 45 67</Text>
                </HStack>
                <HStack>
                  <FiMail color="#F56500" />
                  <Text fontWeight="medium">support@tservice.uz</Text>
                </HStack>
              </VStack>
              <VStack align="start" spacing={3}>
                <HStack>
                  <FiClock color="#F56500" />
                  <Text fontSize="sm">{t("Orderform.need_help.service", "24/7 сервис")}</Text>
                </HStack>
                <HStack>
                  <FiStar color="#F56500" />
                  <Text fontSize="sm">{t("Orderform.need_help.fast_response", "Быстрый ответ")}</Text>
                </HStack>
              </VStack>
            </SimpleGrid>
          </Box>
        </Collapse>
      </CardBody>
    </Card>
  );
};