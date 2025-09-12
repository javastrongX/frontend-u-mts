import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  List,
  ListItem,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { FiMapPin } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { fetchPageSupport } from "../../../SupportBot";

// LocationSearchInput Component
const LocationSearchInput = ({
  value,
  onChange,
  placeholder,
  size,
  inputProps,
  i18n,
  error,
  ...otherProps
}) => {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef();
  const suggestionsRef = useRef();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Google Maps Places API dan ma'lumot olish
  const fetchPlaceSuggestions = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const selected_Lang = i18n?.language || 'uz';
      const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(searchQuery)}&language=${selected_Lang}`);
      const data = await response.json();
      setSuggestions(data.predictions || []);
    } catch (error) {
      console.error("Error fetching place suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPlaceSuggestions(query);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query, i18n?.language]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (suggestion) => {
    setQuery(suggestion.description);
    onChange(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <Box position="relative" ref={suggestionsRef} {...otherProps}>
      <InputGroup>
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          size={size}
          bg="gray.50"
          border="1px solid"
          borderColor={error ? "red.300" : "gray.200"}
          borderRadius="8px"
          h="48px"
          fontSize="16px"
          _hover={{ borderColor: error ? "red.400" : "gray.300" }}
          _focus={{ 
            borderColor: error ? "red.500" : "blue.400", 
            bg: "white",
            boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)"
          }}
          transition="all 0.2s"
          {...inputProps}
        />
        {isLoading && (
          <InputRightElement>
            <Spinner size="sm" color="gray.400" />
          </InputRightElement>
        )}
      </InputGroup>

      {showSuggestions && suggestions.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={1000}
          bg="white"
          border="1px solid"
          borderColor="blue.200"
          borderRadius="8px"
          boxShadow="0 8px 25px rgba(0,0,0,0.15)"
          maxH="200px"
          overflowY="auto"
          mt={1}
        >
          <List spacing={0}>
            {suggestions.map((suggestion) => (
              <ListItem
                key={suggestion.place_id}
                px={4}
                py={3}
                cursor="pointer"
                _hover={{ bg: "blue.50" }}
                _first={{ borderTopRadius: "8px" }}
                _last={{ borderBottomRadius: "8px" }}
                onClick={() => handleSuggestionSelect(suggestion)}
                borderBottom="1px solid"
                borderBottomColor="gray.100"
              >
                <HStack spacing={3}>
                  <FiMapPin color="#718096" size={14} />
                  <Text fontSize="sm" color="gray.700">
                    {suggestion.description}
                  </Text>
                </HStack>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};


const ContactSection = () => {
  // Form holati
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, i18n } = useTranslation();

  const handleInputChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleAddressChange = (value) => {
    setForm((prev) => ({
      ...prev,
      address: value,
    }));
    // Clear error when user starts typing
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validatsiya
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = t("contact_form.name_required", "Имя обязательно");
    if (!form.phone.trim()) newErrors.phone = t("contact_form.phone_required", "Номер телефона обязателен");
    if (!form.address.trim()) newErrors.address = t("contact_form.address_required", "Адрес обязателен");
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // API ga yuborish
        await fetchPageSupport(form);
        alert(t("contact_form.request_sent", "Ваш запрос отправлен!"));
        
        // Formani tozalash
        setForm({ name: "", phone: "", address: "" });
      } catch (error) {
        alert(t("contact_form.request_error", "Ошибка отправки. Попробуйте еще раз."));
        console.error("Form yuborishda xatolik:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Box bg="orange.250" py={{ base: 8, custom900: 16 }} px={6}>
      <Flex
        maxW="75rem"
        mx="auto"
        align="center"
        justify="space-between"
        direction={{ base: "column", custom900: "row" }}
        gap={8}
      >
        {/* Chap blok */}
        <Box flex="1" ml={3} minW="260px">
          <Text fontWeight="bold" fontSize={{base: '24px', custom900: '40px'}} textAlign={{base: "center", custom900: "left"}} mb={4}>
            {t('contact_form.title')}
          </Text>
          <Text fontSize={{base: '14px', custom900: '16px'}} textAlign={{base: "center", custom900: "left"}} mb={2}>
            {t("contact_form.about_us_1")}
          </Text>
          <Text fontSize={{base: '14px', custom900: '16px'}} textAlign={{base: "center", custom900: "left"}} mb={4}>
            {t("contact_form.about_us_2")}
          </Text>
          <Box display="flex" justifyContent={{base: "space-between", md: 'center', custom900: "flex-start"}} flexDirection={{base: "row", custom900: "column"}} gap={2}>
            <Box
              as="a"
              href="tel:+998200059890"
              bg="black.90"
              maxW="170px"
              textAlign={"center"}
              p={"4px"}
              borderRadius="md"
              border="1px solid #ccc"
              _hover={{ bg: "gray.100" }}
              cursor="pointer"
              fontSize={{base: '14px', custom900: '16px'}}
            >
              +998 (20) 005-9890
            </Box>

            <Box
              as="a"
              href="mailto:info@uzmat.uz"
              bg="black.90"
              maxW="150px"
              textAlign={"center"}
              p={"4px"}
              borderRadius="md"
              border="1px solid #ccc"
              _hover={{ bg: "gray.100" }}
              cursor="pointer"
              fontSize={{base: '14px', custom900: '16px'}}
            >
              info@uzmat.uz
            </Box>
          </Box>
          <Text mt={2} textAlign={{base: "center", custom900: "left"}} fontWeight={{base: "bold", custom900: "medium"}}>
            {t("contact_form.adress")}
          </Text>
        </Box>

        {/* O'ng blok (forma) */}
        <Box
          bg="black.0"
          borderRadius="xl"
          p={8}
          boxShadow="md"
          maxW={{base: "400px", sm: "500px", md: "600px", custom900: "500px"}}
          w="100%"
        >
          <form onSubmit={handleSubmit}>
            <FormControl mb={4} isInvalid={!!errors.name} isRequired>
              <FormLabel>{t('contact_form.name')}</FormLabel>
              <Input
                placeholder={t('contact_form.write_name')}
                name="name"
                value={form.name}
                onChange={handleInputChange}
                bg="gray.50"
                h="48px"
              />
              {errors.name && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.name}
                </Text>
              )}
            </FormControl>

            <FormControl mb={4} isInvalid={!!errors.phone} isRequired>
              <FormLabel>{t("contact_form.number_label")}</FormLabel>
              <InputGroup display={'flex'} alignItems={'center'}>
                <InputLeftAddon children="+998" h="48px" />
                <Input
                  type="tel"
                  name="phone"
                  placeholder="901234567"
                  value={form.phone}
                  onChange={handleInputChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  bg="gray.50"
                  maxLength={9}
                  onKeyDown={(e) => {
                    const allowed = /^[0-9]$/;
                    if (!allowed.test(e.key) && e.key !== "Backspace" && e.key !== "Tab" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                      e.preventDefault();
                    }
                  }}
                  h="48px"
                  fontSize="md"
                />
              </InputGroup>
              {errors.phone && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.phone}
                </Text>
              )}
            </FormControl>

            {/* Address field with LocationSearchInput */}
            <FormControl mb={6} isInvalid={!!errors.address} isRequired>
              <FormLabel>{t("contact_form.address", "Адрес")}</FormLabel>
              <LocationSearchInput
                value={form.address}
                onChange={handleAddressChange}
                placeholder={t("contact_form.address_placeholder", "Введите ваш адрес")}
                i18n={i18n}
                error={!!errors.address}
              />
              {errors.address && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.address}
                </Text>
              )}
            </FormControl>

            <Button
              type="submit"
              bg="orange.50"
              color="p.black"
              w="100%"
              fontWeight="bold"
              fontSize="md"
              h="48px"
              isLoading={isSubmitting}
              loadingText={t("contact_form.sending", "Отправляем...")}
              _hover={{ border: "1px solid", borderColor: "yellow.50" }}
              _active={{
                transform: "translateY(1px)",
                boxShadow: "lg",
                bg: "orange.150",
              }}
              _disabled={{
                opacity: 0.6,
                cursor: "not-allowed"
              }}
            >
              {t("contact_form.request_btn")}
            </Button>
          </form>
        </Box>
      </Flex>
    </Box>
  );
};

export default ContactSection;