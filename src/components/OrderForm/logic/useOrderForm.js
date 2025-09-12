// hooks/useOrderForm.js
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchPage } from "../../../../BotFetch";
import {
  INITIAL_FORM_DATA,
  REQUIRED_FIELDS_MAP,
  BASE_SUBMIT_FIELDS,
  RESET_MAP,
  CITIES_BY_COUNTRY,
  COUNTRIES,
  MODEL_BY_MARKA,
  MARKA_BY_TECH_TYPES,
  TECH_TYPES,
  CURRENCIES
} from './useFormdataconst';

export const useOrderForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Refs for performance optimization
  const submitTimeoutRef = useRef(null);
  const validationTimeoutRef = useRef(null);
  const lastValidationData = useRef('');

  // State
  const [selectedType, setSelectedType] = useState('purchase');
  const [showSupport, setShowSupport] = useState(false);
  const [files, setFiles] = useState([]);
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]); // Always array

  // Memoized error messages and field labels with stable references
  const errorMessages = useMemo(() => ({
    title: t("useOrderForm.title", "Заголовок обязателен"),
    techType: t("useOrderForm.techType", "Необходимо выбрать тип техники"),
    description: t("useOrderForm.description", "Описание обязательно"),
    contact: t("useOrderForm.contact", "Имя контакта обязательно"),
    phone: t("useOrderForm.phone", "Номер телефона обязателен"),
    country: t("useOrderForm.country", "Выбор страны обязателен"),
    city: t("useOrderForm.city", "Выбор города обязателен"),
    marka: t("useOrderForm.marka", "Выбор марки обязателен"),
    model: t("useOrderForm.model", "Выбор модели обязателен"),
    price: t("useOrderForm.price", "Введите цену или отметьте 'по договоренности'"),
    general: t("useOrderForm.general", "Пожалуйста, заполните все обязательные поля")
  }), [t]);

  const fieldLabels = useMemo(() => ({
    title: t("useOrderForm.title_label", "Заголовок"),
    techType: t("useOrderForm.techType_label", "Тип техники"),
    description: t("useOrderForm.description_label", "Описание"),
    contact: t("useOrderForm.contact_label", "Имя контакта"),
    phone: t("useOrderForm.phone_label", "Номер телефона"),
    country: t("useOrderForm.country_label", "Страна"),
    city: t("useOrderForm.city_label", "Город"),
    marka: t("useOrderForm.marka_label", "Марка"),
    model: t("useOrderForm.model_label", "Модель"),
    price: t("useOrderForm.price_label", "Цена")
  }), [t]);

  // Memoized available options with deep comparison optimization
  const availableCities = useMemo(() => 
    CITIES_BY_COUNTRY[formData.country] || [], [formData.country]
  );
  
  const availableMarka = useMemo(() => 
    MARKA_BY_TECH_TYPES[formData.techType] || [], [formData.techType]
  );
  
  const availableModel = useMemo(() => 
    MODEL_BY_MARKA[formData.marka] || [], [formData.marka]
  );

  // Memoized required fields for current type
  const requiredFields = useMemo(() => 
    REQUIRED_FIELDS_MAP[selectedType] || REQUIRED_FIELDS_MAP.default, [selectedType]
  );

  // Optimized utility functions with stable references
  const formatInputNumber = useCallback((value) => {
    if (!value || value === '') return '';
    const digitsOnly = value.toString().replace(/\D/g, '');
    if (digitsOnly === '') return '';
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }, []);

  const unformatInputNumber = useCallback((value) => {
    if (!value || value === '') return '';
    return value.toString().replace(/\s+/g, '').replace(/\D/g, '');
  }, []);

  const handlePhoneChange = useCallback((value) => {
    const digitsOnly = value.replace(/\D/g, '');
    
    if (value.startsWith('+998')) {
      const phoneNumber = digitsOnly.slice(3);
      return phoneNumber.length <= 9 ? `+998${phoneNumber}` : `+998${phoneNumber.slice(0, 9)}`;
    }
    
    if (digitsOnly.startsWith('998') && digitsOnly.length <= 12) {
      const phoneNumber = digitsOnly.slice(3);
      return phoneNumber.length <= 9 ? `+998${phoneNumber}` : `+998${phoneNumber.slice(0, 9)}`;
    }
    
    return digitsOnly.length <= 9 ? `+998${digitsOnly}` : `+998${digitsOnly.slice(0, 9)}`;
  }, []);

  // Optimized validation function with caching
  const validateField = useCallback((fieldName, value) => {
    if (requiredFields.includes(fieldName)) {
      if (!value || value.toString().trim() === '') {
        return errorMessages[fieldName] || `${fieldName} ${t("useOrderForm.force", "обязательно")}`;
      }
    }

    switch (fieldName) {
      case 'phone':
        if (value && !/^\+998\d{9}$/.test(value)) {
          return t("useOrderForm.phoneRegex", "Пожалуйста, введите номер телефона в формате +998, за которым следуют 9 цифр. Пример: +998901234567");
        }
        break;
      case 'title':
        if (value && value.length < 3) {
          return t("useOrderForm.title_err", "Заголовок должен содержать как минимум 3 символа");
        }
        break;
      case 'description':
        if (value && value.length < 10) {
          return t("useOrderForm.description_err", "Описание должно содержать как минимум 10 символов");
        }
        break;
      case 'contact':
        if (value && value.length < 2) {
          return t("useOrderForm.contact_err", "Имя контакта должно содержать как минимум 2 символа");
        }
        break;
    }

    return '';
  }, [requiredFields, errorMessages, t]);

  // Optimized validation with debouncing
  const validateForm = useCallback(() => {
    // Create validation signature to avoid unnecessary validations
    const validationSignature = JSON.stringify({
      formData,
      selectedType,
      requiredFields: requiredFields.join(',')
    });
    
    if (lastValidationData.current === validationSignature) {
      return Object.keys(errors).length === 0;
    }
    
    lastValidationData.current = validationSignature;
    
    const newErrors = {};
    const missingFields = [];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        if (!formData[field] || formData[field].toString().trim() === '') {
          missingFields.push(fieldLabels[field] || field);
        }
      }
    });

    if (!formData.isNegotiable && (!formData.price || formData.price.toString().trim() === '')) {
      newErrors.price = errorMessages.price;
      missingFields.push(fieldLabels.price);
    }

    // Always set errorMessage as array
    if (missingFields.length > 0) {
      const fieldsList = missingFields.join(', ');
      setErrorMessage([`${t("useOrderForm.blow_fields_notFull", "Следующие поля не заполнены:")} ${fieldsList}`]);
    } else {
      const allErrors = Object.values(newErrors);
      setErrorMessage(allErrors.length > 0 ? allErrors : []);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedType, requiredFields, validateField, fieldLabels, errorMessages, errors, t]);

  // Optimized input change handler with batched updates
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => {
      const updated = { ...prev };
      
      switch (field) {
        case 'price':
          updated[field] = formatInputNumber(value);
          break;
        case 'phone':
          updated[field] = handlePhoneChange(value);
          break;
        case 'isNegotiable':
          updated[field] = value;
          if (value === true) {
            updated.price = '';
          }
          break;
        default:
          updated[field] = value;
      }

      // Handle dependent field resets
      if (RESET_MAP[field]) {
        RESET_MAP[field].forEach(dependentField => {
          updated[dependentField] = '';
        });
      }

      return updated;
    });

    // Batch error clearing and UI updates
    if (errors[field] || showError) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      
      if (showError) {
        setShowError(false);
        setErrorMessage([]);
      }
    }
  }, [formatInputNumber, handlePhoneChange, errors, showError]);

  // Optimized file handling with batch operations
  const handleFileChange = useCallback((newFiles) => {
    if (newFiles?.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileRemove = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Memoized form validation check with dependency optimization
  const isFormValid = useMemo(() => {
    const emptyFields = requiredFields.filter(field => 
      !formData[field] || formData[field].toString().trim() === ''
    );
    
    const hasPriceError = !formData.isNegotiable && (!formData.price || formData.price.toString().trim() === '');
    
    return emptyFields.length === 0 && !hasPriceError;
  }, [formData, requiredFields]);

  // Optimized progress calculation with debouncing
  useEffect(() => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    validationTimeoutRef.current = setTimeout(() => {
      const totalRequired = requiredFields.length + (formData.isNegotiable ? 0 : 1);
      setTotalSteps(totalRequired);
      
      let filledCount = requiredFields.filter(field => 
        formData[field] && formData[field].toString().trim() !== ''
      ).length;
      
      if (formData.isNegotiable || (formData.price && formData.price.toString().trim() !== '')) {
        filledCount++;
      }
      
      setStep(Math.min(filledCount, totalRequired));
    }, 50); // Reduced debounce time for better UX

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [formData, requiredFields]);

  // Optimized form data preparation with memoization
  const getCleanFormData = useCallback(() => {
    const baseFields = BASE_SUBMIT_FIELDS[selectedType] || BASE_SUBMIT_FIELDS.default;
    const submitFormData = new FormData();
    
    // Add order metadata
    submitFormData.append('orderType', selectedType);
    submitFormData.append('createdAt', new Date().toISOString());
    
    // Add base fields efficiently
    baseFields.forEach(field => {
      const value = formData[field];
      if (value !== undefined && value !== null && value !== '') {
        submitFormData.append(field, value);
      }
    });

    // Handle price and negotiable logic
    if (formData.isNegotiable) {
      submitFormData.append('isNegotiable', 'true');
    } else if (formData.price && formData.price.toString().trim() !== '') {
      submitFormData.append('price', unformatInputNumber(formData.price));
    }

    // Add files efficiently
    if (files?.length > 0) {
      files.forEach((file) => {
        submitFormData.append('files', file);
      });
    }

    return submitFormData;
  }, [formData, selectedType, files, unformatInputNumber]);

  // Optimized form submission with improved error handling
  const handleSubmit = useCallback(async () => {
    // Prevent double submission
    if (isSubmitting) return;
    
    setIsSubmitted(true);
    
    if (!validateForm()) {
      setShowError(true);
      
      const errorDesc = Array.isArray(errorMessage) && errorMessage.length > 0 
        ? errorMessage.join(', ') 
        : t("useOrderForm.general", "Пожалуйста, заполните все обязательные поля");
      
      toast({
        title: t("useOrderForm.fill_form", "Заполните форму!"),
        description: errorDesc,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top"
      });
      return;
    }

    setIsSubmitting(true);
    setDisabled(true);
    
    try {
      const submissionData = getCleanFormData();
      
      // console.log('=== FORM SUBMISSION ===');
      // console.log('Order Type:', selectedType);
      // console.log('FormData entries prepared', submissionData);
      // Bot qism
      const result = await fetchPage(submissionData, true);
      // console.log('Success:', result);
      // --
      toast({
        title: t("useOrderForm.succes_print", "Заказ успешно создан!"),
        description: t("useOrderForm.succes_print_desc", "Ваш заказ опубликован."),
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      
      // Batch reset for better performance
      setFormData({...INITIAL_FORM_DATA});
      setFiles([]);
      setErrors({});
      setIsSubmitted(false);
      setShowError(false);
      setErrorMessage([]);
      lastValidationData.current = '';
      
    } catch (error) {
      console.error('Submission error:', error);
      const errorMsg = t("useOrderForm.error_sending", "Произошла ошибка при отправке заказа. Попробуйте еще раз.");
      
      setShowError(true);
      setErrorMessage([errorMsg]); // array
      
      toast({
        title: t("orderlist.error", "Произошла ошибка!"),
        description: errorMsg,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
    } finally {
      setIsSubmitting(false);
      setDisabled(false);
    }
  }, [isSubmitting, validateForm, toast, getCleanFormData, selectedType, errorMessage, t]);

  // Optimized navigation with cleanup
  const handleBack = useCallback(() => {
    // Clear any pending timeouts
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    
    navigate(-1);
  }, [navigate]);

  // Optimized type change with batch updates
  const handleTypeChange = useCallback((type) => {
    setSelectedType(type);
    setErrors({});
    setShowError(false);
    setErrorMessage([]);
    lastValidationData.current = '';
  }, []);

  // Optimized reset function with batch operations
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setFiles([]);
    setErrors({});
    setIsSubmitted(false);
    setShowError(false);
    setErrorMessage([]);
    lastValidationData.current = '';
  }, []);

  // Optimized field error utilities
  const getFieldError = useCallback((fieldName) => {
    return errors[fieldName] || '';
  }, [errors]);

  const hasFieldError = useCallback((fieldName) => {
    return Boolean(errors[fieldName]);
  }, [errors]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    selectedType,
    showSupport,
    files,
    step,
    totalSteps,
    isSubmitting,
    isSubmitted,
    formData,
    errors,
    disabled,
    showError,
    errorMessage,
    setFiles,
    
    // Available options
    availableCities,
    availableMarka,
    availableModel,
    
    // Constants
    TECH_TYPES,
    COUNTRIES,
    currency: CURRENCIES,
    
    // Handlers
    handleInputChange,
    handleFileChange,
    handleFileRemove,
    handleSubmit,
    handleBack,
    handleTypeChange,
    setShowSupport,
    resetForm,
    
    // Utilities
    isFormValid,
    formatInputNumber,
    unformatInputNumber,
    getCleanFormData,
    validateField,
    validateForm,
    getFieldError,
    hasFieldError
  };
};