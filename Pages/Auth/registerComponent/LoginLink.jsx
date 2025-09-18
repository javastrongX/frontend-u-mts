import React from "react";
import { Text, Link } from "@chakra-ui/react";

const LoginLink = ({ onLoginClick, t }) => {
  return (
    <Text fontSize="sm" textAlign="center" color="gray.600">
      {t("auth_register.already_login", "Уже зарегистрированы?")}{" "}
      <Link
        color="#9a8700"
        fontWeight="600"
        onClick={onLoginClick}
        _hover={{ 
          textDecoration: "underline", 
          color: "#b89e00" 
        }}
        transition="color 0.2s"
      >
        {t("auth_register.login", "Авторизуйтесь")}
      </Link>
    </Text>
  );
};

export default LoginLink;