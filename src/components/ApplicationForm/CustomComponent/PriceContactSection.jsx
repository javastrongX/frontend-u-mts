import React, { useId } from "react";
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
import { SearchableSelect } from "../../OrderForm/SearchableSelect";

const PriceContactSection = ({
  formData,
  selectedType,
  handlePriceChange,
  handleHourlyRateChange,
  handleNegotiableChange,
  handleContactChange,
  handleCountryChange,
  handleCityChange,
  phoneNumbers,
  addPhoneNumber,
  removePhoneNumber,
  updatePhoneNumber,
  countries,
  availableCities,
  hasError,
  getInputStyles,
  fieldRefs,
  showHourlyRate,
}) => {
  const { t } = useTranslation();
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
                  "Укажите цену (сум)"
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
                    pointerEvents={'none'} 
                    mr={3}
                  >
                    {t("currency.uzs", "сум")}
                  </InputRightElement>
                  <Input
                    placeholder={
                      formData.isNegotiable
                        ? t(
                            "ApplicationForm.form.price_contact.negotiable_placeholder",
                            "Цена договаривается"
                          )
                        : selectedType === "rent" 
                        ? "Kunlik narx"
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
        
        {/* Hourly Rate - Only for rent */}
        {showHourlyRate && (
          <ScaleFade in={true} delay={0.4}>
            <FormControlWrapper
              fieldName="hourlyRate"
              hasError={hasError}
              fieldRefs={fieldRefs}
            >
              <InputGroup>
                <InputRightElement 
                  color={formData.isNegotiable && 'gray.400'} 
                  pointerEvents={'none'} 
                  mr={3}
                >
                  {t("currency.uzs", "сум")}
                </InputRightElement>
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
  );
};

export default PriceContactSection;