// hooks/useOrderForm.js
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Constants
const TECH_TYPES = [
  { value: 'excavator', label: 'Ekskavator' },
  { value: 'bulldozer', label: 'Buldozer' },
  { value: 'crane', label: 'Kran' },
  { value: 'loader', label: 'Yuklargich' },
  { value: 'truck', label: 'Yuk mashinasi' },
  { value: 'forklift', label: 'Avtopogruzchik' },
  { value: 'roller', label: 'Silindr (Road roller)' },
  { value: 'grader', label: 'Grader' },
  { value: 'compactor', label: 'Kompakter' },
  { value: 'mixer', label: 'Beton mikser' },
  { value: 'dump-truck', label: 'Samosvol' },
  { value: 'generator', label: 'Generator' }
];

const MARKA_BY_TECH_TYPES = {
  excavator: [
    { value: 'brand_excavator', label: 'brand_excavator' },
    { value: 'brand2_excavator', label: 'brand2_excavator' },
    { value: 'brand3_excavator', label: 'brand3_excavator' }
  ],
  bulldozer: [
    { value: 'brand_bulldozer', label: 'brand_bulldozer' },
    { value: 'brand2_bulldozer', label: 'brand2_bulldozer' },
    { value: 'brand3_bulldozer', label: 'brand3_bulldozer' }
  ],
  crane: [
    { value: 'brand_crane', label: 'brand_crane' },
    { value: 'brand2_crane', label: 'brand2_crane' },
    { value: 'brand3_crane', label: 'brand3_crane' }
  ],
  loader: [
    { value: 'brand_loader', label: 'brand_loader' },
    { value: 'brand2_loader', label: 'brand2_loader' },
    { value: 'brand3_loader', label: 'brand3_loader' }
  ]
};

const MODEL_BY_MARKA = {
  brand_excavator: [
    { value: 'model_excavator', label: 'model_excavator' },
    { value: 'model2_excavator', label: 'model2_excavator' },
    { value: 'model3_excavator', label: 'model3_excavator' }
  ],
  brand_bulldozer: [
    { value: 'model_bulldozer', label: 'model_bulldozer' },
    { value: 'model2_bulldozer', label: 'model2_bulldozer' },
    { value: 'model3_bulldozer', label: 'model3_bulldozer' }
  ],
  brand_crane: [
    { value: 'model_crane', label: 'model_crane' },
    { value: 'model2_crane', label: 'model2_crane' },
    { value: 'model3_crane', label: 'model3_crane' }
  ],
  brand_loader: [
    { value: 'model_loader', label: 'model_loader' },
    { value: 'model2_loader', label: 'model2_loader' },
    { value: 'model3_loader', label: 'model3_loader' }
  ]
};

const COUNTRIES = [
  { value: 'uzbekistan', label: "O'zbekiston" },
  { value: 'russia', label: 'Rossiya' },
  { value: 'kazakhstan', label: "Qozog'iston" },
  { value: 'kyrgyzstan', label: "Qirg'iziston" },
  { value: 'tajikistan', label: 'Tojikiston' },
  { value: 'turkmenistan', label: 'Turkmaniston' },
  { value: 'azerbaijan', label: 'Ozarbayjon' },
  { value: 'turkey', label: 'Turkiya' },
  { value: 'afghanistan', label: "Afg'oniston" },
  { value: 'china', label: 'Xitoy' }
];

