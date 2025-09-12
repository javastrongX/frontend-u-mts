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
  REQUIRED_FIELDS_CONFIG,
  CURRENCIES
} from './constants/formConstants';
import { fetchPage } from "../../../../BotFetch";

// PHONE CONSTANTS - memoized for performance
const PHONE_REGEX = {
  DIGITS_ONLY: /\D/g,
  UZBEK_PREFIX: /^(?:998|8)/,
  VALID_PHONE: /^998\d{9}$/,
  FORMAT_PATTERN: /(\d{2})(\d{3})(\d{2})(\d{2})$/
};

const PHONE_CONFIG = {
  PREFIX: '+998',
  COUNTRY_CODE: '998',
  MIN_LENGTH: 12, // +998XXXXXXXXX
  MAX_LENGTH: 12,
  MAX_PHONES: 20,
  UZBEK_LENGTH: 9 // 9 digits after 998
};

// OPTIMIZED PHONE UTILITIES - memoized and cached
const PhoneUtils = {
  extractDigits: (value) => {
    if (!value || typeof value !== 'string') return '';
    return value.replace(/\D/g, '');
  },

  normalizePhone: (value) => {
    const digits = PhoneUtils.extractDigits(value);
    if (!digits) return '';
    if (digits.length <= 3) return digits;
    
    if (digits.startsWith('8') && digits.length >= 10) {
      return '998' + digits.substring(1);
    }
    
    if (digits.startsWith('998')) {
      return digits.substring(0, 12);
    }
    
    const withoutPrefix = digits.substring(0, 9);
    return '998' + withoutPrefix;
  },

  formatForDisplay: (value) => {
    if (!value) return '+998';
    const normalized = PhoneUtils.normalizePhone(value);
    if (normalized.length <= 3) return '+998';
    
    const withPlus = '+' + normalized;
    if (normalized.length < 12) return withPlus;
    
    const match = normalized.match(/(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+998 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    return withPlus;
  },

  isValid: (phone) => {
    if (!phone || typeof phone !== 'string') return false;
    const digits = PhoneUtils.extractDigits(phone);
    return /^998\d{9}$/.test(digits);
  },

  getCleanPhone: (phone) => {
    if (!phone) return '';
    const digits = PhoneUtils.extractDigits(phone);
    if (digits.length >= 12 && digits.startsWith('998')) {
      return digits.substring(3);
    }
    return '';
  },

  parsePhoneString: (phoneString) => {
    if (!phoneString || typeof phoneString !== 'string') return [];
    
    return phoneString
      .split(/[,;]+/)
      .map(phone => phone.trim())
      .filter(phone => phone.length > 0)
      .map(phone => {
        if (!phone.startsWith('+998')) {
          return PhoneUtils.formatForDisplay(phone);
        }
        return phone;
      });
  }
};

// PHONE HOOK
const usePhoneManager = (onPhonesChange) => {
  const nextIdRef = useRef(1);
  const syncTimeoutRef = useRef(null);
  const lastSyncedPhonesRef = useRef(''); // Infinite loop oldini olish uchun
  
  const generateId = useCallback(() => nextIdRef.current++, []);
  
  const [phones, setPhones] = useState(() => [{ 
    id: generateId(), 
    value: '+998' 
  }]);

  // Optimized sync function - faqat o'zgargan bo'lsa sync qiladi
  const syncPhonesWithData = useCallback((phonesData) => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
        
    syncTimeoutRef.current = setTimeout(() => {
      const validPhones = phonesData
        .map(phone => PhoneUtils.getCleanPhone(phone.value))
        .filter(phone => phone.length === 9);
      
      const phoneString = validPhones.join(', ');
      
      // Faqat o'zgargan bo'lsa callback chaqirish
      if (phoneString !== lastSyncedPhonesRef.current && onPhonesChange) {
        lastSyncedPhonesRef.current = phoneString;
        onPhonesChange(phoneString);
      }
    }, 150); // Timeout kamaytirildi
  }, [onPhonesChange]);

  const updatePhone = useCallback((id, value) => {
    const formatted = PhoneUtils.formatForDisplay(value);
    
    setPhones(prev => {
      const updated = prev.map(phone => 
        phone.id === id ? { ...phone, value: formatted } : phone
      );
      
      syncPhonesWithData(updated);
      return updated;
    });
  }, [syncPhonesWithData]);

  const addPhone = useCallback(() => {
    if (phones.length < 20) {
      setPhones(prev => [...prev, { 
        id: generateId(), 
        value: '+998' 
      }]);
    }
  }, [phones.length, generateId]);

  const removePhone = useCallback((id) => {
    if (phones.length > 1) {
      setPhones(prev => {
        const updated = prev.filter(phone => phone.id !== id);
        syncPhonesWithData(updated);
        return updated;
      });
    }
  }, [phones.length, syncPhonesWithData]);

  const initializePhones = useCallback((phoneString) => {
    if (!phoneString) {
      const newPhones = [{ id: generateId(), value: '+998' }];
      setPhones(newPhones);
      lastSyncedPhonesRef.current = ''; // Reset sync reference
      return;
    }
    
    const parsedPhones = PhoneUtils.parsePhoneString(phoneString);
    
    if (parsedPhones.length > 0) {
      const newPhones = parsedPhones.map(phone => ({
        id: generateId(),
        value: phone
      }));
      setPhones(newPhones);
      lastSyncedPhonesRef.current = phoneString; // Set sync reference
    } else {
      const newPhones = [{ id: generateId(), value: '+998' }];
      setPhones(newPhones);
      lastSyncedPhonesRef.current = '';
    }
  }, [generateId]);

  const validation = useMemo(() => {
    const validPhones = phones.filter(phone => PhoneUtils.isValid(phone.value));
    return {
      hasValidPhone: validPhones.length > 0,
      allValid: phones.every(phone => 
        phone.value === '+998' || PhoneUtils.isValid(phone.value)
      ),
      validCount: validPhones.length,
      totalCount: phones.length
    };
  }, [phones]);

  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  return {
    phones,
    updatePhone,
    addPhone,
    removePhone,
    initializePhones,
    validation,
    canAddMore: phones.length < 20,
    canRemove: phones.length > 1
  };
};

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
  const [isEditMode, setIsEditMode] = useState(false);

  const fieldRefs = useRef({});
  const updateTimeoutRef = useRef({});

  // PHONE CALLBACK - telefon o'zgarganda formData ni yangilaydi
  const handlePhonesChange = useCallback((phoneString) => {
    setFormData(prev => {
      if (prev.phone === phoneString) return prev;
      return { ...prev, phone: phoneString };
    });
  }, []);

  // OPTIMIZED PHONE MANAGEMENT
  const phoneManager = usePhoneManager(handlePhonesChange);

  // OPTIMIZATION: Memoized configurations (barcha dependency lar stable)
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

  // Number formatting functions - memoized
  const formatInputNumber = useCallback((value) => {
    if (!value) return "";
    const digitsOnly = value.replace(/\D/g, "");
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }, []);

  const unformatInputNumber = useCallback((value) => {
    if (!value) return "";
    return value.replace(/\s/g, "");
  }, []);

  // Stable getAvailableOptions function
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

    for (const field of requiredFields) {
      if (field === 'phone') {
        if (!phoneManager.validation.hasValidPhone) {
          emptyFields.push(field);
          if (!firstEmptyField) firstEmptyField = field;
        }
        continue;
      }

      const fieldValue = formData[field];
      const isEmpty = Array.isArray(fieldValue)
        ? fieldValue.length === 0
        : !fieldValue || fieldValue.trim() === "";

      if (isEmpty) {
        emptyFields.push(field);
        if (!firstEmptyField) firstEmptyField = field;
      }
    }

    // Price validation
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
  }, [formData, selectedType, getRequiredFields, phoneManager.validation.hasValidPhone]);

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

  // Debounced form input change
  const debouncedFormUpdateRef = useRef({});
  
  const handleInputChange = useCallback((field, value) => {
    // Immediate UI update
    setFormData((prev) => {
      if (prev[field] === value) return prev; 
      
      const updated = { ...prev };
      
      if (Array.isArray(value)) {
        updated[field] = value;
      } else if (field === "isNegotiable") {
        updated[field] = Boolean(value);
        // Clear price fields immediately if negotiable
        if (value === true) {
          updated.price = "";
          updated.hourlyRate = "";
        }
      } else {
        updated[field] = value ? String(value) : "";
      }

      // Format numbers
      if (["minOrderTime", "mileage", "hourlyRate", "price", "experience"].includes(field)) {
        updated[field] = formatInputNumber(value);
      }

      return updated;
    });

    // Debounced reset logic - faqat kerak bo'lganda
    if (updateTimeoutRef.current[field]) {
      clearTimeout(updateTimeoutRef.current[field]);
    }

    // Reset logic faqat ma'lum fieldlar uchun
    const resetMap = {
      country: "city",
      techType: "marka", 
      marka: selectedType === "parts" ? "partsCategory" : "model",
      model: "countriesbymodel",
      partsCategory: "countriesbycategory",
      markaForRepair: ["profession", "partmanifacturer"],
      profession: "partmanifacturer",
    };

    if (resetMap[field]) {
      updateTimeoutRef.current[field] = setTimeout(() => {
        setFormData((prev) => {
          const updated = { ...prev };
          const childField = resetMap[field];
          
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

          return updated;
        });
      }, 200); // Timeout
    }
  }, [selectedType, formatInputNumber]);

  // File handling - optimized
  const handleFileChange = useCallback((newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleFileRemove = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Focus management - optimized
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

  // Form submission - optimized
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
      const submitFormData = new FormData();

      if (files && files.length > 0) {
        files.forEach((file, index) => {
          submitFormData.append('files', file);
        });
      }

      const filteredFormData = {
        type: selectedType,
        timestamp: new Date().toISOString(),
      };

      requiredFields.forEach((field) => {
        const fieldValue = formData[field];
        if (fieldValue !== undefined && fieldValue !== "" &&
            !(Array.isArray(fieldValue) && fieldValue.length === 0)) {
          filteredFormData[field] = fieldValue;
        }
      });

      if (requiredFields.includes('mileage')) {
        filteredFormData.mileage = unformatInputNumber(formData.mileage);
      } else if (requiredFields.includes('experience')) {
        filteredFormData.experience = unformatInputNumber(formData.experience);
      }

      if (!formData.isNegotiable) {
        if (formData.price && formData.price.trim() !== "") {
          filteredFormData.price = unformatInputNumber(formData.price);
          filteredFormData.currency = formData.currency
        }
        if (selectedType === "rent" && formData.hourlyRate && formData.hourlyRate.trim() !== "") {
          filteredFormData.hourlyRate = unformatInputNumber(formData.hourlyRate);
        }
      } else {
        filteredFormData.isNegotiable = formData.isNegotiable;
      }

      submitFormData.append('formData', JSON.stringify(filteredFormData));

      // console.log('Sending data:', filteredFormData);
      // Bot qism
      const result = await fetchPage(submitFormData, true);
      // console.log('Success:', result);
      // --
      
      //  formData ni reset qilish
      setFormData({ ...INITIAL_FORM_DATA });
      
      // phone manager ni reset qilish
      phoneManager.initializePhones('');
      
      // Files ni tozalash
      setFiles([]);
      
      toast({
        title: t("useOrderForm.succes_print", "Заказ успешно создан! 🎉"),
        description: t("useOrderForm.succes_print_desc", "Ваш заказ опубликован."),
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

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
  }, [validateForm, focusInvalidField, toast, getRequiredFields, selectedType, files, formData, t, unformatInputNumber, phoneManager]);


  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Edit mode initialization - optimized
  const initializeEditMode = useCallback((editData, category) => {
    if (editData && Object.keys(editData).length > 0) {
      setIsEditMode(true);
      
      const { files: editFiles, ...cleanEditData } = editData;
      // FormData ni to'liq o'rnatish
      setFormData({
        ...INITIAL_FORM_DATA,
        ...cleanEditData,
      });
      setFiles(editFiles || []);
      setSelectedType(category);

      // Phone manager ni alohida initialize qilish
      setTimeout(() => {
        if (cleanEditData.phone) {
          phoneManager.initializePhones(cleanEditData.phone);
        } else {
          phoneManager.initializePhones('');
        }
      }, 100);
    }
  }, [phoneManager]);

  // OPTIMIZATION: Progress calculation with debounce
  const progressTimeoutRef = useRef(null);
  useEffect(() => {
    if (progressTimeoutRef.current) {
      clearTimeout(progressTimeoutRef.current);
    }

    progressTimeoutRef.current = setTimeout(() => {
      const requiredFields = getRequiredFields(selectedType);
      let totalRequiredFields = requiredFields.length;

      if (!formData.isNegotiable) {
        totalRequiredFields += 1;
        if (selectedType === "rent") totalRequiredFields += 1;
      }

      setTotalSteps(totalRequiredFields);

      let filledCount = 0;

      for (const field of requiredFields) {
        if (field === 'phone') {
          if (phoneManager.validation.hasValidPhone) filledCount++;
          continue;
        }

        const fieldValue = formData[field];
        const isFilled = Array.isArray(fieldValue) ? fieldValue.length > 0 : fieldValue && fieldValue.trim() !== "";
        if (isFilled) filledCount++;
      }

      if (formData.isNegotiable) {
        filledCount += 1;
        if (selectedType === "rent") filledCount += 1;
      } else {
        if (formData.price && formData.price.trim() !== "") filledCount++;
        if (selectedType === "rent" && formData.hourlyRate && formData.hourlyRate.trim() !== "") filledCount++;
      }

      setStep(Math.min(filledCount, totalRequiredFields));
    }, 200);

    return () => {
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
      }
    };
  }, [formData, selectedType, getRequiredFields, phoneManager.validation.hasValidPhone]);

  // OPTIMIZATION: Computed values with stable dependencies
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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(updateTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);



  return {
    // Edit Mode
    initializeEditMode,
    isEditMode,

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

    // PHONE MANAGEMENT
    phoneManager,
    
    // BACKWARD COMPATIBILITY
    phoneNumbers: phoneManager.phones,
    addPhoneNumber: phoneManager.addPhone,
    removePhoneNumber: phoneManager.removePhone,
    updatePhoneNumber: phoneManager.updatePhone,
    // Phone validation
    phoneValidation: phoneManager.validation,

    // Constants
    techTypes: TECH_TYPES,
    countries: COUNTRIES,
    fuelTypes: FUEL_TYPES,
    dateOfRelease: DATE_OF_RELEASE,
    availableMarkaForRepair: MARKA_FOR_REPAIR,
    availableProfession: PROFESSIONS,
    workPlace: WORK_LOCATIONS,
    currency: CURRENCIES,

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

    // Utils
    getRequiredFields,
    focusInvalidField,
  };
};