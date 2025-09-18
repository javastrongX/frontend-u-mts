import React from "react";
import { Heading, Icon, Text } from "@chakra-ui/react";
import { FaChevronLeft } from "react-icons/fa";

const RegisterHeader = ({ onBackClick, t }) => {
  return (
    <Heading
      onClick={onBackClick}
      cursor="pointer"
      _hover={{ color: "orange.500" }}
      as="h2"
      size="md"
      mb={8}
      display="flex"
      alignItems="center"
      gap={2}
      transition="color 0.2s"
    >
      <Icon as={FaChevronLeft} />
      <Text>{t("auth_register.register", "Регистрация")}</Text>
    </Heading>
  );
};

export default RegisterHeader;
