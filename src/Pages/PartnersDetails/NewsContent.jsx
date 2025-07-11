import { Badge, Box, Card, CardBody, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";



export const NewsContent = () => {
  const { t } = useTranslation();
  return (
  <Box>
    <Heading size="lg" mb={6} color="gray.800">{t("partsmarketplace.newscontent.title", "Новости компании")}</Heading>
    <VStack spacing={4}>
      <Card w="100%" borderRadius="2xl" border="1px" borderColor="gray.100">
        <CardBody p={6}>
          <HStack justify="space-between" mb={3}>
            <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
              {t("partsmarketplace.newscontent.new_elem", "Новинки")}
            </Badge>
            <Text fontSize="sm" color="gray.500">15 мая 2024</Text>
          </HStack>
          <Text fontWeight="bold" mb={3} fontSize="lg">Новые поступления запчастей John Deere</Text>
          <Text fontSize="sm" color="gray.600" lineHeight="tall">
            В наш ассортимент поступили новые оригинальные запчасти для техники John Deere. 
            Теперь доступны детали для моделей серии 6000 и 7000...
          </Text>
        </CardBody>
      </Card>
      <Card w="100%" borderRadius="2xl" border="1px" borderColor="gray.100">
        <CardBody p={6}>
          <HStack justify="space-between" mb={3}>
            <Badge colorScheme="green" px={3} py={1} borderRadius="full">
              {t("partsmarketplace.newscontent.development", "Развитие")}
            </Badge>
            <Text fontSize="sm" color="gray.500">28 апреля 2024</Text>
          </HStack>
          <Text fontWeight="bold" mb={3} fontSize="lg">Расширение складских площадей</Text>
          <Text fontSize="sm" color="gray.600" lineHeight="tall">
            Мы увеличили наши складские мощности на 40% для лучшего обслуживания клиентов 
            и более быстрой отгрузки товаров...
          </Text>
        </CardBody>
      </Card>
    </VStack>
  </Box>
)};