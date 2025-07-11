import { Box, Card, CardBody, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiAward, FiShield, FiTrendingUp } from "react-icons/fi";





export const DocumentsContent = () => { 
  const { t } = useTranslation();

  return (
  <Box>
    <Heading size="lg" mb={6} color="gray.800">{t("footer.document", "Документы")}</Heading>
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
      <Card borderRadius="2xl" border="1px" borderColor="gray.100" _hover={{ borderColor: 'blue.200' }} cursor="pointer">
        <CardBody p={6} textAlign="center">
          <Box w={12} h={12} bg="blue.50" borderRadius="xl" mx="auto" mb={4} display="flex" alignItems="center" justifyContent="center">
            <FiShield size="24" color="#4299e1" />
          </Box>
          <Text fontWeight="semibold" mb={2}>{t("partsmarketplace.documentscontent.quality_cert", "Сертификат качества")}</Text>
          <Text fontSize="sm" color="gray.600">ISO 9001:2015</Text>
        </CardBody>
      </Card>
      
      <Card borderRadius="2xl" border="1px" borderColor="gray.100" _hover={{ borderColor: 'blue.200' }} cursor="pointer">
        <CardBody p={6} textAlign="center">
          <Box w={12} h={12} bg="green.50" borderRadius="xl" mx="auto" mb={4} display="flex" alignItems="center" justifyContent="center">
            <FiAward size="24" color="#48BB78" />
          </Box>
          <Text fontWeight="semibold" mb={2}>{t("partsmarketplace.documentscontent.licence_cert", "Лицензия")}</Text>
          <Text fontSize="sm" color="gray.600">{t("partsmarketplace.documentscontent.licence_desc", "Торговая деятельность")}</Text>
        </CardBody>
      </Card>
      
      <Card borderRadius="2xl" border="1px" borderColor="gray.100" _hover={{ borderColor: 'blue.200' }} cursor="pointer">
        <CardBody p={6} textAlign="center">
          <Box w={12} h={12} bg="yellow.50" borderRadius="xl" mx="auto" mb={4} display="flex" alignItems="center" justifyContent="center">
            <FiTrendingUp size="24" color="#F6AD55" />
          </Box>
          <Text fontWeight="semibold" mb={2}>{t("partsmarketplace.documentscontent.katalog", "Каталог")}</Text>
          <Text fontSize="sm" color="gray.600">{t("partsmarketplace.documentscontent.manufactor", "Продукция")} 2025</Text>
        </CardBody>
      </Card>
    </SimpleGrid>
  </Box>
)};