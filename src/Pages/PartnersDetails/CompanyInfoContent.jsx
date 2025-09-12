import { Badge, Box, Card, CardBody, Divider, Heading, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram, FaLinkedin, FaTelegram, FaTwitter, FaWhatsapp } from "react-icons/fa";


export const CompanyInfoContent = () => {
  const { t } = useTranslation();

  // Companiyaning kontactidan keladigan malumotlar --- MOCK

  const PHONE_Nums = [
    {
      number: '+7 707 123 45 67'
    },
    {
      number: '+7 707 123 45 68'
    },
  ]

  const SOCIALS = [
    {
      name: 'Instagram',
      link: 'https://www.instagram.com/magservice.kz/',
      icon: FaInstagram
    },
    {
      name: 'Telegram',
      link: 'https://t.me/magservicekz',
      icon: FaTelegram
    },
    {
      name: 'WhatsApp',
      link: 'https://wa.me/77071234567',
      icon: FaWhatsapp
    },
    {
      name: 'Facebook',
      link: 'https://www.facebook.com/magservice.kz/',
      icon: FaFacebook
    },
    {
      name: 'Twitter',
      link: 'https://twitter.com/magservicekz',
      icon: FaTwitter
    },
    {
      name: 'LinkedIn',
      link: 'https://www.linkedin.com/company/magservicekz/',
      icon: FaLinkedin
    }
  ]
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
                <Text fontWeight="bold" color="gray.700" mb={2}>{t("partsmarketplace.company_info.delivery_geograph", "География поставок")}</Text>
                <Text>Казахстан, страны СНГ</Text>
              </Box>
            </VStack>
            <VStack align="start" spacing={6}>
              <Box>
                <Text fontWeight="bold" color="gray.700" mb={2}>{t("partsmarketplace.company_info.status", "Статус")}</Text>
                <HStack>
                  <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                    Проверенный поставщик
                  </Badge>
                </HStack>
              </Box>

              <Box>
                <Text fontWeight="bold" color="gray.700" mb={2}>KONTACT</Text>
                <HStack flexWrap={'wrap'}>
                  {SOCIALS.map((item) => (
                    <Badge 
                      cursor={'pointer'} 
                      _hover={{ textDecor: "underline" }} 
                      key={item.name} 
                      colorScheme="green" 
                      as={"a"} 
                      href={item.link || "#"} 
                      px={3} 
                      py={1} 
                      borderRadius="full"
                      target="_blank"
                    >
                      {item.name}
                    </Badge>
                  ))}
                </HStack>
              </Box>
              <Box>
                <HStack>
                  {PHONE_Nums.map((item) => (
                    <Badge 
                      cursor={'pointer'} 
                      _hover={{ textDecor: "underline" }} 
                      key={item.number} 
                      colorScheme="blue" 
                      as={"a"} 
                      href={`tel:${item.number}`} 
                      px={3} 
                      py={1} 
                      borderRadius="full"
                      target="_blank"
                    >
                      {item.number}
                    </Badge>
                  ))}
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

    </VStack>
  </Box>
)};