import React, { useState, useRef, useMemo } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Icon,
  Text,
  Input,
  List,
  ListItem,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { COUNTRIES } from "../constants/countries";

const CountrySelect = ({ 
  value, 
  onChange, 
  error, 
  t, 
  isRequired = false 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selectRef = useRef();

  useOutsideClick({
    ref: selectRef,
    handler: onClose,
  });

  const filteredCountries = useMemo(() => 
    COUNTRIES.filter(country =>
      country.label.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  );

  const selectedCountry = COUNTRIES.find(c => c.value === value);

  const handleCountrySelect = (selectedValue) => {
    onChange(selectedValue);
    setSearchTerm("");
    onClose();
  };

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <FormLabel fontSize="sm" fontWeight="semibold">
        {t("auth_register.country", "Страна")}
      </FormLabel>
      <Box position="relative" ref={selectRef}>
        <Box
          display="flex"
          alignItems="center"
          border="1px solid"
          borderColor={error ? "red.300" : "gray.300"}
          borderRadius="md"
          px={3}
          py={3}
          cursor="pointer"
          onClick={isOpen ? onClose : onOpen}
          _hover={{ borderColor: "gray.400" }}
          _focus={{ 
            borderColor: "orange.500", 
            boxShadow: "0 0 0 1px #fed500" 
          }}
          minH="48px"
          size="lg"
          transition="border-color 0.2s"
        >
          <Box flex={1} color={selectedCountry ? "black" : "gray.500"}>
            {selectedCountry ? (
              <Box display="flex" alignItems="center" gap={2}>
                <Text fontSize="lg" as="span">{selectedCountry.flag}</Text>
                <Text as="span">{selectedCountry.label}</Text>
              </Box>
            ) : (
              <Text as="span">{t("auth_register.select_country", "Выберите страну")}</Text>
            )}
          </Box>
          <Icon as={FaChevronDown} color="gray.400" />
        </Box>
        
        <FormErrorMessage fontSize="sm">
          {error}
        </FormErrorMessage>

        {isOpen && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="lg"
            zIndex={1000}
            maxH="250px"
            overflow="hidden"
            mt={1}
          >
            <Box p={2} borderBottom="1px solid" borderColor="gray.100">
              <Box position="relative">
                <Icon
                  as={FaSearch}
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                  fontSize="sm"
                />
                <Input
                  placeholder={t("auth_register.input_placeleholder", "Поиск страны..")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  pl={8}
                  size="sm"
                  border="1px solid"
                  borderColor="gray.200"
                  _focus={{ borderColor: "orange.500" }}
                  autoComplete="off"
                />
              </Box>
            </Box>
            <List maxH="180px" overflowY="auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((countryOption) => (
                  <ListItem
                    key={countryOption.value}
                    px={3}
                    py={2}
                    cursor="pointer"
                    _hover={{ bg: value === countryOption.value ? "#f8dd54" : "orange.100" }}
                    bg={value === countryOption.value ? "orange.50" : "transparent"}
                    color={value === countryOption.value ? "orange.600" : "black"}
                    fontWeight={value === countryOption.value ? "500" : "normal"}
                    onClick={() => handleCountrySelect(countryOption.value)}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Text fontSize="lg" as="span">{countryOption.flag}</Text>
                    <Text as="span">{countryOption.label}</Text>
                  </ListItem>
                ))
              ) : (
                <ListItem px={3} py={4} color="gray.500" textAlign="center">
                  {t("auth_register.country_notFound", "Страна не найдена")}
                </ListItem>
              )}
            </List>
          </Box>
        )}
      </Box>
    </FormControl>
  );
};

export default CountrySelect;