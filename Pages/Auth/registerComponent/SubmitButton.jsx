import React from "react";
import { Button } from "@chakra-ui/react";

const SubmitButton = ({ isLoading, t }) => {
  return (
    <Button
      type="submit"
      bg="#fed500"
      color="gray.900"
      w="100%"
      size="lg"
      fontWeight="600"
      _hover={{ bg: "#f5cd00" }}
      _active={{ bg: "#e6bf00" }}
      isLoading={isLoading}
      loadingText={t("auth_register.registering", "Проверяется...")}
      transition="background-color 0.2s"
      boxShadow="0 2px 8px rgba(254, 213, 0, 0.15)"
      _focus={{ boxShadow: "0 0 0 3px rgba(254, 213, 0, 0.2)" }}
    >
      {t("auth_register.continue", "Подтвердить")}
    </Button>
  );
};

export default SubmitButton;
