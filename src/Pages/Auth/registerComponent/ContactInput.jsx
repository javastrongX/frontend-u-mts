import React from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Box,
  Text,
} from "@chakra-ui/react";

const ContactInput = ({ 
  value, 
  onChange, 
  error, 
  isUzbekistan, 
  t, 
  isRequired = false 
}) => {
  const getInputPlaceholder = () => {
    return isUzbekistan ? "901234567" : "example@mail.com";
  };

  const getInputLabel = () => {
    return isUzbekistan 
      ? t("auth_register.phone", "Номер телефона")
      : "Email";
  };

  const handleChange = (e) => {
    let inputValue = e.target.value;
    
    // For Uzbekistan, allow only digits and limit to 9 characters
    if (isUzbekistan) {
      inputValue = inputValue.replace(/\D/g, '').slice(0, 9);
    }
    
    onChange(inputValue);
  };

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <FormLabel fontSize="sm" fontWeight="semibold">
        {getInputLabel()}
      </FormLabel>
      {isUzbekistan ? (
        <Box position="relative">
          <Text
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            color="gray.600"
            fontSize="lg"
            fontWeight="medium"
            zIndex={1}
            pointerEvents="none"
          >
            +998
          </Text>
          <Input
            placeholder={getInputPlaceholder()}
            type="tel"
            value={value}
            onChange={handleChange}
            borderColor={error ? "red.300" : "gray.300"}
            _hover={{ borderColor: "gray.400" }}
            _focus={{ 
              borderColor: "orange.500", 
              boxShadow: "0 0 0 1px #fed500",
              _hover: { borderColor: "orange.500" }
            }}
            size="lg"
            pl="60px"
            autoComplete="tel"
            inputMode="numeric"
          />
        </Box>
      ) : (
        <Input
          placeholder={getInputPlaceholder()}
          type="email"
          value={value}
          onChange={handleChange}
          borderColor={error ? "red.300" : "gray.300"}
          _hover={{ borderColor: "gray.400" }}
          _focus={{ 
            borderColor: "orange.500", 
            boxShadow: "0 0 0 1px #fed500",
            _hover: { borderColor: "orange.500" }
          }}
          size="lg"
          autoComplete="email"
        />
      )}
      <FormErrorMessage fontSize="sm">
        {error}
      </FormErrorMessage>
    </FormControl>
  );
};

export default ContactInput;

