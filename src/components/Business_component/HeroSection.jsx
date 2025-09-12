import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <Flex
      direction="row"
      align="center"
      justify="space-between"
      pt={{ base: 6, md: 10 }}
      pb={{ base: 6, md: 20 }}
      
      bg="black.0"
    >
      {/* Chap tomondagi matn */}
      <Box maxW={{base: "100%", custom900: "50%"}} display={{base: 'flex', custom900: "block"}} flexDir={'column'} mb={{ base: 4, md: 0 }}>
        <Heading as="h1" textAlign={{base: 'center', custom900: 'left'}} fontSize={{base: "24px", custom900: "48px"}} mb={6} lineHeight="short">
          {t("business.title", "Продавайте\nспецтехнику и\nзапчасти без усилий!").split("\n").map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </Heading>
        <Text fontSize="lg" mb={6}>
          {t("business.title_txt", "Мы предлагаем уникальную платформу, которая помогает дилерам спецтехники эффективно управлять своими продажами, расширять клиентскую базу и увеличивать прибыль.")}
        </Text>
        <Button
          size="lg"
          onClick={() => navigate('/auth/registration-performer')}
          bg="orange.50"
          _hover={{ bg: "orange.150" }}
          color="p.black"
          rounded="md"
          _active={{
            transform: "translateY(1px)",
            boxShadow: "lg",
            bg: "orange.150",
          }}
        >
          {t("business.all_btn", "Начать продавать")}
        </Button>
      </Box>

      {/* O‘ng tomondagi rasm */}
      <Box flex="1" textAlign="center" maxW={"50%"} display={{ base: "none", custom900: "flex" }}>
        <Image
          src={"/Images/business-page1.png"}
          alt="Banner"
          maxW="100%"
        />
      </Box>
    </Flex>
  );
}
