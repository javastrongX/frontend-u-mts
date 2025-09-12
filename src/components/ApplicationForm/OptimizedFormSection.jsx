import React, { useMemo, useEffect, useCallback } from "react";
import {
  FormControl,
  FormLabel,
  Text,
  HStack,
  ScaleFade,
  useBreakpointValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FiSettings, FiPackage, FiMapPin, FiCalendar } from "react-icons/fi";
import { FaGasPump } from "react-icons/fa";
import { TbEngine, TbTool } from "react-icons/tb";
import { BiMapPin } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { SearchableSelect } from "../OrderForm/SearchableSelect";
import { useLocation } from "react-router-dom";

// Constants
const VALID_FORM_TYPES = ["purchase", "rent", "parts", "repair", "driver"];

const FIELD_ICONS = {
  techType: FiSettings,
  marka: FiPackage,
  markaForRepair: FiPackage,
  model: TbEngine,
  profession: TbTool,
  partsCategory: TbTool,
  countriesbycategory: FiMapPin,
  countriesbymodel: FiMapPin,
  fuelType: FaGasPump,
  releaseDate: FiCalendar,
  partmanifacturer: FiSettings,
  workLocation: BiMapPin,
};

// Helper function for field value management
const getFieldValue = (fieldId, formData, editData, isEditPage, isMultiple = false) => {
  const formValue = formData[fieldId];
  const hasValidFormValue = formValue !== undefined && 
    formValue !== "" && 
    !(Array.isArray(formValue) && formValue.length === 0);
  
  if (hasValidFormValue) return formValue;
  if (isEditPage && editData?.[fieldId] !== undefined) return editData[fieldId];
  return isMultiple ? [] : "";
};

// Custom hook for field labels
const useFieldLabels = (selectedType) => {
  const { t } = useTranslation();
  
  return useMemo(() => ({
    techType: selectedType === "driver"
      ? t("ApplicationForm.form.driver_title", "Какую технику вы умеете водить?")
      : selectedType === "parts" 
      ? t("ApplicationForm.form.spare_parts_title", "Выберите тип техники") 
      : `${t("ApplicationForm.form.order_type", "Какие устройства вы сдаёте в")} ${
          selectedType === "rent"
            ? t("ApplicationForm.form.rent", "сдать в аренду?")
            : t("ApplicationForm.form.sell", "продать?")
        }`,
    marka: selectedType === "parts" 
      ? t("ApplicationForm.form.select_marka_parts", "Выберите марку техники для которой предназначена запчасть.") 
      : t("ApplicationForm.form.select_marka", "Выберите марку"),
    markaForRepair: t("ApplicationForm.form.select_marka", "Выберите марку"),
    model: t("ApplicationForm.form.select_model", "Выберите модель"),
    profession: t("ApplicationForm.form.select_specialization", "Выберите специализацию"),
    partsCategory: t("ApplicationForm.form.select_category", "Выберите рубрику"),
    countriesbycategory: t("ApplicationForm.form.location_of_release", "Выберите страну производителя"),
    countriesbymodel: t("ApplicationForm.form.location_of_release", "Выберите страну производителя"),
    fuelType: t("ApplicationForm.form.fuel_type", "Тип топлива"),
    releaseDate: t("ApplicationForm.form.date_of_release", "Дата выпуска"),
    partmanifacturer: t("ApplicationForm.form.experience", "С каким производителем запчастей вы работали?"),
    workLocation: t("ApplicationForm.form.select_doing", "Выполняет работу:"),
  }), [selectedType, t]);
};

// Custom hook for field placeholders
const useFieldPlaceholders = () => {
  const { t } = useTranslation();
  
  return useMemo(() => ({
    techType: t("ApplicationForm.form.select_type", "Выберите тип"),
    marka: t("ApplicationForm.form.select_marka", "Выберите марку"),
    markaForRepair: t("ApplicationForm.form.select_marka", "Выберите марку"),
    model: t("ApplicationForm.form.select_model", "Выберите модель"),
    profession: t("ApplicationForm.form.select_specialization", "Выберите специализацию"),
    partsCategory: t("ApplicationForm.form.select_category", "Выберите рубрику"),
    countriesbycategory: t("ApplicationForm.form.location.country", "Выберите страну"),
    countriesbymodel: t("ApplicationForm.form.location.country", "Выберите страну"),
    fuelType: t("ApplicationForm.form.select", "Выберите"),
    releaseDate: t("ApplicationForm.form.select", "Выберите дату"),
    partmanifacturer: t("ApplicationForm.form.select_experience", "Выберите подходящие вам специальности"),
    workLocation: t("ApplicationForm.form.select", "Выберите"),
  }), [t]);
};

