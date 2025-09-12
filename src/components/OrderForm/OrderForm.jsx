import { useCallback, useId, useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Checkbox,
  Card,
  CardBody,
  Flex,
  Divider,
  Heading,
  useColorModeValue,
  ScaleFade,
  SimpleGrid,
  Spinner,
  useBreakpointValue,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  CloseButton,
  useDisclosure,
  List,
  ListItem,
  useOutsideClick,
} from '@chakra-ui/react';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiUser,
  FiUsers,
  FiTruck,
  FiDollarSign,
  FiMapPin,
  FiPhone,
  FiStar,
  FiShield,
  FiTrendingUp,
} from 'react-icons/fi';
import { OrderHeader } from './OrderHeader';
import { InfoSection } from './InfoSection';
import { SupportSection } from './SupportSection';
import { OrderTypeSelector } from './OrderTypeSelector';
import { FileUpload } from './FileUpload';
import { useTranslation } from 'react-i18next';
import { OptimizedForm } from './OptimizedForm';
import { useOrderForm } from './logic/useOrderForm';
import SelectableCurrency from '../SelectableCurrency';

// Google Maps Places API location search component
const LocationSearchInput = ({
  value,
  onChange,
  placeholder,
  size,
  inputProps,
  i18n,
  ...otherProps
}) => {
  const [query, setQuery] = useState(value || "");
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

// Main Form Component
const OrderForm = () => {
  const { i18n, t } = useTranslation();
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Use the custom hook
  const {
    // State
    selectedType,
    showSupport,
    files,
    step,
    totalSteps,
    isSubmitting,
    formData,
    setFiles,
    
    // Available options
    availableMarka,
    availableModel,
    
    // Constants
    TECH_TYPES,
    currency,
    
    // Handlers
    handleInputChange,
    handleFileChange,
    handleFileRemove,
    handleSubmit,
    handleBack,
    handleTypeChange,
    setShowSupport,
    
    // Utilities
    isFormValid,
    errors,
    isSubmitted,
    disabled,
    showError,
    errorMessage,
  } = useOrderForm();
  
  // Responsive values
  const iconSize = useBreakpointValue({ base: 16, md: 20 });
  const containerMaxW = useBreakpointValue({ base: "100%", sm: "100%", md: "4xl" });
  const cardPadding = useBreakpointValue({ base: 4, sm: 6, md: 8 });
  const formSpacing = useBreakpointValue({ base: 6, md: 8 });
  const inputSize = useBreakpointValue({ base: "md", md: "lg" });
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const headingSize = useBreakpointValue({ base: "sm", md: "md" });
  const gridColumns = useBreakpointValue({ base: 1, md: 2 });
  const actionButtonDirection = useBreakpointValue({ base: "column", md: "row" });
  const actionButtonSpacing = useBreakpointValue({ base: 4, md: 0 });
  const { isOpen: isVisible, onClose: cancel } = useDisclosure({ defaultIsOpen: true });

  const handleCurrencyChange = (value) => {
    handleInputChange('currency', value)
  }

  // Helper function for input props
  const getInputProps = useCallback((isRequired = false) => ({
    size: inputSize,
    borderRadius: { base: "lg", md: "xl" },
    bg: "gray.50",
    border: "2px solid",
    borderColor: "gray.200",
    fontSize: { base: "sm", md: "md" },
    _focus: { borderColor: 'blue.400', bg: 'white' },
    _hover: { borderColor: 'gray.300' },
    transition: "all 0.2s",
    isRequired
  }), [inputSize]);

  const priceInputId = useId();
  const negotiableCheckboxId = useId();
  const addressInputId = useId();
  
  return (
    <Box 
      maxW={containerMaxW} 
      py={{ base: 4, md: 8 }} 
      mb="100px"
    >
      <OrderHeader onBack={handleBack} step={step} totalSteps={totalSteps} />
      <InfoSection />
      <SupportSection showSupport={showSupport} setShowSupport={setShowSupport} />
      <OrderTypeSelector
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        disabled={disabled}
      />

      <Card 
        bg={cardBg} 
        borderRadius={{ base: "xl", md: "2xl" }}
        boxShadow="xl" 
        border="1px solid" 
        borderColor="gray.200"
      >
        <CardBody p={cardPadding}>
          <VStack spacing={formSpacing} align="stretch">
            {/* Order Title */}
            <ScaleFade in={true}>
              <FormControl isRequired>
                <FormLabel 
                  fontWeight="bold" 
                  color="gray.700" 
                  mb={3}
                  display="flex"
                  flexDir="row"
                  alignItems="flex-start"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  <HStack spacing={{ base: 2, md: 3 }}>
                    <FiTruck color="#3182CE" size={iconSize} />
                    <Text>{t("Orderform.form.order_name", "Название заказа")}</Text>
                  </HStack>
                </FormLabel>
                <Input
                  placeholder={t("Orderform.form.enter_order_name", "Введите название заказа")}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  {...getInputProps(true)}
                />
              </FormControl>
            </ScaleFade>

            <OptimizedForm
              selectedType={selectedType}
              formData={formData}
              handleInputChange={handleInputChange}
              techTypes={TECH_TYPES}
              availableMarka={availableMarka}
              availableModel={availableModel}
              errors={errors}
              isSubmitted={isSubmitted}
            />

            {/* Description */}
            <ScaleFade in={true} delay={0.2}>
              <FormControl isRequired>
                <FormLabel 
                  fontWeight="bold" 
                  color="gray.700" 
                  mb={3}
                  display="flex"
                  flexDir="row"
                  alignItems="flex-start"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {t("Orderform.form.description", "Подробно опишите вашу задачу")}
                </FormLabel>
                <Textarea
                  placeholder={t("Orderform.form.description_placeholder", "Техника, которой вы занимаетесь, требования к работе, сроки и другие важные детали...")}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={{ base: 4, md: 5 }}
                  maxH="700px"
                  minH="140px"
                  resize="vertical"
                  {...getInputProps(true)}
                />
              </FormControl>
            </ScaleFade>

            <Divider />

            {/* Price Section */}
            <Box>
              <HStack mb={{ base: 4, md: 6 }} spacing={3}>
                <Box p={2} bg="green.100" borderRadius="full">
                  <FiDollarSign color="#38A169" size={iconSize} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Heading size={headingSize} color="gray.800">
                    {t("Orderform.form.price_contact.section", "Стоимость и контактные данные")}
                  </Heading>
                  <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }}>
                    {t("Orderform.form.price_contact.note", "Информация о платеже и контактах")}
                  </Text>
                </VStack>
              </HStack>
              
              <SimpleGrid columns={gridColumns} spacing={{ base: 6, md: 8 }}>
                {/* Price Section */}
                <ScaleFade in={true} delay={0.3}>
                  <Box>
                    <FormLabel 
                      fontWeight="medium" 
                      color="gray.700"
                      fontSize={{ base: "sm", md: "md" }}
                      mb={4}
                      htmlFor={priceInputId}
                    >
                      {t("Orderform.form.price_contact.price", "Укажите цену (сум)")}
                    </FormLabel>
                    
                    <VStack spacing={4} align="stretch">
                      <Checkbox
                        id={negotiableCheckboxId}
                        isChecked={formData.isNegotiable}
                        onChange={(e) => handleInputChange('isNegotiable', e.target.checked)}
                        colorScheme="green"
                        size={{ base: "md", md: "lg" }}
                      >
                        <Text fontSize={{ base: "sm", md: "md" }} color="gray.700" fontWeight="medium">
                          {t("Orderform.form.price_contact.negotiable", "Договорная")}
                        </Text>
                      </Checkbox>
                      
                      <FormControl isRequired={!formData.isNegotiable}>
                        <InputGroup>
                          <InputRightElement 
                            color={formData.isNegotiable ? 'gray.400' : 'gray.600'} 
                            mr={7}
                          >
                            <SelectableCurrency CURRENCIES={currency} onCurrencyChange={handleCurrencyChange} />
                          </InputRightElement>
                          <Input
                            id={priceInputId}
                            placeholder={
                              formData.isNegotiable 
                                ? t("Orderform.form.price_contact.negotiable_placeholder", "Цена договаривается") 
                                : t("Orderform.form.price_contact.price", "Укажите цену (сум)")
                            }
                            value={formData.isNegotiable ? "" : formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            isDisabled={formData.isNegotiable}
                            {...getInputProps(!formData.isNegotiable)}
                            bg={formData.isNegotiable ? "gray.100" : "gray.50"}
                            borderColor={formData.isNegotiable ? "gray.300" : "gray.200"}
                            _focus={{ 
                              borderColor: formData.isNegotiable ? 'gray.300' : 'green.400', 
                              bg: formData.isNegotiable ? 'gray.100' : 'white' 
                            }}
                            _disabled={{
                              bg: 'gray.100',
                              color: 'gray.500',
                              cursor: 'not-allowed',
                              opacity: 0.6
                            }}
                          />
                        </InputGroup>
                        {formData.isNegotiable && (
                          <Text fontSize="xs" color="gray.500" mt={2} fontStyle="italic">
                            {t("Orderform.form.price_contact.negotiable_desc", "Цена определяется по договоренности.")}
                          </Text>
                        )}
                      </FormControl>
                    </VStack>
                  </Box>
                </ScaleFade>

                {/* Contact Section */}
                <VStack spacing={4} align="stretch">
                  <ScaleFade in={true} delay={0.4}>
                    <FormControl isRequired>
                      <FormLabel 
                        fontWeight="medium" 
                        color="gray.700"
                        display="flex"
                        flexDir="row"
                        alignItems="flex-start"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        <HStack spacing={{ base: 1, md: 2 }}>
                          <FiUser size={useBreakpointValue({ base: 14, md: 16 })} />
                          <Text>{t("Orderform.form.price_contact.contact_person", "Контакты")}</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        placeholder={t("Orderform.form.price_contact.enter_name", "Введите контакт")}
                        value={formData.contact}
                        onChange={(e) => handleInputChange('contact', e.target.value)}
                        {...getInputProps(true)}
                      />
                    </FormControl>
                  </ScaleFade>

                  <ScaleFade in={true} delay={0.5}>
                    <FormControl isRequired>
                      <FormLabel 
                        fontWeight="medium" 
                        color="gray.700"
                        display="flex"
                        flexDir="row"
                        alignItems="flex-start"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        <HStack spacing={{ base: 1, md: 2 }}>
                          <FiPhone size={useBreakpointValue({ base: 14, md: 16 })} />
                          <Text>{t("Orderform.form.price_contact.phone_number", "Номер телефона")}</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        placeholder="+998 90 123 45 67"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        {...getInputProps(true)}
                      />
                    </FormControl>
                  </ScaleFade>
                </VStack>
              </SimpleGrid>

              {/* Address Section - Updated with Google Places API */}
              <ScaleFade in={true} delay={0.6}>
                <Box mt={{ base: 6, md: 8 }}>
                  <FormControl isRequired>
                    <FormLabel 
                      fontWeight="medium" 
                      color="gray.700" 
                      mb={4}
                      display="flex"
                      flexDir="row"
                      alignItems="flex-start"
                      htmlFor={addressInputId}
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      <HStack spacing={{ base: 1, md: 2 }}>
                        <FiMapPin size={useBreakpointValue({ base: 14, md: 16 })} />
                        <Text>{t("Orderform.form.location.title", "Укажите адрес")}</Text>
                      </HStack>
                    </FormLabel>
                    <LocationSearchInput
                      value={formData.location || ""}
                      onChange={(value) => handleInputChange('contact_location', value)}
                      placeholder={t("Orderform.form.location.search", "Введите город, страну или адрес...")}
                      size={inputSize}
                      i18n={i18n}
                      inputProps={{
                        ...getInputProps(true),
                        id: addressInputId
                      }}
                    />
                  </FormControl>
                </Box>
              </ScaleFade>
            </Box>

            <Divider />

            {/* File Upload */}
            <FileUpload
              files={files}
              setFiles={setFiles}
              onFileChange={handleFileChange}
              onFileRemove={handleFileRemove}
            />

          {/* Error message */}
          {showError && errorMessage && isVisible && (
            <Alert
              status="error"
              mb={4}
              flexDir="column"
              alignItems="start"
              borderRadius="lg"
              position="relative"
              color="red.800"
              px={4}
              py={3}
              maxH="300px"
              overflowY="auto"
              boxShadow="md"
              w="full"
            >
              <CloseButton
                onClick={cancel}
                position="absolute"
                right="8px"
                top="8px"
                size="sm"
                zIndex="1"
              />

              <Box display="flex" alignItems="flex-start" gap={2}>
                <AlertIcon />
                <VStack align="start" spacing={2} mt={4} fontSize={{ base: "sm", md: "md" }}>
                  {errorMessage.map((msg, index) => (
                    <Text as={'li'} key={index} whiteSpace="pre-wrap">
                      {msg}
                    </Text>
                  ))}
                </VStack>
              </Box>
            </Alert>
          )}

            {/* Action Buttons */}
            <ScaleFade in={true} delay={0.7}>
              <Box
                p={{ base: 4, md: 6 }}
                bg="gray.50"
                borderRadius={{ base: "xl", md: "2xl" }}
                border="1px solid"
                borderColor="gray.200"
              >
                <Flex
                  direction={actionButtonDirection}
                  justify="space-between"
                  align="center"
                  gap={actionButtonSpacing}
                >
                  <Button
                    variant="ghost"
                    leftIcon={<FiArrowLeft />}
                    onClick={handleBack}
                    color="gray.600"
                    size={buttonSize}
                    borderRadius={{ base: "lg", md: "xl" }}
                    fontSize={{ base: "sm", md: "md" }}
                    width={{ base: "full", md: "auto" }}
                    order={{ base: 2, md: 1 }}
                    _hover={{ bg: 'gray.100', transform: 'translateX(-2px)' }}
                    transition="all 0.2s"
                  >
                    {t("Orderform.form.actions.cancel", "Отмена")}
                  </Button>
                  
                  <VStack 
                    align={{ base: "stretch", md: "end" }} 
                    spacing={2}
                    width={{ base: "full", md: "auto" }}
                    order={{ base: 1, md: 2 }}
                  >
                    <HStack 
                      spacing={2} 
                      justify={{ base: "center", md: "flex-end" }}
                      display={{ base: "none", sm: "flex" }}
                    >
                      <FiShield color="#38A169" />
                      <Text fontSize="xs" color="gray.500">
                        100% {t("Orderform.form.badges.safe", "Безопасно")}
                      </Text>
                    </HStack>
                    <Button
                      colorScheme="blue"
                      bgGradient="linear(to-r, blue.400, purple.500)"
                      color="white"
                      size={buttonSize}
                      px={{ base: 6, md: 12 }}
                      width={{ base: "full", md: "auto" }}
                      rightIcon={isSubmitting ? <Spinner size="sm" /> : <FiCheckCircle />}
                      onClick={handleSubmit}
                      borderRadius={{ base: "lg", md: "xl" }}
                      fontSize={{ base: "sm", md: "md" }}
                      _hover={{ 
                        bgGradient: 'linear(to-r, blue.700, purple.600)',
                        transform: 'translateY(-2px)',
                        boxShadow: 'xl'
                      }}
                      _active={{ transform: 'translateY(0)' }}
                      transition="all 0.3s"
                      isLoading={isSubmitting}
                      loadingText={t("Orderform.form.actions.sending", "Отправляется...")}
                      isDisabled={isSubmitting || !isFormValid}
                      opacity={!isFormValid ? 0.6 : 1}
                    >
                      {isSubmitting ? t("Orderform.form.actions.sending", 'Отправляется...') : t("Orderform.form.actions.submit", "Опубликовать")}
                    </Button>
                  </VStack>
                </Flex>
                
                <Box 
                  mt={4} 
                  pt={4} 
                  borderTop="1px solid" 
                  borderColor="gray.200"
                  display={{ base: "none", md: "block" }}
                >
                  <HStack justify="center" spacing={{ base: 3, md: 6 }}>
                    <HStack spacing={2}>
                      <FiTrendingUp color="#3182CE" size={16} />
                      <Text fontSize="xs" color="gray.600">{t("Orderform.form.badges.fast_reply", "Быстрый ответ")}</Text>
                    </HStack>
                    <HStack spacing={2}>
                      <FiUsers color="#3182CE" size={16} />
                      <Text fontSize="xs" color="gray.600">{t("Orderform.form.badges.verified_experts", "Множество профильных специалистов")}</Text>
                    </HStack>
                    <HStack spacing={2}>
                      <FiStar color="#3182CE" size={16} />
                      <Text fontSize="xs" color="gray.600">{t("Orderform.form.badges.high_quality", "Высокий качество")}</Text>
                    </HStack>
                  </HStack>
                </Box>
                
                {/* Mobile version of features */}
                <VStack 
                  mt={4} 
                  pt={4} 
                  borderTop="1px solid" 
                  borderColor="gray.200"
                  spacing={2}
                  display={{ base: "flex", md: "none" }}
                >
                  <HStack spacing={2}>
                    <FiShield color="#38A169" size={14} />
                    <Text fontSize="xs" color="gray.500">
                      100% {t("Orderform.form.badges.safe", "Безопасно")}
                    </Text>
                  </HStack>
                  <HStack spacing={4}>
                    <HStack spacing={1}>
                      <FiTrendingUp color="#3182CE" size={12} />
                      <Text fontSize="xs" color="gray.600">{t("Orderform.form.badges.fast_reply", "Быстрый ответ")}</Text>
                    </HStack>
                    <HStack spacing={1}>
                      <FiUsers color="#3182CE" size={12} />
                      <Text fontSize="xs" color="gray.600">{t("Orderform.form.badges.experts", "Специалисты")}</Text>
                    </HStack>
                    <HStack spacing={1}>
                      <FiStar color="#3182CE" size={12} />
                      <Text fontSize="xs" color="gray.600">{t("Orderform.form.badges.quality", "Качество")}</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Box>
            </ScaleFade>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default OrderForm;