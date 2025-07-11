import { Badge, Box, Card, CardBody, Divider, Heading, HStack, SimpleGrid, Stat, StatLabel, StatNumber, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";


export const CompanyInfoContent = () => {
  const { t } = useTranslation();
  return (
  <Box>
    <Heading size="lg" mb={6} color="gray.800">{t("partsmarketplace.about_company", "О компании")}</Heading>
    <VStack spacing={6} align="stretch">
      <Card borderRadius="2xl" border="1px" borderColor="gray.100">
        <CardBody p={8}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            <VStack align="start" spacing={6}>
              <Box>
                <Text fontWeight="bold" color="gray.700" mb={2}>{t("partsmarketplace.company_info.name", "Название компании")}</Text>
                <Text fontSize="lg">TOO MAGSERVICE PARTS</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" color="gray.700" mb={2}>{t("partners.specilization", "Специализация")}</Text>
                <Text>Поставка двигателей и запчастей для спецтехники</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" color="gray.700" mb={2}>{t("partsmarketplace.company_info.exp_inWork", "Опыт работы")}</Text>
                <Text>{t("partsmarketplace.company_info.market", "Более")} 10 {t("partsmarketplace.company_info.years_inMarket", "лет на рынке")}</Text> {/* opt o'zgaradi */}
              </Box>
            </VStack>
            <VStack align="start" spacing={6}>
              <Box>
                <Text fontWeight="bold" color="gray.700" mb={2}>{t("partsmarketplace.company_info.delivery_geograph", "География поставок")}</Text>
                <Text>Казахстан, страны СНГ</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" color="gray.700" mb={2}>{t("partsmarketplace.company_info.status", "Статус")}</Text>
                <HStack>
                  <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                    Проверенный поставщик
                  </Badge>
                </HStack>
              </Box>
            </VStack>
          </SimpleGrid>
          
          <Divider my={6} />
          
          <Box>
            <Text fontWeight="bold" color="gray.700" mb={3}>{t("partsmarketplace.company_info.inform", "Описание")}</Text>
            <Text color="gray.600" lineHeight="tall">
              Мы специализируемся на поставке качественных двигателей и запчастей для строительной и сельскохозяйственной техники. 
              Работаем с ведущими производителями и гарантируем качество всех поставляемых товаров. Наша команда профессионалов 
              обеспечивает быстрые поставки и техническую поддержку.
            </Text>
          </Box>
        </CardBody>
      </Card>

      {/* Company stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        <Card borderRadius="xl" border="1px" borderColor="gray.100">
          <CardBody textAlign="center" p={6}>
            <Stat>
              <StatNumber color="blue.400" fontSize="2xl">10+</StatNumber>
              <StatLabel color="gray.600" fontSize="sm">{t("partsmarketplace.company_info.exp_years", "лет опыта")}</StatLabel>
            </Stat>
          </CardBody>
        </Card>
        <Card borderRadius="xl" border="1px" borderColor="gray.100">
          <CardBody textAlign="center" p={6}>
            <Stat>
              <StatNumber color="blue.400" fontSize="2xl">1000+</StatNumber>
              <StatLabel color="gray.600" fontSize="sm">{t("partsmarketplace.company_info.products", "товаров")}</StatLabel>
            </Stat>
          </CardBody>
        </Card>
        <Card borderRadius="xl" border="1px" borderColor="gray.100">
          <CardBody textAlign="center" p={6}>
            <Stat>
              <StatNumber color="blue.400" fontSize="2xl">500+</StatNumber>
              <StatLabel color="gray.600" fontSize="sm">{t("partsmarketplace.company_info.clients", "клиентов")}</StatLabel>
            </Stat>
          </CardBody>
        </Card>
        <Card borderRadius="xl" border="1px" borderColor="gray.100">
          <CardBody textAlign="center" p={6}>
            <Stat>
              <StatNumber color="blue.400" fontSize="2xl">99%</StatNumber>
              <StatLabel color="gray.600" fontSize="sm">{t("partsmarketplace.company_info.happiness", "довольных")}</StatLabel>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  </Box>
)};