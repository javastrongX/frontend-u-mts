import { Box, Button, Container, Flex, Heading, Image, Text } from "@chakra-ui/react"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Statistics_business = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Flex
      align="center"
      justify="space-between"
      py={{ base: 10, md: 20 }}
      maxW="100%"
      bg="orange.250"
    >
        <Container display={'flex'} flexDir={{base: "column-reverse", custom900: "row-reverse"}} maxW={"75rem"} gap={20} alignItems="center" justifyContent="space-between">
            {/* o'ng tomondagi matn */}
            <Box maxW={{base: "100%", custom900: "50%"}} mb={{ base: 4, md: 0 }}>
                <Heading as={'h1'} fontSize={{base: '20px', custom900: "30px"}} fontWeight={'600'}  mb={6} textAlign={{base: "center", custom900: "left"}}>
                    {t("business.stats_txt", "Аудитория Uzmat.uz 50 000 пользователей, заинтересованных в покупке, продаже, аренде техники, запчастях и услугах.")}
                </Heading>
                <Button
                w={{base: "100%", custom900: "auto"}}
                size={{base: "md", custom900: "lg"}}
                bg="black.0"
                color="p.black"
                rounded="md"
                onClick={() => navigate('/auth/registration-performer')}
                _active={{
                transform: "translateY(1px)",
                boxShadow: "lg",
                bg: "orange.150",
            }}
                >
                {t("business.all_btn", "Начать продавать")}
                </Button>
            </Box>

            {/* chap tomondagi rasm */}
            <Box flex="1" textAlign="center" maxW={{base: "100%", custom900: "50%"}}>
                <Image
                src={"/Images/business-page2.png"}
                alt="Statistics of UZMAT.uz"
                maxW="100%"
                />
            </Box>
        </Container>
    </Flex>
  )
}

export default Statistics_business