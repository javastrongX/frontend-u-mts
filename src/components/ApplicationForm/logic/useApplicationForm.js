import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Move constants to separate file for better organization
import {
  PROFESSIONS,
  WORK_LOCATIONS,
  MARKA_FOR_REPAIR,
  PROFESSION_BY_MARKA,
  PART_MANUFACTURER_BY_PROFESSION,
  TECH_TYPES,
  MARKA_BY_TECH_TYPES,
  CATEGORY_BY_MARKA,
  MODEL_BY_MARKA,
  COUNTRIES,
  CITIES_BY_COUNTRY,
  FUEL_TYPES,
  DATE_OF_RELEASE,
  COUNTRY_BY_CATEGORY,
  INITIAL_FORM_DATA,
  REQUIRED_FIELDS_CONFIG
} from './constants/formConstants';

export const useApplicationForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  // Core state
  const [selectedType, setSelectedType] = useState("purchase");
  const [files, setFiles] = useState([]);
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => ({ ...INITIAL_FORM_DATA }));

  // Phone management
  const nextIdRef = useRef(1);
  const generateUniqueId = useCallback(() => nextIdRef.current++, []);
  const [phoneNumbers, setPhoneNumbers] = useState(() => [
    { id: generateUniqueId(), value: "" },
  ]);

  const fieldRefs = useRef({});

  // Memoized configurations
  const resetMap = useMemo(() => ({
    country: "city",
    techType: "marka",
    marka: selectedType === "parts" ? "partsCategory" : "model",
    model: "countriesbymodel",
    partsCategory: "countriesbycategory",
    markaForRepair: ["profession", "partmanifacturer"],
    profession: "partmanifacturer",
  }), [selectedType]);

  const countryByModel = useMemo(() => 
    Object.values(MODEL_BY_MARKA)
      .flat()
      .reduce((acc, model) => {
        acc[model.value] = COUNTRIES;
        return acc;
      }, {}), []
  );

  // Utility functions
  const formatInputNumber = useCallback((value) => {
    if (!value) return "";
    const digitsOnly = value.replace(/\D/g, "");
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }, []);

  const unformatInputNumber = useCallback((value) => {
    if (!value) return "";
    return value.replace(/\s/g, "");
  }, []);

  const getAvailableOptions = useCallback((key, map) => {
    const selected = formData[key];
    if (!selected) return [];

    if (Array.isArray(selected)) {
      if (selected.length === 0) return [];
      const allOptions = selected.flatMap((value) => map[value] || []);
      return allOptions.filter(
        (option, index, self) =>
          index === self.findIndex((o) => o.value === option.value)
      );
    }

    return map[selected] || [];
  }, [formData]);

  // Validation logic
  const getRequiredFields = useCallback((type) => {
    return REQUIRED_FIELDS_CONFIG[type] || [
      "title", "techType", "description", "contact", "phone", "country", "city"
    ];
  }, []);

  const validateForm = useCallback(() => {
    const requiredFields = getRequiredFields(selectedType);
    const emptyFields = [];
    let firstEmptyField = null;

    // Check main required fields
    for (const field of requiredFields) {
      const fieldValue = formData[field];
      const isEmpty = Array.isArray(fieldValue)
        ? fieldValue.length === 0
        : !fieldValue || fieldValue.trim() === "";

      if (isEmpty) {
        emptyFields.push(field);
        if (!firstEmptyField) firstEmptyField = field;
      }
    }

    // Check price-related fields
    if (!formData.isNegotiable) {
      if (!formData.price || formData.price.trim() === "") {
        emptyFields.push("price");
        if (!firstEmptyField) firstEmptyField = "price";
      }

      if (selectedType === "rent" && (!formData.hourlyRate || formData.hourlyRate.trim() === "")) {
        emptyFields.push("hourlyRate");
        if (!firstEmptyField) firstEmptyField = "hourlyRate";
      }
    }

    return {
      isValid: emptyFields.length === 0,
      emptyFields,
      firstEmptyField,
    };
  }, [formData, selectedType, getRequiredFields]);

  const hasError = useCallback((fieldName) => {
    const validation = validateForm();
    return validation.emptyFields.includes(fieldName);
  }, [validateForm]);

  const getInputStyles = useCallback((fieldName) => ({
    borderColor: hasError(fieldName) ? "red.300" : "gray.200",
    _focus: {
      borderColor: hasError(fieldName) ? "red.400" : "blue.400",
      boxShadow: `0 0 0 3px ${
        hasError(fieldName)
          ? "rgba(245, 101, 101, 0.1)"
          : "rgba(66, 153, 225, 0.1)"
      }`,
      bg: "white",
    },
    _hover: {
      borderColor: hasError(fieldName) ? "red.300" : "gray.300",
    },
  }), [hasError]);

  // Phone number management
  const syncPhoneNumbers = useCallback(() => {
    const allPhones = phoneNumbers
      .map((phone) => phone.value || "")
      .filter((phone) => phone.trim() !== "");
    
    setFormData((prevData) => ({
      ...prevData,
      phone: allPhones.join(", "),
    }));
  }, [phoneNumbers]);

  const addPhoneNumber = useCallback(() => {
    if (phoneNumbers.length < 20) {
      setPhoneNumbers((prev) => [...prev, { id: generateUniqueId(), value: "" }]);
    }
  }, [phoneNumbers.length, generateUniqueId]);

  const removePhoneNumber = useCallback((id) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers((prev) => prev.filter((phone) => phone.id !== id));
      setTimeout(() => syncPhoneNumbers(), 0);
    }
  }, [phoneNumbers.length, syncPhoneNumbers]);

  const updatePhoneNumber = useCallback((id, value) => {
    setPhoneNumbers((prev) => 
      prev.map((phone) => phone.id === id ? { ...phone, value: value || "" } : phone)
    );
    setTimeout(() => syncPhoneNumbers(), 0);
  }, [syncPhoneNumbers]);

  // Form handlers
  const handleInputChange = useCallback((field, value) => {
    console.log(field, value);
    setFormData((prev) => {
      if (prev[field] === value) return prev;
      const updated = { ...prev };
      if (Array.isArray(value)) {
        updated[field] = value;
      } else if (field === "isNegotiable") {
        updated[field] = Boolean(value);
      } else {
        updated[field] = value ? String(value) : "";
      }

      // Reset child fields
      const childField = resetMap[field];
      if (childField) {
        const shouldReset = Array.isArray(updated[field])
          ? updated[field].length === 0
          : !updated[field];

        if (shouldReset) {
          if (Array.isArray(childField)) {
            childField.forEach((child) => {
              updated[child] = ["marka", "model", "profession", "partmanifacturer"].includes(child) ? [] : "";
            });
          } else {
            updated[childField] = ["marka", "model", "profession", "partmanifacturer"].includes(childField) ? [] : "";
          }
        }
      }

      // Handle price clearing and number formatting
      if (field === "isNegotiable" && value === true) {
        updated.price = "";
        updated.hourlyRate = "";
      } else if (["minOrderTime", "mileage", "hourlyRate", "price", "experience"].includes(field)) {
        updated[field] = formatInputNumber(value);
      }

      return updated;
    });
  }, [formatInputNumber, resetMap]);

  // File handling
  const handleFileChange = useCallback((newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleFileRemove = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Focus management
  const focusInvalidField = useCallback((fieldName) => {
    const fieldRef = fieldRefs.current[fieldName];
    if (fieldRef) {
      fieldRef.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        if (fieldRef.focus) {
          fieldRef.focus();
        } else if (fieldRef.querySelector) {
          const focusable = fieldRef.querySelector("input, select, textarea, button");
          if (focusable) focusable.focus();
        }
      }, 500);
    }
  }, []);

  // Form submission
  const handleSubmit = useCallback(async () => {
    const validation = validateForm();

    if (!validation.isValid) {
      if (validation.firstEmptyField) {
        focusInvalidField(validation.firstEmptyField);
      }
      toast({
        title: t("useOrderForm.fill_form", "Заполните форму!"),
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requiredFields = getRequiredFields(selectedType);
      const filteredFormData = {
        type: selectedType,
        files: files,
        timestamp: new Date().toISOString(),
      };

      // Add required fields
      requiredFields.forEach((field) => {
        const fieldValue = formData[field];
        if (fieldValue !== undefined && fieldValue !== "" && 
            !(Array.isArray(fieldValue) && fieldValue.length === 0)) {
          filteredFormData[field] = fieldValue;
        }
      });

      // Handle special number fields
      if (requiredFields.includes('mileage')) {
        filteredFormData.mileage = unformatInputNumber(formData.mileage);
      } else if (requiredFields.includes('experience')) {
        filteredFormData.experience = unformatInputNumber(formData.experience);
      }

      // Add price fields if not negotiable
      if (!formData.isNegotiable) {
        if (formData.price && formData.price.trim() !== "") {
          filteredFormData.price = unformatInputNumber(formData.price);
        }
        if (selectedType === "rent" && formData.hourlyRate && formData.hourlyRate.trim() !== "") {
          filteredFormData.hourlyRate = unformatInputNumber(formData.hourlyRate);
        }
      } else {
        filteredFormData.isNegotiable = formData.isNegotiable;
      }
      console.log(filteredFormData)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: t("useOrderForm.succes_print", "Заказ успешно создан! 🎉"),
        description: t("useOrderForm.succes_print_desc", "Ваш заказ опубликован."),
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      // Reset form
      setFormData({ ...INITIAL_FORM_DATA });
      setFiles([]);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: t("orderlist.error", "Произошла ошибка!"),
        description: t("useOrderForm.error_sending", "Произошла ошибка при отправке заказа. Попробуйте еще раз."),
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, focusInvalidField, toast, getRequiredFields, selectedType, files, formData, t, unformatInputNumber]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Edit mode initialization
  const initializeEditMode = useCallback((editData, category) => {
    if (editData && Object.keys(editData).length > 0) {
      const { files: editFiles, ...cleanEditData } = editData;
      
      setFormData(cleanEditData);
      setFiles(editFiles || []);
      setSelectedType(category);

      // Set phone numbers
      if (cleanEditData.phone) {
        const phones = cleanEditData.phone
          .split(/[,;]+/)
          .map(phone => phone.trim())
          .filter(phone => phone.length > 0);
        if (phones.length > 0) {
          setPhoneNumbers(phones.map((phone) => ({ id: generateUniqueId(), value: phone })));
        }
      } else {
        setPhoneNumbers([{ id: generateUniqueId(), value: "" }]);
      }
    }
  }, [generateUniqueId]);

  // Progress calculation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const requiredFields = getRequiredFields(selectedType);
      let totalRequiredFields = requiredFields.length;

      if (!formData.isNegotiable) {
        totalRequiredFields += 1;
        if (selectedType === "rent") totalRequiredFields += 1;
      }

      setTotalSteps(totalRequiredFields);

      let filledCount = 0;

      // Count filled required fields
      for (const field of requiredFields) {
        const fieldValue = formData[field];
        const isFilled = Array.isArray(fieldValue) ? fieldValue.length > 0 : fieldValue && fieldValue.trim() !== "";
        if (isFilled) filledCount++;
      }

      // Count price fields
      if (formData.isNegotiable) {
        filledCount += 1;
        if (selectedType === "rent") filledCount += 1;
      } else {
        if (formData.price && formData.price.trim() !== "") filledCount++;
        if (selectedType === "rent" && formData.hourlyRate && formData.hourlyRate.trim() !== "") filledCount++;
      }

      setStep(Math.min(filledCount, totalRequiredFields));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formData, selectedType, getRequiredFields]);

  // Computed values
  const availableCities = useMemo(() => getAvailableOptions("country", CITIES_BY_COUNTRY), [getAvailableOptions]);
  const availableMarka = useMemo(() => getAvailableOptions("techType", MARKA_BY_TECH_TYPES), [getAvailableOptions]);
  const availableModel = useMemo(() => getAvailableOptions("marka", MODEL_BY_MARKA), [getAvailableOptions]);
  const availablePartsCategory = useMemo(() => getAvailableOptions("marka", CATEGORY_BY_MARKA), [getAvailableOptions]);
  
  const availableCountriesByCategory = useMemo(() => {
    if (selectedType === "parts" && formData.partsCategory) {
      return COUNTRY_BY_CATEGORY[formData.partsCategory] || [];
    }
    return [];
  }, [selectedType, formData.partsCategory]);

  const availableProfessionByMarka = useMemo(() => {
    if (selectedType === "repair" && formData.markaForRepair) {
      if (Array.isArray(formData.markaForRepair)) {
        if (formData.markaForRepair.length > 0) {
          const allProfessions = formData.markaForRepair.flatMap(
            (markaValue) => PROFESSION_BY_MARKA[markaValue] || []
          );
          return allProfessions.filter(
            (profession, index, self) =>
              index === self.findIndex((p) => p.value === profession.value)
          );
        }
        return [];
      }
      return PROFESSION_BY_MARKA[formData.markaForRepair] || [];
    }
    return [];
  }, [selectedType, formData.markaForRepair]);

  const availablePartManufacturerByProfession = useMemo(() => {
    if (selectedType === "repair" && formData.profession && formData.profession.length > 0) {
      const allManufacturers = formData.profession.flatMap(
        (prof) => PART_MANUFACTURER_BY_PROFESSION[prof] || []
      );
      return allManufacturers.filter(
        (manufacturer, index, self) =>
          index === self.findIndex((m) => m.value === manufacturer.value)
      );
    }
    return [];
  }, [selectedType, formData.profession]);

  const availableCountry = useMemo(() => {
    if (selectedType === "parts") {
      return availableCountriesByCategory;
    }
    return getAvailableOptions("model", countryByModel);
  }, [selectedType, availableCountriesByCategory, getAvailableOptions, countryByModel]);

  const validation = useMemo(() => validateForm(), [validateForm]);

  return {
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
    setPhoneNumbers,

    // Constants
    techTypes: TECH_TYPES,
    countries: COUNTRIES,
    fuelTypes: FUEL_TYPES,
    dateOfRelease: DATE_OF_RELEASE,
    availableMarkaForRepair: MARKA_FOR_REPAIR,
    availableProfession: PROFESSIONS,
    workPlace: WORK_LOCATIONS,

    // Computed values
    availableCities,
    availableMarka,
    availableModel,
    availableCountry,
    availablePartsCategory,
    availableCountriesByCategory,
    availableProfessionByMarka,
    availablePartManufacturerByProfession,

    // Validation
    isFormValid: validation.isValid,
    emptyFields: validation.emptyFields,

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

    // Utils
    getRequiredFields,
    focusInvalidField,
    generateUniqueId,
  };
};