const CITIES_BY_COUNTRY = {
  uzbekistan: [
    { value: 'tashkent', label: 'Toshkent' },
    { value: 'samarkand', label: 'Samarqand' },
    { value: 'bukhara', label: 'Buxoro' },
    { value: 'andijan', label: 'Andijon' },
    { value: 'fergana', label: "Farg'ona" },
    { value: 'namangan', label: 'Namangan' },
    { value: 'qarshi', label: 'Qarshi' },
    { value: 'nukus', label: 'Nukus' },
    { value: 'jizzakh', label: 'Jizzax' },
    { value: 'urgench', label: 'Urganch' },
    { value: 'termez', label: 'Termiz' },
    { value: 'navoi', label: 'Navoiy' },
    { value: 'gulistan', label: 'Guliston' },
    { value: 'kokand', label: "Qo'qon" }
  ],
  russia: [
    { value: 'moscow', label: 'Moskva' },
    { value: 'saint-petersburg', label: 'Sankt-Peterburg' },
    { value: 'novosibirsk', label: 'Novosibirsk' },
    { value: 'yekaterinburg', label: 'Yekaterinburg' },
    { value: 'kazan', label: 'Qozon' },
    { value: 'nizhny-novgorod', label: 'Nijniy Novgorod' },
    { value: 'chelyabinsk', label: 'Chelyabinsk' },
    { value: 'omsk', label: 'Omsk' },
    { value: 'samara', label: 'Samara' },
    { value: 'rostov-on-don', label: 'Rostov-na-Donu' }
  ],
  kazakhstan: [
    { value: 'almaty', label: 'Almati' },
    { value: 'nur-sultan', label: 'Nur-Sultan' },
    { value: 'shymkent', label: 'Shymkent' },
    { value: 'aktau', label: 'Aktau' },
    { value: 'aktobe', label: 'Aktobe' },
    { value: 'karaganda', label: 'Qaraganda' },
    { value: 'pavlodar', label: 'Pavlodar' },
    { value: 'kostanay', label: 'Qostanay' },
    { value: 'taraz', label: 'Taraz' }
  ],
  kyrgyzstan: [
    { value: 'bishkek', label: 'Bishkek' },
    { value: 'osh', label: 'Osh' },
    { value: 'jalal-abad', label: 'Jalal-Abad' },
    { value: 'karakol', label: 'Qarakol' },
    { value: 'tokmok', label: 'Toqmoq' },
    { value: 'uzgen', label: 'Uzgen' },
    { value: 'naryn', label: 'Naryn' }
  ],
  tajikistan: [
    { value: 'dushanbe', label: 'Dushanbe' },
    { value: 'khujand', label: 'Xujand' },
    { value: 'kulob', label: 'Kulyob' },
    { value: 'qurghonteppa', label: "Qurg'onteppa" },
    { value: 'istaravshan', label: 'Istaravshan' },
    { value: 'khorog', label: 'Xorog' }
  ],
  turkmenistan: [
    { value: 'ashgabat', label: 'Ashgabat' },
    { value: 'turkmenbashi', label: 'Turkmenboshi' },
    { value: 'mary', label: 'Mary' },
    { value: 'turkmenabat', label: 'Turkmenabat' },
    { value: 'dashoguz', label: "Dashog'uz" },
    { value: 'balkanabat', label: 'Balkanabat' }
  ],
  azerbaijan: [
    { value: 'baku', label: 'Boku' },
    { value: 'ganja', label: 'Ganja' },
    { value: 'sumgayit', label: 'Sumqayit' },
    { value: 'mingachevir', label: 'Mingachevir' },
    { value: 'quba', label: 'Quba' },
    { value: 'lankaran', label: 'Lankaran' }
  ],
  turkey: [
    { value: 'istanbul', label: 'Istanbul' },
    { value: 'ankara', label: 'Ankara' },
    { value: 'izmir', label: 'Izmir' },
    { value: 'bursa', label: 'Bursa' },
    { value: 'antalya', label: 'Antalya' },
    { value: 'adana', label: 'Adana' },
    { value: 'konya', label: 'Konya' },
    { value: 'gaziantep', label: 'Gaziantep' }
  ],
  afghanistan: [
    { value: 'kabul', label: 'Kobul' },
    { value: 'herat', label: 'Hirot' },
    { value: 'kandahar', label: 'Qandahor' },
    { value: 'mazar-i-sharif', label: 'Mazar-i-Sharif' },
    { value: 'jalalabad', label: 'Jalalabad' },
    { value: 'kunduz', label: 'Kunduz' }
  ],
  china: [
    { value: 'beijing', label: 'Pekin' },
    { value: 'shanghai', label: 'Shanxay' },
    { value: 'guangzhou', label: 'Guangjou' },
    { value: 'shenzhen', label: 'Shenjen' },
    { value: 'tianjin', label: 'Tianjin' },
    { value: 'wuhan', label: 'Vuxan' },
    { value: 'xian', label: 'Sian' },
    { value: 'urumqi', label: 'Urumchi' }
  ]
};

