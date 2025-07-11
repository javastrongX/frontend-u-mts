import { Text, Button, VStack, Image, Flex, Container } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import BottomNav from "../components/Navigations/BottomNav";
import { useTranslation } from "react-i18next";
import TopNav from "../components/Navigations/TopNav";

const NotFound = () => {
  const { t } = useTranslation();
  console.log(window.location.pathname);
  return (
    <Container
      minH={{base: "80vh", custom900: "100vh"}}
      maxW="75rem"
      display="flex"
      flexDir="column"
      px={4}
      overflow="hidden"
    >
      <TopNav title={t("avatar.brand")} subTitle={t("avatar.brand_subtitle")} />

      <Flex
        mt={{base: 0, sm: 10}}
        flex="1"
        align="center"
        justify="center"
        px={{ base: 2, md: 6 }}
        py={{ base: 6, md: 10 }}
      >
        <VStack spacing={6} maxW="600px" w="full" textAlign="center">
          <Image
            src="/not_found.gif"
            alt="Under Construction"
            maxW={{ base: "250px", md: "400px" }}
            objectFit="contain"
            loading="lazy"
          />

          <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold" color="gray.800">
            {t("not_found.404_notF")}
          </Text>

          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
            {t("not_found.apology")}
          </Text>

          <Button
            as={Link}
            to="/"
            size="lg"
            px={8}
            bg="orange.50"
            fontWeight="semibold"
            _hover={{ bg: "orange.100" }}
            boxShadow="md"
            borderRadius="md"
          >
            {t("not_found.home_btn")}
          </Button>
        </VStack>
      </Flex>

      <BottomNav />
    </Container>
  );
};

export default NotFound;