// Field configuration hook
const useFormFieldsConfig = (selectedType, formData, editData, isEditPage, options) => {
  const fieldLabels = useFieldLabels(selectedType);
  const fieldPlaceholders = useFieldPlaceholders();
  
  const {
    techTypes = [],
    availableMarka = [],
    availableModel = [],
    availablePartsCategory = [],
    availableCountry = [],
    fuel_type = [],
    date_of_release = [],
    availableMarkaForRepair = [],
    availableProfessionByMarka = [],
    availablePartManufacturerByProfession = [],
    workPlace = [],
  } = options;

  return useMemo(() => {
    const baseFields = [
      {
        id: "techType",
        icon: FIELD_ICONS.techType,
        label: fieldLabels.techType,
        placeholder: fieldPlaceholders.techType,
        options: techTypes,
        showFor: ["purchase", "rent", "parts", "driver"],
        multipleSelect: ["driver", "parts"].includes(selectedType),
      },
      {
        id: "marka",
        icon: FIELD_ICONS.marka,
        label: fieldLabels.marka,
        placeholder: fieldPlaceholders.marka,
        options: availableMarka,
        showFor: ["purchase", "rent", "parts"],
        multipleSelect: selectedType === "parts",
      },
      {
        id: "markaForRepair",
        icon: FIELD_ICONS.markaForRepair,
        label: fieldLabels.markaForRepair,
        placeholder: fieldPlaceholders.markaForRepair,
        options: availableMarkaForRepair,
        showFor: ["repair"],
        multipleSelect: true,
      },
      {
        id: "model",
        icon: selectedType === "purchase" ? TbEngine : TbTool,
        label: fieldLabels.model,
        placeholder: fieldPlaceholders.model,
        options: availableModel,
        showFor: ["purchase", "rent"],
        multipleSelect: false,
      },
      {
        id: "profession",
        icon: FIELD_ICONS.profession,
        label: fieldLabels.profession,
        placeholder: fieldPlaceholders.profession,
        options: availableProfessionByMarka,
        showFor: ["repair"],
        multipleSelect: true,
      },
      {
        id: "partsCategory",
        icon: selectedType === "purchase" ? TbEngine : TbTool,
        label: fieldLabels.partsCategory,
        placeholder: fieldPlaceholders.partsCategory,
        options: availablePartsCategory,
        showFor: ["parts"],
        multipleSelect: false,
      },
      {
        id: selectedType === "parts" ? "countriesbycategory" : "countriesbymodel",
        icon: FiMapPin,
        label: selectedType === "parts" ? fieldLabels.countriesbycategory : fieldLabels.countriesbymodel,
        placeholder: selectedType === "parts" ? fieldPlaceholders.countriesbycategory : fieldPlaceholders.countriesbymodel,
        options: availableCountry,
        showFor: ["purchase", "parts"],
        multipleSelect: false,
      },
      {
        id: "fuelType",
        icon: FIELD_ICONS.fuelType,
        label: fieldLabels.fuelType,
        placeholder: fieldPlaceholders.fuelType,
        options: fuel_type,
        showFor: ["purchase"],
        multipleSelect: false,
      },
      {
        id: "releaseDate",
        icon: FIELD_ICONS.releaseDate,
        label: fieldLabels.releaseDate,
        placeholder: fieldPlaceholders.releaseDate,
        options: date_of_release,
        showFor: ["purchase", "rent"],
        multipleSelect: false,
      },
      {
        id: "partmanifacturer",
        icon: FIELD_ICONS.partmanifacturer,
        label: fieldLabels.partmanifacturer,
        placeholder: fieldPlaceholders.partmanifacturer,
        options: availablePartManufacturerByProfession,
        showFor: ["repair"],
        multipleSelect: true,
      },
      {
        id: "workLocation",
        icon: FIELD_ICONS.workLocation,
        label: fieldLabels.workLocation,
        placeholder: fieldPlaceholders.workLocation,
        options: workPlace,
        showFor: ["repair"],
        multipleSelect: false,
      },
    ];

    return baseFields
      .filter((field) => field.showFor.includes(selectedType))
      .map((field) => ({
        ...field,
        key: field.id,
        value: getFieldValue(field.id, formData, editData, isEditPage, field.multipleSelect),
      }));
  }, [
    selectedType,
    formData,
    editData,
    isEditPage,
    fieldLabels,
    fieldPlaceholders,
    techTypes,
    availableMarka,
    availableModel,
    availablePartsCategory,
    availableCountry,
    fuel_type,
    date_of_release,
    availableMarkaForRepair,
    availableProfessionByMarka,
    availablePartManufacturerByProfession,
    workPlace,
  ]);
};

