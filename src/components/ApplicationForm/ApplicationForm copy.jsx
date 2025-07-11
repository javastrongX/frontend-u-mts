import React, { forwardRef, useMemo, useCallback, useState, useId, useEffect } from "react";

import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
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
  FormErrorMessage,
  IconButton,
  Badge,
  InputGroup,
  InputRightElement,
  Image,
} from "@chakra-ui/react";
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
  FiSettings,
  FiPlus,
  FiX,
  FiCreditCard,
  FiClock,
  FiTrash2,
} from "react-icons/fi";

import { BiBarcode } from "react-icons/bi";
import { MdWorkOutline } from "react-icons/md";

import { OrderHeader } from "../OrderForm/OrderHeader";
import { OrderTypeSelector } from "../OrderForm/OrderTypeSelector";
import { FileUpload } from "../OrderForm/FileUpload";
import { SearchableSelect } from "../OrderForm/SearchableSelect";
import { useTranslation } from "react-i18next";
import { useApplicationForm } from "./logic/useApplicationForm";
import OptimizedFormSection from "./OptimizedFormSection";
import ConditionRadio from "../Ads_component/ConditionRadio";
import DescriptionWithTags from "./DescriptionWithTags";
import { useLocation, useParams } from "react-router-dom";

// Helper component for form field with ref
const FormFieldWithRef = forwardRef(({ children, fieldName, fieldRefs }, ref) => {
  return (
    <div
      ref={(el) => {
        fieldRefs.current[fieldName] = el;
        if (ref) {
          if (typeof ref === 'function') {
            ref(el);
          } else {
            ref.current = el;
          }
        }
      }}
    >
      {children}
    </div>
  );
});

FormFieldWithRef.displayName = 'FormFieldWithRef';

const OptimizedInput = React.memo(({ 
  placeholder,
  value,
  onChange,
  size,
  fieldName,
  getInputStyles,
  t,
  ...props 
}) => {
  const inputStyles = useMemo(() => 
    getInputStyles(fieldName)
  , [getInputStyles, fieldName]);

  return (
    <InputGroup>
      {fieldName === "experience" && (
        <InputRightElement pointerEvents={'none'} mr={2}>{t("ApplicationForm.form.year", "лет")}</InputRightElement>
      )}
      <Input
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        size={size}
        borderRadius={{ base: "lg", md: "xl" }}
        bg="gray.50"
        border="2px solid"
        fontSize={{ base: "sm", md: "md" }}
        transition="all 0.2s"
        {...inputStyles}
        {...props}
      />
    </InputGroup>
  );
});

OptimizedInput.displayName = 'OptimizedInput';

// Reusable Form Control Component
const FormControlWrapper = ({
  fieldName,
  label,
  Icon: Icon,
  hasError,
  children,
  fieldRefs,
  iconSize,
  ...props
}) => {
  const { t } = useTranslation();
  
  return (
    <FormFieldWithRef fieldName={fieldName} fieldRefs={fieldRefs}>
      <FormControl isInvalid={hasError(fieldName)} {...props}>
        {/* FormLabel o'rniga Text ishlatdim */}
        <Box
          fontWeight="bold"
          color="gray.700"
          mb={3}
          fontSize={{ base: "sm", md: "md" }}
          display="flex"
        >
          <HStack spacing={{ base: 2, md: 3 }}>
            {Icon && <Icon color="#3182CE" size={iconSize} />}
            <Text>
              {label}
            </Text>
          </HStack>
        </Box>
        {children}
        {hasError(fieldName) && (
          <FormErrorMessage>
            {t("ApplicationForm.form.field_haveTo_fill", "Это поле обязательно для заполнения.")}
          </FormErrorMessage>
        )}
      </FormControl>
    </FormFieldWithRef>
  );
};

