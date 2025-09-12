import { Box, Text, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const PromoBlock = () => {
  const { t } = useTranslation();
  return (
  <Box
    p={6}
    bgGradient="linear(to-br, blue.400, teal.400)"
    color="white"
    borderRadius="xl"
    w={{ base: '100%', lg: '300px' }} 
    shadow="lg"
    display={{ base: "none", md: "block" }}
    as="a"
    href="#"
  >
    <Heading size="md" mb={2}>{t("promo_block.title", "Реклама")}</Heading>
    <Text fontSize="sm">
      {t("promo_block.desc", "Ваша реклама может быть здесь!")}
    </Text>
  </Box>
)};

export default PromoBlock;
