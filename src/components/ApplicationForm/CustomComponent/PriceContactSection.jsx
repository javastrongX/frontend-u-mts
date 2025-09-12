import React, { useId, useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  FormLabel,
  Checkbox,
  Heading,
  useBreakpointValue,
  FormErrorMessage,
  Badge,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  ScaleFade,
  List,
  ListItem,
  useOutsideClick,
  Spinner,
} from "@chakra-ui/react";
import {
  FiDollarSign,
  FiUser,
  FiPhone,
  FiMapPin,
  FiPlus,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { FormControlWrapper, PhoneInput } from "./FormControlWrapper";
import SelectableCurrency from "../../SelectableCurrency";

// Google Maps Places API yordamchi komponenti
const LocationSearchInput = ({
  value = "",
  onChange,
  placeholder,
  size,
  i18n,
  getInputStyles,
  fieldName,
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef();
  const suggestionsRef = useRef();
  
  useOutsideClick({
    ref: suggestionsRef,
    handler: () => setShowSuggestions(false),
  });

  // Google Maps Places API dan ma'lumot olish
  const fetchPlaceSuggestions = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const selected_Lang = i18n?.language || 'uz';;
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
  }, [query]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
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
    <Box position="relative" ref={suggestionsRef}>
      <InputGroup>
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          size={size}
          borderRadius={{ base: "lg", md: "xl" }}
          bg="gray.50"
          border="2px solid"
          fontSize={{ base: "sm", md: "md" }}
          transition="all 0.2s"
          {...getInputStyles(fieldName)}
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
          border="2px solid"
          borderColor="gray.200"
          borderRadius="xl"
          boxShadow="lg"
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
                _hover={{ bg: "gray.50" }}
                _first={{ borderTopRadius: "xl" }}
                _last={{ borderBottomRadius: "xl" }}
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

const PriceContactSection = ({
  formData,
  selectedType,
  handlePriceChange,
  handleHourlyRateChange,
  handleNegotiableChange,
  handleContactChange,
  handleLocationChange,
  handleCurrencyChange,
  phoneNumbers,
  addPhoneNumber,
  removePhoneNumber,
  updatePhoneNumber,
  hasError,
  getInputStyles,
  fieldRefs,
  showHourlyRate,
  currency
}) => {
  const { i18n, t } = useTranslation();
  const generatedId = useId();
  
  // Responsive values
  const iconSize = useBreakpointValue({ base: 16, md: 20 });
  const contactIconSize = useBreakpointValue({ base: 14, md: 16 });
  const phoneIconSize = useBreakpointValue({ base: 14, md: 16 });
  const inputSize = useBreakpointValue({ base: "md", md: "lg" });
  const headingSize = useBreakpointValue({ base: "sm", md: "md" });
  const gridColumns = useBreakpointValue({ base: 1, md: 2 });

  return (
    <Box>
      {/* Section Header */}
      <HStack mb={{ base: 4, md: 6 }} spacing={3}>
        <Box p={2} bg="green.100" borderRadius="full">
          <FiDollarSign color="#38A169" size={iconSize} />
        </Box>
        <VStack align="start" spacing={0}>
          <Heading size={headingSize} color="gray.800">
            {t(
              "ApplicationForm.form.price_contact.section",
              "Стоимость и контактные данные"
            )}
          </Heading>
          <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }}>
            {t(
              "ApplicationForm.form.price_contact.note",
              "Информация о платеже и контактах"
            )}
          </Text>
        </VStack>
      </HStack>

      {/* Price and Contact Grid */}
      <SimpleGrid columns={gridColumns} spacing={{ base: 6, md: 8 }} alignItems={'end'}>
        {/* Price Section */}
        <ScaleFade in={true} delay={0.3}>
          <Box>
            <FormLabel
              fontWeight="medium"
              color="gray.700"
              fontSize={{ base: "sm", md: "md" }}
              mb={4}
              display="flex"
              alignItems="center"
              htmlFor={generatedId}
            >
              <Text>
                {t(
                  "ApplicationForm.form.price_contact.price",
                  "Укажите цену"
                )}
              </Text>
            </FormLabel>

            <VStack spacing={4} align="stretch">
              <Checkbox
                isChecked={formData.isNegotiable || false}
                onChange={handleNegotiableChange}
                colorScheme="green"
                size={{ base: "md", md: "lg" }}
                id={generatedId}
              >
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.700"
                  fontWeight="medium"
                >
                  {t(
                    "ApplicationForm.form.price_contact.negotiable",
                    "Договорная"
                  )}
                </Text>
              </Checkbox>

              <FormControlWrapper
                fieldName="price"
                hasError={hasError}
                fieldRefs={fieldRefs}
              >
                <InputGroup>
                  <InputRightElement 
                    color={formData.isNegotiable && 'gray.400'} 
                    mr={7}
                  >
                    <SelectableCurrency CURRENCIES={currency} onCurrencyChange={handleCurrencyChange} defaultCurrency={formData.currency} />
                  </InputRightElement>
                  <Input
                    placeholder={
                      formData.isNegotiable
                        ? t(
                            "ApplicationForm.form.price_contact.negotiable_placeholder",
                            "Цена договаривается"
                          )
                        : selectedType === "rent" 
                        ? t("ApplicationForm.form.price_contact.daily_work", "Дневной заработок")
                        : t(
                            "ApplicationForm.form.price_contact.price",
                            "Укажите цену"
                          )
                    }
                    value={formData.isNegotiable ? "" : (formData.price || "")}
                    onChange={handlePriceChange}
                    size={inputSize}
                    borderRadius={{ base: "lg", md: "xl" }}
                    bg={formData.isNegotiable ? "gray.100" : "gray.50"}
                    border="2px solid"
                    borderColor={
                      formData.isNegotiable ? "gray.300" : "gray.200"
                    }
                    fontSize={{ base: "sm", md: "md" }}
                    isDisabled={formData.isNegotiable}
                    _disabled={{
                      bg: "gray.100",
                      color: "gray.500",
                      cursor: "not-allowed",
                      opacity: 0.6,
                    }}
                    transition="all 0.2s"
                    {...getInputStyles("price")}
                  />
                </InputGroup>
                {formData.isNegotiable && (
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    mt={2}
                    fontStyle="italic"
                  >
                    {t(
                      "ApplicationForm.form.price_contact.negotiable_desc",
                      "Цена определяется по договоренности."
                    )}
                  </Text>
                )}
              </FormControlWrapper>
            </VStack>
          </Box>
        </ScaleFade>
        
        {/* Hourly Rate - Only for rent */}
        {showHourlyRate && (
          <ScaleFade in={true} delay={0.4}>
            <FormControlWrapper
              fieldName="hourlyRate"
              hasError={hasError}
              fieldRefs={fieldRefs}
            >
              <InputGroup>
                <Input
                  placeholder={
                    formData.isNegotiable
                      ? t(
                          "ApplicationForm.form.price_contact.negotiable_placeholder",
                          "Цена договаривается"
                        )
                      : t("ApplicationForm.form.price_contact.hourlyRate", "Цена за час")
                  }
                  value={formData.isNegotiable ? "" : (formData.hourlyRate || "")}
                  onChange={handleHourlyRateChange} 
                  size={inputSize}
                  borderRadius={{ base: "lg", md: "xl" }}
                  bg={formData.isNegotiable ? "gray.100" : "gray.50"}
                  border="2px solid"
                  borderColor={
                    formData.isNegotiable ? "gray.300" : "gray.200"
                  }
                  fontSize={{ base: "sm", md: "md" }}
                  isDisabled={formData.isNegotiable}
                  _disabled={{
                    bg: "gray.100",
                    color: "gray.500",
                    cursor: "not-allowed",
                    opacity: 0.6,
                  }}
                  transition="all 0.2s"
                  {...getInputStyles("hourlyRate")}
                />
              </InputGroup>
              {formData.isNegotiable && (
                <Text
                  fontSize="xs"
                  color="gray.500"
                  mt={2}
                  fontStyle="italic"
                >
                  {t(
                    "ApplicationForm.form.price_contact.negotiable_desc",
                    "Цена определяется по договоренности."
                  )}
                </Text>
              )}
            </FormControlWrapper>
          </ScaleFade>
        )}

        {/* Contact Person Section */}
        <ScaleFade in={true} delay={0.4}>
          <FormControlWrapper
            fieldName="contact"
            label={t(
              "ApplicationForm.form.price_contact.contact_person",
              "Контакты"
            )}
            Icon={FiUser}
            isRequired
            hasError={hasError}
            fieldRefs={fieldRefs}
            iconSize={contactIconSize}
          >
            <Input
              placeholder={t(
                "ApplicationForm.form.price_contact.enter_name",
                "Введите контакт"
              )}
              value={formData.contact || ""}
              onChange={handleContactChange}
              size={inputSize}
              borderRadius={{ base: "lg", md: "xl" }}
              bg="gray.50"
              border="2px solid"
              fontSize={{ base: "sm", md: "md" }}
              {...getInputStyles("contact")}
              transition="all 0.2s"
            />
          </FormControlWrapper>
        </ScaleFade>
      </SimpleGrid>

      {/* Phone Numbers Section - Full width */}
      <ScaleFade in={true} delay={0.5}>
        <Box mt={{ base: 6, md: 8 }}>
          <FormLabel
            fontWeight="bold"
            color="gray.700"
            fontSize={{ base: "sm", md: "md" }}
            mb={3}
            display="flex"
            alignItems="center"
            htmlFor={`phone-number-${generatedId}`}
          >
            <HStack spacing={{ base: 2, md: 3 }}>
              <FiPhone color="#3182CE" size={phoneIconSize} />
              <Text>
                {t(
                  "ApplicationForm.form.price_contact.phone_number",
                  "Номер телефона"
                )}
                <Text as="span" color="red.500" ml={1}>*</Text>
              </Text>
              <Badge colorScheme="blue" size="sm" fontSize="xs">
                {phoneNumbers.length}/20
              </Badge>
            </HStack>
          </FormLabel>
          
          <VStack spacing={3} align="stretch">
            {phoneNumbers.map((phone, index) => (
              <PhoneInput
                key={phone.id}
                value={phone.value}
                onChanged={(value) => updatePhoneNumber(phone.id, value)}
                onRemove={() => removePhoneNumber(phone.id)}
                placeholder={"+998 90 123 45 67"}
                inputSize={inputSize}
                getInputStyles={getInputStyles}
                showRemove={phoneNumbers.length > 1}
                index={index}
                hasError={hasError}
                fieldRefs={fieldRefs}
                id={`phone-number-${generatedId}`}
              />
            ))}
            
            {phoneNumbers.length < 20 && (
              <Button
                leftIcon={<FiPlus />}
                variant="outline"
                size="sm"
                onClick={addPhoneNumber}
                color={'blue.400'}
                borderRadius={{ base: "lg", md: "xl" }}
                _hover={{ bg: "blue.50", borderColor: "blue.300" }}
                transition="all 0.2s"
                fontSize={{ base: "sm", md: "md" }}
                width="fit-content"
              >
                {t("ApplicationForm.form.price_contact.add_contact", "Добавить контакты")}
              </Button>
            )}
          </VStack>
          
          {hasError("phone") && (
            <FormErrorMessage mt={2}>
              {t("ApplicationForm.form.price_contact.at_least_onePhone", "Необходимо ввести как минимум один номер телефона")}
            </FormErrorMessage>
          )}
        </Box>
      </ScaleFade>

      {/* Address Section */}
      <ScaleFade in={true} delay={0.6}>
        <Box mt={{ base: 6, md: 8 }}>
          <FormControlWrapper
            fieldName="location"
            isRequired
            label={t("ApplicationForm.form.location.title", "Указать адрес")}
            Icon={FiMapPin}
            hasError={hasError}
            fieldRefs={fieldRefs}
          >
            <LocationSearchInput
              value={formData.contact_location}
              onChange={handleLocationChange}
              placeholder={t(
                "ApplicationForm.form.location.search",
                "Введите город, страну или адрес..."
              )}
              size={inputSize}
              i18n={i18n}
              getInputStyles={getInputStyles}
              fieldName="location"
            />
          </FormControlWrapper>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default PriceContactSection;