const RESET_MAP = {
  country: ['city'],
  techType: ['marka', 'model'],
  marka: ['model'],
};

// Har bir order type uchun kerakli fieldlar
const REQUIRED_FIELDS_MAP = {
  parts: ['title', 'techType', 'description', 'contact', 'phone', 'country', 'city', 'marka', 'model'],
  repair: ['title', 'techType', 'description', 'contact', 'phone', 'country', 'city', 'marka', 'model'],
  default: ['title', 'techType', 'description', 'contact', 'phone', 'country', 'city']
};

// Har bir order type uchun submit qilinadigan fieldlar
const BASE_SUBMIT_FIELDS = {
  parts: ['title', 'techType', 'description', 'contact', 'phone', 'country', 'city', 'marka', 'model'],
  repair: ['title', 'techType', 'description', 'contact', 'phone', 'country', 'city', 'marka', 'model'],
  default: ['title', 'techType', 'description', 'contact', 'phone', 'country', 'city']
};

const INITIAL_FORM_DATA = {
  title: '',
  techType: '',
  description: '',
  price: '',
  isNegotiable: false,
  contact: '',
  phone: '',
  country: '',
  city: '',
  marka: '',
  model: ''
};

export const useOrderForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
  const [errorMessage, setErrorMessage] = useState([]);


  // Error messages
  const ERROR_MESSAGES = {
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
  };

  // Field labels for error messages
  const FIELD_LABELS = {
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
  };

  // Utility functions
  const formatInputNumber = useCallback((value) => {
    if (!value || value === '') return '';
    // Faqat raqamlarni qoldirish
    const digitsOnly = value.toString().replace(/\D/g, '');
    if (digitsOnly === '') return '';
    // 3 raqamdan keyin space qo'shish
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }, []);

  const unformatInputNumber = useCallback((value) => {
    if (!value || value === '') return '';
    // Barcha space va non-digit karakterlarni olib tashlash
    return value.toString().replace(/\s+/g, '').replace(/\D/g, '');
  }, []);

  const handlePhoneChange = useCallback((value) => {
    // Faqat raqamlarni qoldirish
    const digitsOnly = value.replace(/\D/g, '');
    
    // Agar +998 bilan boshlansa, uni qoldirish
    if (value.startsWith('+998')) {
      const phoneNumber = digitsOnly.slice(3); // 998 dan keyingi qismni olish
      if (phoneNumber.length <= 9) {
        return `+998${phoneNumber}`;
      }
      return `+998${phoneNumber.slice(0, 9)}`;
    }
    
    // Agar faqat 998 bilan boshlansa, + qo'shish
    if (digitsOnly.startsWith('998') && digitsOnly.length <= 12) {
      const phoneNumber = digitsOnly.slice(3);
      if (phoneNumber.length <= 9) {
        return `+998${phoneNumber}`;
      }
      return `+998${phoneNumber.slice(0, 9)}`;
    }
    
    // Agar boshqa formatda bo'lsa, +998 qo'shish
    if (digitsOnly.length <= 9) {
      return `+998${digitsOnly}`;
    }
    
    return `+998${digitsOnly.slice(0, 9)}`;
  }, []);

  // Validation function
  const validateField = useCallback((fieldName, value) => {
    const requiredFields = REQUIRED_FIELDS_MAP[selectedType] || REQUIRED_FIELDS_MAP.default;
    
    // Check if field is required
    if (requiredFields.includes(fieldName)) {
      if (!value || value.toString().trim() === '') {
        return ERROR_MESSAGES[fieldName] || `${fieldName} ${t("useOrderForm.force", "обязательно")}`;
      }
    }

    // Specific field validations
    switch (fieldName) {
      case 'phone':
        if (value) {
          // +998 formatini tekshirish
          const phoneRegex = /^\+998\d{9}$/;
          if (!phoneRegex.test(value)) {
            return t("useOrderForm.phoneRegex", "Пожалуйста, введите номер телефона в формате +998, за которым следуют 9 цифр. Пример: +998901234567");
          }
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
      default:
        break;
    }

    return '';
  }, [selectedType]);

  // Validate all fields and generate detailed error message
  const validateForm = useCallback(() => {
    const requiredFields = REQUIRED_FIELDS_MAP[selectedType] || REQUIRED_FIELDS_MAP.default;
    const newErrors = {};
    const missingFields = [];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        // Faqat bo'sh maydonlar uchun missing fields listiga qo'shish
        if (!formData[field] || formData[field].toString().trim() === '') {
          missingFields.push(FIELD_LABELS[field] || field);
        }
      }
    });

    // Price validation - faqat isNegotiable false bo'lsa price kerak
    if (!formData.isNegotiable && (!formData.price || formData.price.toString().trim() === '')) {
      newErrors.price = ERROR_MESSAGES.price;
      missingFields.push(FIELD_LABELS.price);
    }

    // Generate detailed error message
    if (missingFields.length > 0) {
      const fieldsList = missingFields.join(', ');
      setErrorMessage(`${t("useOrderForm.blow_fields_notFull", "Следующие поля не заполнены:")} ${fieldsList}`);
    } else {
        const allErrors = Object.values(newErrors);
        setErrorMessage(allErrors);
    }

    setErrors(newErrors);
    console.log(newErrors)
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedType, validateField]);

  // Get available options based on dependencies
  const getAvailableOptions = useCallback((key, map) => {
    const selected = formData[key];
    if (!selected) return [];
    return map[selected] || [];
  }, [formData]);

  const availableCities = getAvailableOptions('country', CITIES_BY_COUNTRY);
  const availableMarka = getAvailableOptions('techType', MARKA_BY_TECH_TYPES);
  const availableModel = getAvailableOptions('marka', MODEL_BY_MARKA);

  // Handle input changes with special formatting
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => {
      const updated = { ...prev };
      
      // Apply special formatting based on field type
      switch (field) {
        case 'price':
          updated[field] = formatInputNumber(value);
          break;
        case 'phone':
          updated[field] = handlePhoneChange(value);
          break;
        case 'isNegotiable':
          updated[field] = value;
          // Agar negotiable bo'lsa, price ni tozalash
          if (value === true) {
            updated.price = '';
          }
          break;
        default:
          updated[field] = value;
      }

      // Reset dependent fields
      if (RESET_MAP[field]) {
        RESET_MAP[field].forEach(dependentField => {
          updated[dependentField] = '';
        });
      }

      return updated;
    });

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Clear general error messages
    if (showError) {
      setShowError(false);
      setErrorMessage('');
    }
  }, [formatInputNumber, handlePhoneChange, errors, showError]);

  // File handling
  const handleFileChange = useCallback((newFiles) => {
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleFileRemove = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Form validation
  const isFormValid = useCallback(() => {
    const requiredFields = REQUIRED_FIELDS_MAP[selectedType] || REQUIRED_FIELDS_MAP.default;
    
    const emptyFields = requiredFields.filter(field => 
      !formData[field] || formData[field].toString().trim() === ''
    );
    
    // Price validation - faqat isNegotiable false bo'lsa price kerak
    if (!formData.isNegotiable && (!formData.price || formData.price.toString().trim() === '')) {
      return false;
    }

    return emptyFields.length === 0;
  }, [formData, selectedType]);

  // Progress calculation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const requiredFields = REQUIRED_FIELDS_MAP[selectedType] || REQUIRED_FIELDS_MAP.default;
      
      // Total steps = required fields + price field (agar negotiable bo'lmasa)
      const totalRequired = requiredFields.length + (formData.isNegotiable ? 0 : 1);
      setTotalSteps(totalRequired);
      
      let filledCount = requiredFields.filter(field => 
        formData[field] && formData[field].toString().trim() !== ''
      ).length;
      
      // Price field ham hisoblanadi
      if (formData.isNegotiable || (formData.price && formData.price.toString().trim() !== '')) {
        filledCount++;
      }
      
      setStep(Math.min(filledCount, totalRequired));
    }, 100); // Debounce timeout kamaytirildi

    return () => clearTimeout(timeoutId);
  }, [formData, selectedType]);

  // Clean form data for submission
  const getCleanFormData = useCallback(() => {
    const baseFields = BASE_SUBMIT_FIELDS[selectedType] || BASE_SUBMIT_FIELDS.default;
    const cleanData = {
      orderType: selectedType,
      createdAt: new Date().toISOString()
    };
    
    // Base fieldlarni qo'shish
    baseFields.forEach(field => {
      if (formData[field] !== undefined && formData[field] !== null && formData[field] !== '') {
        cleanData[field] = formData[field];
      }
    });

    // Price va isNegotiable mantiqini to'g'ri qo'llash
    if (formData.isNegotiable) {
      // Agar negotiable bo'lsa, faqat isNegotiable ni yuborish
      cleanData.isNegotiable = true;
    } else if (formData.price && formData.price.toString().trim() !== '') {
      // Agar negotiable bo'lmasa va price bor bo'lsa, faqat price ni yuborish
      cleanData.price = unformatInputNumber(formData.price);
    }

    // Files qo'shish
    cleanData.files = files

    return cleanData;
  }, [formData, selectedType, files, unformatInputNumber]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    setIsSubmitted(true);
    
    if (!validateForm()) {
      setShowError(true);
      
      toast({
        title: t("useOrderForm.fill_form", "Заполните форму!"),
        description: errorMessage,
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
      
      // Log all data to console
      console.log('=== FORM SUBMISSION ===');
      console.log('Order Type:', selectedType);
      console.log('Clean Submission Data:', submissionData);
      console.log('Files:', files);
      console.log('======================');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: t("useOrderForm.succes_print", "Заказ успешно создан! 🎉"),
        description: t("useOrderForm.succes_print_desc", "Ваш заказ опубликован."),
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      
      // Reset form after successful submission
      setFormData(INITIAL_FORM_DATA);
      setFiles([]);
      setErrors({});
      setIsSubmitted(false);
      setShowError(false);
      setErrorMessage('');
      
    } catch (error) {
      console.error('Submission error:', error);
      const errorMsg = t("useOrderForm.error_sending", "Произошла ошибка при отправке заказа. Попробуйте еще раз.");
      setShowError(true);
      setErrorMessage(errorMsg);
      
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
  }, [validateForm, toast, getCleanFormData, selectedType, files, errorMessage]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Type change handler
  const handleTypeChange = useCallback((type) => {
    setSelectedType(type);
    // Clear errors when changing type
    setErrors({});
    setShowError(false);
    setErrorMessage('');
    // Form data saqlanadi, faqat type o'zgaradi
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setFiles([]);
    setErrors({});
    setIsSubmitted(false);
    setShowError(false);
    setErrorMessage('');
  }, []);

  // Get field error
  const getFieldError = useCallback((fieldName) => {
    return errors[fieldName] || '';
  }, [errors]);

  // Check if field has error
  const hasFieldError = useCallback((fieldName) => {
    return Boolean(errors[fieldName]);
  }, [errors]);

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
    
    // Available options
    availableCities,
    availableMarka,
    availableModel,
    
    // Constants
    TECH_TYPES,
    COUNTRIES,
    
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