// Individual FormField Component
const FormField = React.memo(({
  field,
  index,
  onFieldChange,
  isInvalid,
  isDisabled,
  iconSize,
  inputSize,
  id,
  name,
  t,
}) => (
  <ScaleFade key={field.key} in={true} delay={0.1 * (index + 1)}>
    <FormControl 
      isRequired 
      isInvalid={isInvalid}
      isDisabled={isDisabled}
    >
      <FormLabel
        fontWeight="bold"
        color="gray.700"
        mb={3}
        display="flex"
        flexDir="row"
        alignItems="flex-start"
        fontSize={{ base: "sm", md: "md" }}
        htmlFor={`${id}-${field.id}-${index}`}
      >
        <HStack spacing={{ base: 2, md: 3 }}>
          <field.icon color="#3182CE" size={iconSize} />
          <Text>{field.label}</Text>
        </HStack>
      </FormLabel>

      <SearchableSelect
        multipleSelect={field.multipleSelect}
        placeholder={field.placeholder}
        value={field.value}
        onChange={(value) => onFieldChange(field.id, value)}
        options={field.options}
        size={inputSize}
        borderRadius={{ base: "lg", md: "xl" }}
        bg="gray.50"
        border="2px solid"
        borderColor="gray.200"
        fontSize={{ base: "sm", md: "md" }}
        transition="all 0.2s"
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        _focus={{
          borderColor: isInvalid ? "red.400" : "blue.400",
          boxShadow: `0 0 0 3px ${
            isInvalid
              ? "rgba(245, 101, 101, 0.1)"
              : "rgba(66, 153, 225, 0.1)"
          }`,
          bg: "white",
        }}
        _hover={{
          borderColor: isInvalid ? "red.300" : "gray.300",
        }}
        id={`${id}-${field.id}-${index}`}
        name={name}
      />

      {isInvalid && (
        <FormErrorMessage>
          {t("ApplicationForm.form.field_haveTo_fill", "Это поле обязательно для заполнения.")}
        </FormErrorMessage>
      )}
    </FormControl>
  </ScaleFade>
));

FormField.displayName = 'FormField';

// Main Component
const OptimizedFormSection = ({
  selectedType,
  formData = {},
  handleInputChange,
  techTypes = [],
  availableMarka = [],
  availableModel = [],
  availablePartsCategory = [],
  countries = [],
  fuel_type = [],
  date_of_release = [],
  availableCountry = [],
  FormFieldWithRef,
  fieldRefs,
  hasError,
  availableMarkaForRepair = [],
  availableProfessionByMarka = [],
  availablePartManufacturerByProfession = [],
  workPlace = [],
  id,
  name,
  disabledFields = [],
}) => {
  const iconSize = useBreakpointValue({ base: "16px", md: "20px" });
  const inputSize = useBreakpointValue({ base: "md", md: "lg" });
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isEditPage = pathname.startsWith('/edit');

  // Memoize editData to prevent unnecessary re-renders
  const editData = useMemo(() => formData, [formData]);

  // Options object for cleaner prop passing
  const options = useMemo(() => ({
    techTypes,
    availableMarka,
    availableModel,
    availablePartsCategory,
    availableCountry,
    fuel_type,
    date_of_release,
    availableMarkaForRepair,
    availableProfessionByMarka,
    availablePartManufacturerByProfession,
    workPlace,
  }), [
    techTypes,
    availableMarka,
    availableModel,
    availablePartsCategory,
    availableCountry,
    fuel_type,
    date_of_release,
    availableMarkaForRepair,
    availableProfessionByMarka,
    availablePartManufacturerByProfession,
    workPlace,
  ]);

  // Get form fields configuration
  const formFields = useFormFieldsConfig(selectedType, formData, editData, isEditPage, options);

  // Optimized edit data loading effect
  useEffect(() => {
    if (!isEditPage || !editData || Object.keys(editData).length === 0) return;
    if (!handleInputChange || typeof handleInputChange !== 'function') return;

    const fieldsToUpdate = Object.keys(editData).filter(fieldId => {
      const editValue = editData[fieldId];
      const currentValue = formData[fieldId];
      
      if (editValue === undefined) return false;
      if (currentValue !== undefined && currentValue !== "" && 
          !(Array.isArray(currentValue) && currentValue.length === 0)) return false;
      
      return true;
    });

    fieldsToUpdate.forEach(fieldId => {
      try {
        handleInputChange(fieldId, editData[fieldId]);
      } catch (error) {
        console.error(`Error updating field ${fieldId}:`, error);
      }
    });
  }, [isEditPage, editData, handleInputChange]); 

  // Optimized field change handler
  const handleFieldChange = useCallback((fieldId, value) => {
    try {
      if (handleInputChange && typeof handleInputChange === 'function') {
        handleInputChange(fieldId, value);
      }
    } catch (error) {
      console.error(`Error updating field ${fieldId}:`, error);
    }
  }, [handleInputChange]);

  // Optimized validation functions
  const isFieldInvalid = useCallback((fieldId) => {
    return hasError && typeof hasError === 'function' ? hasError(fieldId) : false;
  }, [hasError]);

  const isFieldDisabled = useCallback((fieldId) => {
    return disabledFields.includes(fieldId);
  }, [disabledFields]);

  // Early returns for invalid states
  if (!VALID_FORM_TYPES.includes(selectedType)) {
    return null;
  }

  if (formFields.length === 0) {
    return null;
  }

  return (
    <>
      {formFields.map((field, index) => (
        <FormFieldWithRef key={field.key} fieldName={field.id} fieldRefs={fieldRefs}>
          <FormField
            field={field}
            index={index}
            onFieldChange={handleFieldChange}
            isInvalid={isFieldInvalid(field.id)}
            isDisabled={isFieldDisabled(field.id)}
            iconSize={iconSize}
            inputSize={inputSize}
            id={id}
            name={name}
            t={t}
          />
        </FormFieldWithRef>
      ))}
    </>
  );
};

export default React.memo(OptimizedFormSection);