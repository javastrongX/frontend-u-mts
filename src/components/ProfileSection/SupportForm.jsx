import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  VStack,
  HStack,
  useToast,
  Container,
  List,
  ListItem,
  Spinner,
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

const SupportForm = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const { t, i18n } = useTranslation();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 9);
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAddressChange = (value) => {
    setForm((prev) => ({
      ...prev,
      address: value,
    }));

    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: null }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = t('SupportForm.form.nameRequired', 'Имя обязательно');
    if (!form.phone.trim()) newErrors.phone = t('SupportForm.form.phoneRequired', 'Номер телефона обязателен');
    if (!form.address.trim()) newErrors.address = t('SupportForm.form.addressRequired', 'Адрес обязателен');
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        // API ga yuborish
        await fetchPageSupport(form);
        
        toast({
          title: t('SupportForm.form.applicationSent', 'Заявка отправлена!'),
          description: t('SupportForm.form.weWillContact', 'Мы свяжемся с вами в ближайшее время.'),
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        
        setForm({ name: "", phone: "", address: "" });
      } catch (error) {
        toast({
          title: t('SupportForm.form.error', 'Ошибка'),
          description: t('SupportForm.form.errorMessage', 'Произошла ошибка при отправке заявки. Попробуйте еще раз.'),
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Box minH="80vh" bg="gray.50" py={{base: "100px", md: "60px"}}>
      <Container p={4} maxW="100%">
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={12}
          align={{base: 'center', lg: "flex-start"}}
          justifyContent={'space-between'}
        >
          {/* Left Section */}
          <Box flex="1" w={{base: "100%", lg: "50%"}}>
            <VStack spacing={6} align={{base: "center", md: "start"}}>
              <Text
                fontSize={{ base: "28px", md: "38px", lg: "48px" }}
                fontWeight="bold"
                lineHeight="1.2"
                color="gray.900"
              >
                {t('SupportForm.form.helpChoose', 'Поможем в выборе!')}
              </Text>
              
              <VStack spacing={4} align={"start"} color="gray.600" fontSize="16px" lineHeight="1.6">
                <Text textAlign={{base: 'center', md: "left"}}>
                  {t('SupportForm.form.helpText', 'Если у вас остались вопросы или вы не знаете, что выбрать, обратитесь в наш отдел продаж или оставьте заявку.')}
                </Text>
                <Text textAlign={{base: 'center', md: "left"}}>
                  {t('SupportForm.form.supportNote', 'По вопросам объявлений и личного кабинета просим обращаться в службу заботы о пользователях.')}
                </Text>
              </VStack>

              <Box display={'flex'} gap={3} align={"center"} justifyContent={{base: 'center', md: "left"}} w={"100%"} fontSize="16px" color="gray.700" flexWrap="wrap">
                <Text fontWeight="medium" as={"a"} href="tel:+998200059890" p={2} bg={"orange.100"} borderRadius={'lg'}>+998 (20) 005 9890</Text>
                <Text as={"a"} href="mailto:info@umts.uz" p={2} bg={"orange.100"} borderRadius={'lg'}>info@uzmat.uz</Text>
              </Box>
              <Text color="gray.600">Andijon sh. Shahrixon</Text>
            </VStack>
          </Box>

          {/* Form Section */}
          <Box
            bg="white"
            borderRadius="16px"
            p={8}
            boxShadow="0 4px 20px rgba(0,0,0,0.08)"
            w={{base: "100%", lg: "50%"}}
            border="1px solid"
            borderColor="gray.100"
          >
            <VStack spacing={6} as="form" onSubmit={handleSubmit}>
              {/* Name Input */}
              <FormControl isRequired>
                <FormLabel fontSize="14px" fontWeight="500" color="gray.700" mb={2}>
                  {t('SupportForm.form.name', 'Имя')}
                </FormLabel>
                <Input
                  placeholder={t('SupportForm.form.namePlaceholder', 'Введите ваше имя')}
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  bg="gray.50"
                  border="1px solid"
                  borderColor={errors.name ? "red.300" : "gray.200"}
                  borderRadius="8px"
                  h="48px"
                  fontSize="16px"
                  _hover={{ borderColor: errors.name ? "red.400" : "gray.300" }}
                  _focus={{ 
                    borderColor: errors.name ? "red.500" : "blue.400", 
                    bg: "white",
                    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)"
                  }}
                  transition="all 0.2s"
                />
                {errors.name && (
                  <Text color="red.500" fontSize="12px" mt={1}>
                    {errors.name}
                  </Text>
                )}
              </FormControl>

              {/* Phone Input */}
              <FormControl isRequired>
                <FormLabel fontSize="14px" fontWeight="500" color="gray.700" mb={2}>
                  {t('SupportForm.form.phone', 'Номер телефона')}
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon
                    bg="gray.100"
                    border="1px solid"
                    borderColor={errors.phone ? "red.300" : "gray.200"}
                    borderRadius="8px 0 0 8px"
                    h="48px"
                    children="+998"
                    fontSize="16px"
                    color="gray.700"
                    pointerEvents={"none"}
                  />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="90 123 45 67"
                    value={form.phone}
                    onChange={handleInputChange}
                    bg="gray.50"
                    border="1px solid"
                    borderColor={errors.phone ? "red.300" : "gray.200"}
                    borderRadius="0 8px 8px 0"
                    borderLeft="none"
                    h="48px"
                    fontSize="16px"
                    _hover={{ borderColor: errors.phone ? "red.400" : "gray.300" }}
                    _focus={{ 
                      borderColor: errors.phone ? "red.500" : "blue.400", 
                      bg: "white",
                      boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)"
                    }}
                    onKeyDown={(e) => {
                      const allowed = /^[0-9\s]$/;
                      if (!allowed.test(e.key) && e.key !== "Backspace" && e.key !== "Tab" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                        e.preventDefault();
                      }
                    }}
                    transition="all 0.2s"
                  />
                </InputGroup>
                {errors.phone && (
                  <Text color="red.500" fontSize="12px" mt={1}>
                    {errors.phone}
                  </Text>
                )}
              </FormControl>

              {/* Address Input */}
              <FormControl isRequired>
                <FormLabel fontSize="14px" fontWeight="500" color="gray.700" mb={2}>
                  {t('SupportForm.form.address', 'Адрес')}
                </FormLabel>
                <LocationSearchInput
                  value={form.address}
                  onChange={handleAddressChange}
                  placeholder={t('SupportForm.form.addressPlaceholder', 'Введите ваш адрес')}
                  i18n={i18n}
                  error={errors.address}
                />
                {errors.address && (
                  <Text color="red.500" fontSize="12px" mt={1}>
                    {errors.address}
                  </Text>
                )}
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                bg="#FFD700"
                color="black"
                w="100%"
                h="48px"
                borderRadius="8px"
                fontWeight="600"
                fontSize="16px"
                isLoading={isSubmitting}
                loadingText={t('SupportForm.form.sending', 'Отправляем...')}
                _hover={{
                  bg: "#FFC700",
                  transform: "translateY(-1px)",
                }}
                _active={{
                  transform: "translateY(0px)",
                }}
                transition="all 0.2s"
              >
                {t('SupportForm.form.submit', 'Отправить заявку')}
              </Button>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default SupportForm;