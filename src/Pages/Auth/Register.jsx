import React from "react";
import {
  Box,
  VStack,
  Flex,
} from "@chakra-ui/react";
import SideTranslator from "../SideTranslator";
import TelegramLoginCard from "./TelegramLoginCard";
import CountrySelect from "./registerComponent/CountrySelect";
import ContactInput from "./registerComponent/ContactInput";
import RegisterHeader from "./registerComponent/RegisterHeader";
import LoginLink from "./registerComponent/LoginLink";
import SubmitButton from "./registerComponent/SubmitButton";
import { useRegistration } from "./hooks/useRegistration";

const Register = () => {
  const {
    country,
    emailOrPhone,
    errors,
    isLoading,
    isUzbekistan,
    t,
    handleCountryChange,
    handleContactChange,
    handleSubmit,
    handleBackClick,
    handleLoginClick,
  } = useRegistration();

  return (
    <>
      <SideTranslator />
      <Flex 
        minH="100vh" 
        align="center" 
        justify="center" 
        bg="gray.50" 
        px={4}
        flexDir={'column'}
        gap={4}
      >
        <TelegramLoginCard />
        <Box
          w="100%"
          maxW={{ base: "400px", md: "500px", lg: "600px" }}
          mx="auto"
          p={{ base: 6, md: 8, lg: 10 }}
          borderRadius="xl"
          boxShadow="lg"
          bg="white"
          border="1px solid"
          borderColor="gray.100"
          _hover={{ borderColor: "gray.200" }}
          transition="border-color 0.2s"
        >
          <RegisterHeader 
            onBackClick={handleBackClick} 
            t={t} 
          />

          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <CountrySelect
                value={country}
                onChange={handleCountryChange}
                error={errors.country}
                t={t}
                isRequired
              />

              <ContactInput
                value={emailOrPhone}
                onChange={handleContactChange}
                error={errors.emailOrPhone}
                isUzbekistan={isUzbekistan}
                t={t}
                isRequired
              />

              <LoginLink 
                onLoginClick={handleLoginClick} 
                t={t} 
              />

              <SubmitButton 
                isLoading={isLoading} 
                t={t} 
              />
            </VStack>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default Register;