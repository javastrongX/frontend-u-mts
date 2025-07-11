import React, { useState, useId } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Card,
  CardBody,
  Divider,
  Heading,
  useColorModeValue,
  ScaleFade,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiUser,
  FiTruck,
  FiSettings,
  FiCreditCard,
  FiClock,
} from "react-icons/fi";
import { BiBarcode } from "react-icons/bi";
import { MdWorkOutline } from "react-icons/md";

import { OrderHeader } from "../OrderForm/OrderHeader";
import { OrderTypeSelector } from "../OrderForm/OrderTypeSelector";
import { FileUpload } from "../OrderForm/FileUpload";
import { useTranslation } from "react-i18next";
import { useApplicationForm } from "./logic/useApplicationForm";
import OptimizedFormSection from "./OptimizedFormSection";
import ConditionRadio from "../Ads_component/ConditionRadio";
import DescriptionWithTags from "./DescriptionWithTags";
import { FormControlWrapper, FormFieldWithRef, OptimizedInput } from "./CustomComponent/FormControlWrapper";
import { useHandleChangesConf } from "./hooks/useHandleChangesConf";
import ActionButtonPublic from "./CustomComponent/ActionButtonPublic";
import PriceContactSection from "./CustomComponent/PriceContactSection";

// Edit mode hook va components
import useEditMode from "./hooks/useEditMode";
import LoadingSpinner from "./CustomComponent/LoadingSpinner";
import ErrorDisplay from "./CustomComponent/ErrorDisplay";

const ApplicationForm = () => {
  const { t } = useTranslation();
  const generatedId = useId();

  const {
    // Edit Mode
    initializeEditMode,
    
    // State
    selectedType,
    setSelectedType,
    files,
    setFiles,
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
    handleSubmit,
    handleBack,
    hasError,
    getInputStyles,
    
    // Phone handlers
    addPhoneNumber,
    removePhoneNumber,
    updatePhoneNumber,
  } = useApplicationForm();

  // Edit mode hook
  const {
    isEditPage,
    editData,
    isLoading,
    error,
    getDisabledFields,
    refetchData
  } = useEditMode(initializeEditMode);

  // Handle changes configuration
  const {
    handleTypeChange,
    handleTitleChange,
    handlePartNumberChange,
    handleExperienceChange,
    handleMinOrderTimeChange,
    handleMileageChange,
    handleContactChange,
    handlePriceChange,
    handleHourlyRateChange,
    handleNegotiableChange,
    handleDescriptionChange,
    handleCountryChange,
    handleCityChange,
    showPartsTitle,
    showPartsPartNumber,
    showExperience,
    showRentFields,
    showMileage,
    showHourlyRate
  } = useHandleChangesConf({
    handleInputChange, 
    selectedType, 
    setSelectedType, 
    setFormData
  });

  // Responsive values
  const cardBg = useColorModeValue("white", "gray.800");
  const iconSize = useBreakpointValue({ base: 16, md: 20 });
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
  const actionButtonDirection = useBreakpointValue({
    base: "column",
    md: "row",
  });
  const actionButtonSpacing = useBreakpointValue({ base: 4, md: 0 });

  // Loading state
  if (isEditPage && isLoading) {
    return (
      <LoadingSpinner 
        message={t("Orderform.form.attachments.loading", "Загрузка...")} 
        py={10}
      />
    );
  }

  // Error state
  if (isEditPage && error) {
    return (
      <ErrorDisplay 
        error={error}
        onRetry={refetchData}
        title={t("ApplicationForm.errors.error_occurred", "Произошла ошибка")}
        py={10}
      />
    );
  }

  return (
    <Box maxW={containerMaxW} py={{ base: 4, md: 8 }} mb={{base: "100px", custom570: 0}}>
      <OrderHeader 
        onBack={handleBack} 
        step={step} 
        totalSteps={totalSteps} 
        isEditMode={isEditPage} 
      />
      
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
                  (<Text as="span" color="red.500">*</Text>) 
                  {t("ApplicationForm.form.marked_field", "Обязательные для заполнения поля")}
                </Text>
              </VStack>
            </HStack>

            <Divider/>

            {/* Title */}
            {showPartsTitle && !isEditPage && (
              <ScaleFade in={true}>
                <FormControlWrapper
                  fieldName="title"
                  label={t("ApplicationForm.form.order_name", "Заголовок")}
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
              disabledFields={getDisabledFields(editData?.category)}
            />

            {/* partNumber */}
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

            {/* Experience */}
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

            {/* Rent Fields */}
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

                <FormControlWrapper
                  fieldName="haveDriver"
                  hasError={hasError}
                  fieldRefs={fieldRefs}
                >
                  <FormFieldWithRef fieldName="haveDriver" fieldRefs={fieldRefs}>
                    <ConditionRadio
                      value={formData.haveDriver}
                      setValue={(value) => handleInputChange("haveDriver", value)}
                      icon={FiUser}
                      value1="yes"
                      value2="no"
                      title={t("ApplicationForm.form.haveDriver", "С оператором (водитель)")}
                      label1={t("ApplicationForm.form.yes", "Да")}
                      label2={t("ApplicationForm.form.no", "Нет")}
                    />
                  </FormFieldWithRef>
                </FormControlWrapper>
              </>
            )}

            {/* Purchase and Parts specific fields */}
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

                <FormControlWrapper
                  fieldName="condition"
                  hasError={hasError}
                  fieldRefs={fieldRefs}
                >
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
            <PriceContactSection
              formData={formData}
              selectedType={selectedType}
              handlePriceChange={handlePriceChange}
              handleHourlyRateChange={handleHourlyRateChange}
              handleNegotiableChange={handleNegotiableChange}
              handleContactChange={handleContactChange}
              handleCountryChange={handleCountryChange}
              handleCityChange={handleCityChange}
              phoneNumbers={phoneNumbers}
              addPhoneNumber={addPhoneNumber}
              removePhoneNumber={removePhoneNumber}
              updatePhoneNumber={updatePhoneNumber}
              countries={countries}
              availableCities={availableCities}
              hasError={hasError}
              getInputStyles={getInputStyles}
              fieldRefs={fieldRefs}
              showHourlyRate={showHourlyRate}
            />

            <Divider />

            {/* File Upload */}
            <FileUpload
              files={files}
              setFiles={setFiles}
              isEditPage={isEditPage}
            />

            {/* Action Buttons */}
            <ActionButtonPublic 
              handleBack={handleBack} 
              actionButtonDirection={actionButtonDirection} 
              actionButtonSpacing={actionButtonSpacing} 
              buttonSize={buttonSize} 
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit}
              isFormValid={isFormValid}
            />
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ApplicationForm;