// Phone Input Component
const PhoneInput = ({ 
  value, 
  onChange, 
  onRemove, 
  placeholder, 
  inputSize, 
  getInputStyles, 
  showRemove = false,
  index,
  fieldRefs,
  id
}) => {
  const handlePhoneChange = (e) => {
    // Foydalanuvchi kiritgan qiymat
    let inputValue = e.target.value;

    // Faqat raqamlarni qoldiramiz
    const digitsOnly = inputValue.replace(/\D/g, '');

    // Avtomatik boshiga "+" qo‘shamiz
    const formattedValue = '+' + digitsOnly;

    onChange(formattedValue);
  };
  const [isHovered, setIsHovered] = useState(false);



  return (
    <FormFieldWithRef fieldName={"phone"} fieldRefs={fieldRefs}>
        <HStack spacing={2} w={{base: "100%", md: "50%"}}>
          <Input
            placeholder={placeholder}
            value={value || ""}
            onChange={handlePhoneChange}
            size={inputSize}
            borderRadius={{ base: "lg", md: "xl" }}
            bg="gray.50"
            border="2px solid"
            fontSize={{ base: "sm", md: "md" }}
            transition="all 0.2s"
            flex={1}
            id={id}
            {...getInputStyles(`phone_${index}`)}
          />
          {showRemove && (
            <IconButton
              icon={isHovered ? <Image src="/bin.png" h={4} /> : <FiTrash2 />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              bg="red.100"
              onClick={onRemove}
              aria-label="Remove phone number"
              _hover={{ bg: "red.200" }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          )}
      </HStack>
    </FormFieldWithRef>
  );
};


// Badge Info Component
const BadgeInfo = ({ icon: Icon, text, iconColor = "#3182CE", iconSize = 16 }) => (
  <HStack spacing={2}>
    <Icon color={iconColor} size={iconSize} />
    <Text fontSize="xs" color="gray.600">{text}</Text>
  </HStack>
);

const ApplicationForm = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { pathname } = location;
  const { id } = useParams();

  const isEditPage = pathname.startsWith("/edit");

  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const mockEditData = {
    category: "purchase",
    techType: "excavator",
    marka: "caterpillar_excavator",
    model: "cat_320",
    countriesbymodel: "uzbekistan",
    fuelType: "petrol",
    releaseDate: "2020",
    mileage: "10009",
    condition: "new",
    cashPayment: "cash",
    description: "salom test",
    price: "12000",
    contact: "Jorabek",
    phone: "+998772233445",
    country: "uzbekistan",
    city: "bukhara"
  };

  const getDisableFields = {
    "purchase": [
      "techType",
      "marka",
      "model",
      "countriesbymodel",
    ]
  } 

  // Breakpoint values-ni memoize qilish
  const cardBg = useColorModeValue("white", "gray.800");
  const iconSize = useBreakpointValue({ base: 16, md: 20 });
  const contactIconSize = useBreakpointValue({ base: 14, md: 16 });
  const phoneIconSize = useBreakpointValue({ base: 14, md: 16 });
  const containerMaxW = useBreakpointValue({
    base: "100%",
    sm: "100%",
    md: "4xl",
  });
  const cardPadding = useBreakpointValue({ base: 4, sm: 6, md: 8 });
  const formSpacing = useBreakpointValue({ base: 6, md: 8 });
  const inputSize = useBreakpointValue({ base: "md", md: "lg" });
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const headingSize = useBreakpointValue({ base: "sm", md: "md" });
  const gridColumns = useBreakpointValue({ base: 1, md: 2 });
  const actionButtonDirection = useBreakpointValue({
    base: "column",
    md: "row",
  });
  const actionButtonSpacing = useBreakpointValue({ base: 4, md: 0 });


  const {
    // Edit Mode
    initializeEditMode,

    // State
    selectedType,
    setSelectedType,
    files,
    step,
    totalSteps,
    isSubmitting,
    formData,
    setFormData,
    fieldRefs,
    phoneNumbers,

    // Constants
    techTypes,
    countries,
    fuelTypes,
    dateOfRelease,
    availableMarkaForRepair,
    availableProfession,
    workPlace,

    // Computed values
    availableCities,
    availableMarka,
    availableModel,
    availableCountry,
    availablePartsCategory,
    availableProfessionByMarka,
    availablePartManufacturerByProfession,

    // Validation
    isFormValid,
    emptyFields,

    // Handlers
    handleInputChange,
    handleFileChange,
    handleFileRemove,
    handleSubmit,
    handleBack,
    hasError,
    getInputStyles,
    
    // Phone handlers
    addPhoneNumber,
    removePhoneNumber,
    updatePhoneNumber,
  } = useApplicationForm();

   // API dan ma'lumot olish
  useEffect(() => {
    const fetchEditData = async () => {
      if (isEditPage && id) {
        setIsLoading(true);
        try {
          // API chaqirish
          // const response = await fetch(`/api/products/${id}`);
          // const data = await response.json();
          
          setEditData(mockEditData);
          // setEditData(data);
          // Ma'lumotni formData ga yukla
          initializeEditMode(mockEditData, mockEditData.category);
          // initializeEditMode(data, data.category);
        } catch (error) {
          console.error('Error fetching edit data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEditData();
  }, [isEditPage, id, initializeEditMode]);
 
 
  const handleTypeChange = useCallback((type) => {
    setSelectedType(type);
    setFormData({});
  }, [setSelectedType, setFormData]);

  const handleTitleChange = useCallback((e) => {
    handleInputChange("title", e.target.value);
  }, [handleInputChange]);

  const handlePartNumberChange = useCallback((e) => {
    handleInputChange("partNumber", e.target.value);
  }, [handleInputChange]);

  const handleExperienceChange = useCallback((e) => {
    handleInputChange("experience", e.target.value);
  }, [handleInputChange]);

  const handleMinOrderTimeChange = useCallback((e) => {
    handleInputChange("minOrderTime", e.target.value);
  }, [handleInputChange]);

  const handleMileageChange = useCallback((e) => {
    handleInputChange("mileage", e.target.value);
  }, [handleInputChange]);

  const handleContactChange = useCallback((e) => {
    handleInputChange("contact", e.target.value);
  }, [handleInputChange]);

  const handlePriceChange = useCallback((e) => {
    handleInputChange("price", e.target.value);
  }, [handleInputChange]); 

  const handleHourlyRateChange = useCallback((e) => {
    handleInputChange("hourlyRate", e.target.value);
  }, [handleInputChange]);

  const handleNegotiableChange = useCallback((e) => {
    handleInputChange("isNegotiable", e.target.checked);
  }, [handleInputChange]);

  const handleDescriptionChange = useCallback((value) => {
    handleInputChange("description", value);
  }, [handleInputChange]);

  const handleCountryChange = useCallback((value) => {
    handleInputChange("country", value);
  }, [handleInputChange]);

  const handleCityChange = useCallback((value) => {
    handleInputChange("city", value);
  }, [handleInputChange]);

  // Memoized conditional renders
  const showPartsTitle = useMemo(() => 
    ["parts"].includes(selectedType)
  , [selectedType]);

  const showPartsPartNumber = useMemo(() => 
    ["parts"].includes(selectedType)
  , [selectedType]);

  const showExperience = useMemo(() => 
    ["repair", "driver"].includes(selectedType)
  , [selectedType]);

  const showRentFields = useMemo(() => 
    ["rent"].includes(selectedType)
  , [selectedType]);

  const showPurchasePartsFields = useMemo(() => 
    ["purchase", "parts"].includes(selectedType)
  , [selectedType]);

  const showMileage = useMemo(() => 
    selectedType !== 'parts' && showPurchasePartsFields
  , [selectedType, showPurchasePartsFields]);

  const showHourlyRate = useMemo(() => 
    selectedType === "rent"
  , [selectedType]);

  const generatedId = useId();
  
  // Loading holatini ko'rsatish
  if (isEditPage && isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner emptyColor="gray.200" size="xl" />
        <Text mt={4}>Loading...</Text>
      </Box>
    );
  }
  return (
    <Box maxW={containerMaxW} py={{ base: 4, md: 8 }} mb={{base: "100px", custom570: 0}}>
      <OrderHeader onBack={handleBack} step={step} totalSteps={totalSteps} />
      <OrderTypeSelector
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        setFormData={setFormData}
        disabled={isEditPage}
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
              <HStack mt={{ base: 1, md: 2 }} spacing={3}>
                <Box p={2} bg="blue.100" borderRadius="full">
                  <FiSettings color="#3182CE" size={iconSize} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Heading size={headingSize} color="gray.800">
                    {t("ApplicationForm.form.enter_data", "Введите данные.")}
                  </Heading>
                  <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }}>
                    (<Text as="span" color="red.500">*</Text>) {t("ApplicationForm.form.marked_field", "Обязательные для заполнения поля")}
                  </Text>
                </VStack>
              </HStack>

            <Divider/>
            {/* Title */}
            {showPartsTitle && (
              <ScaleFade in={true}>
                <FormControlWrapper
                  fieldName="title"
                  label={t("ApplicationForm.form.order_name", "E'lon nomi")}
                  Icon={FiTruck}
                  isRequired
                  hasError={hasError}
                  fieldRefs={fieldRefs}
                  iconSize={iconSize}
                >
                  <OptimizedInput
                    placeholder={t(
                      "ApplicationForm.form.enter_order_name",
                      "Введите название заказа"
                    )}
                    value={formData.title}
                    onChange={handleTitleChange}
                    size={inputSize}
                    fieldName="title"
                    getInputStyles={getInputStyles}
                    t={t}
                  />
                </FormControlWrapper>
              </ScaleFade>
            )}
            
            <OptimizedFormSection
              selectedType={selectedType} 
              formData={formData}
              handleInputChange={handleInputChange}
              techTypes={techTypes}
              availableMarka={availableMarka}
              availableModel={availableModel}
              availablePartsCategory={availablePartsCategory}
              countries={countries}
              fuel_type={fuelTypes}
              date_of_release={dateOfRelease}
              availableCountry={availableCountry}
              FormFieldWithRef={FormFieldWithRef}
              fieldRefs={fieldRefs}
              hasError={hasError}
              availableMarkaForRepair={availableMarkaForRepair}
              availableProfession={availableProfession}
              availableProfessionByMarka={availableProfessionByMarka}
              availablePartManufacturerByProfession={availablePartManufacturerByProfession}
              workPlace={workPlace}
              id={`searchable-select-${generatedId}`}
              name={generatedId}
              disabledFields={isEditPage && editData ? getDisableFields[editData.category] : []}
            />
            {/* partNumber  */}
            {showPartsPartNumber && (
              <ScaleFade in={true}>
                <FormControlWrapper
                  fieldName="partNumber"
                  label={t("ApplicationForm.form.enter_partNumber", "Номер (артикул) запчасти")}
                  Icon={BiBarcode}
                  isRequired
                  hasError={hasError}
                  fieldRefs={fieldRefs}
                  iconSize={iconSize}
                >
                  <OptimizedInput
                    value={formData.partNumber}
                    onChange={handlePartNumberChange}
                    size={inputSize}
                    fieldName="partNumber"
                    getInputStyles={getInputStyles}
                    t={t}
                  />  
                </FormControlWrapper>
              </ScaleFade>
            )}

            {/* // Experience: */}
            {showExperience && (
              <ScaleFade in={true}>
                <FormControlWrapper
                  fieldName="experience"
                  label={t("ApplicationForm.form.enter_experienceYear", "Опыт, лет")}
                  Icon={MdWorkOutline}
                  isRequired
                  hasError={hasError}
                  fieldRefs={fieldRefs}
                  iconSize={iconSize}
                >
                <OptimizedInput
                  value={formData.experience}
                  onChange={handleExperienceChange}
                  size={inputSize}
                  fieldName="experience"
                  getInputStyles={getInputStyles}
                  t={t}
                />
                </FormControlWrapper>
              </ScaleFade>
            )}

            {/* Minimum order time */}
            {showRentFields && (
              <>
                <ScaleFade in={true}>
                  <FormControlWrapper
                    fieldName="minOrderTime"
                    label={t("ApplicationForm.form.minOrderTime", "Минимальное время заказа, ч")}
                    Icon={FiClock}
                    isRequired
                    hasError={hasError}
                    fieldRefs={fieldRefs}
                    iconSize={iconSize}
                  >
                    <Input
                      value={formData.minOrderTime || ""}
                      onChange={handleMinOrderTimeChange}
                      size={inputSize}
                      borderRadius={{ base: "lg", md: "xl" }}
                      bg="gray.50"
                      border="2px solid"
                      fontSize={{ base: "sm", md: "md" }}
                      transition="all 0.2s"
                      {...getInputStyles("minOrderTime")}
                    />
                  </FormControlWrapper>
                </ScaleFade>

                {/*  Radio Button  */}
                <FormControlWrapper
                  fieldName="haveDriver"
                  hasError={hasError}
                  fieldRefs={fieldRefs}
                >
                  {/* Condition Radio */}
                  <FormFieldWithRef fieldName="haveDriver" fieldRefs={fieldRefs}>
                    <ConditionRadio
                      value={formData.haveDriver}
                      setValue={(value) => handleInputChange("haveDriver", value)}
                      icon={FiUser}
                      title={t("ApplicationForm.form.haveDriver",  "С оператором (водитель)")}
                      label1={t("ApplicationForm.form.yes", "Да")}
                      label2={t("ApplicationForm.form.no", "Нет")}
                    />
                  </FormFieldWithRef>
                </FormControlWrapper>
              </>
            )}

            {/* Mileage / Engine hours - for purchase type */}
            {["purchase", "parts"].includes(selectedType) && (
              <>
                {showMileage && (
                  <ScaleFade in={true}>
                    <FormControlWrapper
                      fieldName="mileage"
                      label={t("ApplicationForm.form.milage", "Пробег/Наработки двигателя")}
                      Icon={FiTruck}
                      isRequired
                      hasError={hasError}
                      fieldRefs={fieldRefs}
                      iconSize={iconSize}
                    >
                      <Input
                        value={formData.mileage || ""}
                        onChange={handleMileageChange}
                        size={inputSize}
                        borderRadius={{ base: "lg", md: "xl" }}
                        bg="gray.50"
                        border="2px solid"
                        fontSize={{ base: "sm", md: "md" }}
                        transition="all 0.2s"
                        {...getInputStyles("mileage")}
                      />
                    </FormControlWrapper>
                  </ScaleFade>
                )}

                {/* Radio buttons */}

                <FormControlWrapper
                  fieldName="condition"
                  hasError={hasError}
                  fieldRefs={fieldRefs}
                >
                  {/* Condition Radio */}
                  <FormFieldWithRef fieldName="condition" fieldRefs={fieldRefs}>
                    <ConditionRadio
                      value={formData.condition}
                      setValue={(value) => handleInputChange("condition", value)} 
                      icon={FiCheckCircle}
                    />
                  </FormFieldWithRef>
                </FormControlWrapper>

                <FormControlWrapper
                  fieldName="cashPayment"
                  hasError={hasError}
                  fieldRefs={fieldRefs}
                >
                  {/* Cash Payment Radio */}
                  <FormFieldWithRef fieldName="cashPayment" fieldRefs={fieldRefs}>
                    <ConditionRadio
                      value={formData.cashPayment}
                      setValue={(value) => handleInputChange("cashPayment", value)}
                      title={t("ApplicationForm.form.is_cash", "В наличии")}
                      label1={t("ApplicationForm.form.yes", "Да")}
                      label2={t("ApplicationForm.form.no", "Нет")}
                      value1="cash"
                      value2="card"
                      icon={FiCreditCard}
                      fieldName="cashPayment"
                    />
                  </FormFieldWithRef>
               </FormControlWrapper>
             
              </>
            )}

            {/* Description */}
            <ScaleFade in={true} delay={0.2}>
              <FormControlWrapper
                fieldName="description"
                label={t("ApplicationForm.form.description", "Подробное описание")}
                isRequired
                hasError={hasError}
                fieldRefs={fieldRefs}
                iconSize={iconSize}
              >
                <DescriptionWithTags
                  selectedTab={selectedType}
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder={t(
                    "ApplicationForm.form.description_placeholder",
                    "Техника, которой вы занимаетесь, требования к работе, сроки и другие важные детали..."
                  )}
                  rows={{ base: 4, md: 5 }}
                  borderRadius={{ base: "lg", md: "xl" }}
                  bg="gray.50"
                  maxH={"700px"}
                  minH={"140px"}
                  border="2px solid"
                  fontSize={{ base: "sm", md: "md" }}
                  resize="vertical"
                  transition="all 0.2s"
                  hasError={hasError}
                  fieldName="description"
                  fieldRefs={fieldRefs}
                  getInputStyles={getInputStyles}
                />
              </FormControlWrapper>
            </ScaleFade>
            <Divider />

            {/* Price and Contact Section */}
            <Box>
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

              <SimpleGrid columns={gridColumns} spacing={{ base: 6, md: 8 }} alignItems={'end'}>
                {/* Price Section - Only show for non-purchase types */}
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
                            "Укажите цену (сум)"
                          )}
                        </Text>
                      </FormLabel>

                      <VStack spacing={4} align="stretch">
                        <Checkbox
                          isChecked={formData.isNegotiable}
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
                            <InputRightElement color={formData.isNegotiable && 'gray.400'} pointerEvents={'none'} mr={3}>{t("currency.uzs", "сум")}</InputRightElement>
                            <Input
                              placeholder={
                                formData.isNegotiable
                                  ? t(
                                      "ApplicationForm.form.price_contact.negotiable_placeholder",
                                      "Цена договаривается"
                                    )
                                  : selectedType === "rent" 
                                  ? 
                                  "Kunlik narx"
                                  : t(
                                      "ApplicationForm.form.price_contact.price",
                                      "Укажите цену (сум)"
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
                  
                          {/*  Only for rent   */}
                                            {/* HourlyRate */}
                  {showHourlyRate && (
                    <ScaleFade in={true} delay={0.4}>
                      <FormControlWrapper
                        fieldName="hourlyRate"
                        hasError={hasError}
                        fieldRefs={fieldRefs}
                      >
                        <InputGroup>
                          <InputRightElement color={formData.isNegotiable && 'gray.400'} pointerEvents={'none'} mr={3}>{t("currency.uzs", "сум")}</InputRightElement>
                          <Input
                            placeholder={
                              formData.isNegotiable
                                ? t(
                                    "ApplicationForm.form.price_contact.negotiable_placeholder",
                                    "Цена договаривается"
                                  )
                                : t("ApplicationForm.form.hourlyRate", "Цена за час")
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
                        onChange={(value) => updatePhoneNumber(phone.id, value)}
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
                <SimpleGrid columns={gridColumns} spacing={{ base: 4, md: 6 }} mt={{ base: 6, md: 8 }}>
                  <FormControlWrapper
                    fieldName="country"
                    isRequired
                    label={t("ApplicationForm.form.location.title", "Указать адрес")}
                    Icon={FiMapPin}
                    hasError={hasError}
                    fieldRefs={fieldRefs}
                  >
                    <SearchableSelect
                      placeholder={t(
                        "ApplicationForm.form.location.country",
                        "Выберите страну"
                      )}
                      value={formData.country}
                      options={countries}
                      onChange={handleCountryChange}
                      size={inputSize}
                      borderRadius={{ base: "lg", md: "xl" }}
                      bg="gray.50"
                      border="2px solid"
                      fontSize={{ base: "sm", md: "md" }}
                      transition="all 0.2s"
                      {...getInputStyles("country")}
                    />
                  </FormControlWrapper>
                  
                  <FormControlWrapper
                    fieldName="city"
                    isRequired
                    label={t("ApplicationForm.form.location.city_name", 'Город')}
                    hasError={hasError}
                    fieldRefs={fieldRefs}
                  >
                    <SearchableSelect
                      placeholder={t(
                        "ApplicationForm.form.location.city",
                        "Выберите город"
                      )}
                      value={formData.city}
                      options={availableCities}
                      onChange={handleCityChange}
                      size={inputSize}
                      borderRadius={{ base: "lg", md: "xl" }}
                      bg="gray.50"
                      border="2px solid"
                      fontSize={{ base: "sm", md: "md" }}
                      {...getInputStyles("city")}
                      transition="all 0.2s"
                    />
                  </FormControlWrapper>
                </SimpleGrid>
              </ScaleFade>
            </Box>

            <Divider />

            {/* File Upload */}
            <FileUpload
              files={files}
              onFileChange={handleFileChange}
              onFileRemove={handleFileRemove}
            />

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
                    _hover={{ bg: "gray.100", transform: "translateX(-2px)" }}
                    transition="all 0.2s"
                  >
                    {t("ApplicationForm.form.actions.cancel", "Отменить")}
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
                        100% {t("ApplicationForm.form.badges.safe", "Безопасно")}
                      </Text>
                    </HStack>
                    <Button
                      colorScheme="blue"
                      bgGradient="linear(to-r, blue.400, purple.500)"
                      color="white"
                      size={buttonSize}
                      px={{ base: 6, md: 12 }}
                      width={{ base: "full", md: "auto" }}
                      rightIcon={
                        isSubmitting ? <Spinner size="sm" /> : <FiCheckCircle />
                      }
                      onClick={handleSubmit}
                      borderRadius={{ base: "lg", md: "xl" }}
                      fontSize={{ base: "sm", md: "md" }}
                      _hover={{
                        bgGradient: "linear(to-r, blue.700, purple.600)",
                        transform: "translateY(-2px)",
                        boxShadow: "xl",
                      }}
                      _active={{ transform: "translateY(0)" }}
                      transition="all 0.3s"
                      isLoading={isSubmitting}
                      loadingText={t("ApplicationForm.form.actions.sending", "Отправляется...")}
                      // isDisabled={isSubmitting || !isFormValid}
                      opacity={!isFormValid ? 0.6 : 1}
                    >
                      {isSubmitting
                        ? t("ApplicationForm.form.actions.sending", "Отправляется...")
                        : t("ApplicationForm.form.actions.submit", "Опубликовать")}
                    </Button>
                  </VStack>
                </Flex>

                {/* Desktop Features */}
                <Box
                  mt={4}
                  pt={4}
                  borderTop="1px solid"
                  borderColor="gray.200"
                  display={{ base: "none", md: "block" }}
                >
                  <HStack justify="center" spacing={{ base: 3, md: 6 }}>
                    <BadgeInfo 
                      icon={FiTrendingUp}
                      text={t("ApplicationForm.form.badges.fast_reply", "Быстрый ответ")}
                    />
                    <BadgeInfo 
                      icon={FiUsers}
                      text={t("ApplicationForm.form.badges.verified_experts", "Множество профильных специалистов")}
                    />
                    <BadgeInfo 
                      icon={FiStar}
                      text={t("ApplicationForm.form.badges.high_quality", "Высокое качество")}
                    />
                  </HStack>
                </Box>

                {/* Mobile Features */}
                <VStack
                  mt={4}
                  pt={4}
                  borderTop="1px solid"
                  borderColor="gray.200"
                  spacing={2}
                  display={{ base: "flex", md: "none" }}
                >
                  <BadgeInfo 
                    icon={FiShield}
                    text={`100% ${t("ApplicationForm.form.badges.safe", "Безопасно")}`}
                    iconColor="#38A169"
                    iconSize={14}
                  />
                  <HStack spacing={4}>
                    <BadgeInfo 
                      icon={FiTrendingUp}
                      text={t("ApplicationForm.form.badges.fast_reply", "Быстрый ответ")}
                      iconSize={12}
                    />
                    <BadgeInfo 
                      icon={FiUsers}
                      text={t("ApplicationForm.form.badges.experts", "Специалисты")}
                      iconSize={12}
                    />
                    <BadgeInfo 
                      icon={FiStar}
                      text={t("ApplicationForm.form.badges.quality", "Качество")}
                      iconSize={12}
                    />
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

export default ApplicationForm;