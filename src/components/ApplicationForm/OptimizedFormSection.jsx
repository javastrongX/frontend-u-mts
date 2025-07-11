import React, { useMemo, useEffect } from "react";
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
  const editData = formData;
  const iconSize = useBreakpointValue({ base: "16px", md: "20px" });
  const inputSize = useBreakpointValue({ base: "md", md: "lg" });
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isEditPage = pathname.startsWith('/edit')

  // Valid form types
  const validTypes = ["purchase", "rent", "parts", "repair", "driver"];

  // Edit ma'lumotlarini faqat bir marta yuklash uchun useEffect
  useEffect(() => {
    if (isEditPage && editData && Object.keys(editData).length > 0) {
      // Faqat editData mavjud bo'lsa va formData bo'sh bo'lsa ma'lumotlarni yuklash
      Object.keys(editData).forEach(fieldId => {
        if (editData[fieldId] !== undefined && 
            (formData[fieldId] === undefined || formData[fieldId] === "" || 
             (Array.isArray(formData[fieldId]) && formData[fieldId].length === 0))) {
          handleInputChange(fieldId, editData[fieldId]);
        }
      });
    }
  }, [isEditPage, editData, handleInputChange]); 

  // Form fieldlari konfiguratsiyasi
  const formFields = useMemo(() => {
    if (!validTypes.includes(selectedType)) {
      return [];
    }

    // Bu funksiya faqat qiymatni qaytaradi, state ni o'zgartirmaydi
    const getFieldValue = (fieldId, isMultiple = false) => {
      // Avval formData dan qiymatni olishga harakat qilamiz
      const formValue = formData[fieldId];
      
      // Agar formData da qiymat bo'lsa, uni qaytaramiz
      if (formValue !== undefined && formValue !== "" && 
          !(Array.isArray(formValue) && formValue.length === 0)) {
        return formValue;
      }
      
      // Agar edit page bo'lsa va editData da qiymat bo'lsa
      if (isEditPage && editData[fieldId] !== undefined) {
        return editData[fieldId];
      }
      
      // Default qiymat
      return isMultiple ? [] : "";
    };

    const baseFields = [
      {
        id: "techType",
        icon: FiSettings,
        label:
          selectedType === "driver"
            ? t("ApplicationForm.form.driver_title", "Какую технику вы умеете водить?")
            : selectedType === "parts" ? t("ApplicationForm.form.spare_parts_title", "Выберите тип техники") 
            : `${t(
                "ApplicationForm.form.order_type",
                "Какие устройства вы сдаёте в"
              )} ${
                selectedType === "rent"
                  ? t("ApplicationForm.form.rent", "сдать в аренду?")
                  : t("ApplicationForm.form.sell", "продать?")
              }`,
        placeholder: t("ApplicationForm.form.select_type", "Выберите тип"),
        value: getFieldValue("techType", ["driver", "parts"].includes(selectedType)),
        options: techTypes,
        key: "techType",
        showFor: ["purchase", "rent", "parts", "driver"],
        multipleSelect: ["driver", "parts"].includes(selectedType),
      },
      {
        id: "marka",
        icon: FiPackage,
        label: selectedType === "parts" ? t("ApplicationForm.form.select_marka_parts", "Выберите марку техники для которой предназначена запчасть.") : t("ApplicationForm.form.select_marka", "Выберите марку"),
        placeholder: t("ApplicationForm.form.select_marka", "Выберите марку"),
        value: getFieldValue("marka", selectedType === "parts"),
        options: availableMarka,
        key: "marka",
        showFor: ["purchase", "rent", "parts"],
        multipleSelect: selectedType === "parts",
      },
      {
        id: "markaForRepair",
        icon: FiPackage,
        label: t("ApplicationForm.form.select_marka", "Выберите марку"),
        placeholder: t("ApplicationForm.form.select_marka", "Выберите марку"),
        value: getFieldValue("markaForRepair", true),
        options: availableMarkaForRepair,
        key: "markaForRepair",
        showFor: ["repair"],
        multipleSelect: true,
      },
      {
        id: "model",
        icon: selectedType === "purchase" ? TbEngine : TbTool,
        label: t("ApplicationForm.form.select_model", "Выберите модель"),
        placeholder: t("ApplicationForm.form.select_model", "Выберите модель"),
        value: getFieldValue("model"),
        options: availableModel,
        key: "model",
        showFor: ["purchase", "rent"],
        multipleSelect: false,
      },
      {
        id: "profession",
        icon: TbTool,
        label: t(
          "ApplicationForm.form.select_specialization",
          "Выберите специализацию"
        ),
        placeholder: t(
          "ApplicationForm.form.select_specialization",
          "Выберите специализацию"
        ),
        value: getFieldValue("profession", true),
        options: availableProfessionByMarka,
        key: "profession",
        showFor: ["repair"],
        multipleSelect: true,
      },
      {
        id: "partsCategory",
        icon: selectedType === "purchase" ? TbEngine : TbTool,
        label: t("ApplicationForm.form.select_category", "Выберите рубрику"),
        placeholder: t(
          "ApplicationForm.form.select_category",
          "Выберите рубрику"
        ),
        value: getFieldValue("partsCategory"),
        options: availablePartsCategory,
        key: "partsCategory",
        showFor: ["parts"],
        multipleSelect: false,
      },
      {
        id: selectedType === "parts" ? "countriesbycategory" : "countriesbymodel",
        icon: FiMapPin,
        label: t("ApplicationForm.form.location_of_release", "Выберите страну производителя"),
        placeholder: t(
          "ApplicationForm.form.location.country",
          "Выберите страну"
        ),
        value: getFieldValue(
          selectedType === "parts" ? "countriesbycategory" : "countriesbymodel"
        ),
        options: availableCountry,
        key: selectedType === "parts" ? "countriesbycategory" : "countriesbymodel",
        showFor: ["purchase", "parts"],
        multipleSelect: false,
      },
      {
        id: "fuelType",
        icon: FaGasPump,
        label: t("ApplicationForm.form.fuel_type", "Тип топлива"),
        placeholder: t("ApplicationForm.form.select", "Выберите"),
        value: getFieldValue("fuelType"),
        options: fuel_type,
        key: "fuelType",
        showFor: ["purchase"],
        multipleSelect: false,
      },
      {
        id: "releaseDate",
        icon: FiCalendar,
        label: t("ApplicationForm.form.date_of_release", "Дата выпуска"),
        placeholder: t("ApplicationForm.form.select", "Выберите дату"),
        value: getFieldValue("releaseDate"),
        options: date_of_release,
        key: "releaseDate",
        showFor: ["purchase", "rent"],
        multipleSelect: false,
      },
      {
        id: "partmanifacturer",
        icon: FiSettings,
        label: t(
          "ApplicationForm.form.experience",
          "С каким производителем запчастей вы работали?"
        ),
        placeholder: t(
          "ApplicationForm.form.select_experience",
          "Выберите подходящие вам специальности"
        ),
        value: getFieldValue("partmanifacturer", true),
        options: availablePartManufacturerByProfession,
        key: "partmanifacturer",
        showFor: ["repair"],
        multipleSelect: true,
      },
      {
        id: "workLocation",
        icon: BiMapPin,
        label: t("ApplicationForm.form.select_doing", "Выполняет работу:"),
        placeholder: t("ApplicationForm.form.select", "Выберите"),
        value: getFieldValue("workLocation"),
        options: workPlace,
        key: "workLocation",
        showFor: ["repair"],
        multipleSelect: false,
      },
    ];

    return baseFields.filter((field) => field.showFor.includes(selectedType));
  }, [
    selectedType,
    formData,
    editData,
    techTypes,
    availableMarka,
    availableModel,
    availablePartsCategory,
    countries,
    fuel_type,
    date_of_release,
    availableCountry,
    availableMarkaForRepair,
    availableProfessionByMarka,
    availablePartManufacturerByProfession,
    workPlace,
    t,
    validTypes,
    isEditPage
  ]);

  // Agar noto'g'ri selectedType bo'lsa, hech narsa ko'rsatmaslik
  if (!validTypes.includes(selectedType)) {
    return null;
  }

  // Agar fieldlar yo'q bo'lsa, hech narsa ko'rsatmaslik
  if (formFields.length === 0) {
    return null;
  }

  const handleFieldChange = (fieldId, value) => {
    if (handleInputChange && typeof handleInputChange === 'function') {
      handleInputChange(fieldId, value);
    }
  };

  const isFieldInvalid = (fieldId) => {
    return hasError && typeof hasError === 'function' ? hasError(fieldId) : false;
  };

  const isFieldDisabled = (fieldId) => {
    return disabledFields.includes(fieldId);
  };

  return (
    <>
      {formFields.map((field, index) => (
        <ScaleFade key={field.key} in={true} delay={0.1 * (index + 1)}>
          <FormFieldWithRef fieldName={field.id} fieldRefs={fieldRefs}>
            <FormControl 
              isRequired 
              isInvalid={isFieldInvalid(field.id)}
              isDisabled={isFieldDisabled(field.id)}
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
                onChange={(value) => handleFieldChange(field.id, value)}
                options={field.options}
                size={inputSize}
                borderRadius={{ base: "lg", md: "xl" }}
                bg="gray.50"
                border="2px solid"
                borderColor="gray.200"
                fontSize={{ base: "sm", md: "md" }}
                transition="all 0.2s"
                isInvalid={isFieldInvalid(field.id)}
                isDisabled={isFieldDisabled(field.id)}
                _focus={{
                  borderColor: isFieldInvalid(field.id) ? "red.400" : "blue.400",
                  boxShadow: `0 0 0 3px ${
                    isFieldInvalid(field.id)
                      ? "rgba(245, 101, 101, 0.1)"
                      : "rgba(66, 153, 225, 0.1)"
                  }`,
                  bg: "white",
                }}
                _hover={{
                  borderColor: isFieldInvalid(field.id) ? "red.300" : "gray.300",
                }}
                id={`${id}-${field.id}-${index}`}
                name={name}
              />

              {isFieldInvalid(field.id) && (
                <FormErrorMessage>
                  {t("ApplicationForm.form.field_haveTo_fill", "Это поле обязательно для заполнения.")}
                </FormErrorMessage>
              )}
            </FormControl>
          </FormFieldWithRef>
        </ScaleFade>
      ))}
    </>
  );
};

export default OptimizedFormSection;