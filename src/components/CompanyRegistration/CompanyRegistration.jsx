import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Text, VStack, Input, Icon, useToast,
  Container, FormControl, FormLabel,
  Avatar, Flex, Textarea, InputGroup, InputRightElement,
  Spinner, List, ListItem, HStack
} from '@chakra-ui/react';
import { MdArrowBack, MdBusiness, MdCameraAlt } from 'react-icons/md';
import { FiMapPin } from 'react-icons/fi';
import { replace, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOutsideClick } from '@chakra-ui/react';
import SideTranslator from '../../Pages/SideTranslator';
import { useAuth } from '../../Pages/Auth/logic/AuthContext';

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
      const selected_Lang = i18n?.language || 'uz';
      const response = await fetch(`https://backend-u-mts.onrender.com/api/places/autocomplete?input=${encodeURIComponent(searchQuery)}&language=${selected_Lang}`);
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

const CompanyRegistration = () => {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: '',
    bin: '',
    address: '',
    description: '',
    logo: null
  });

  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();
  const toast = useToast();
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const is_Company = localStorage.getItem("isCompany");
    
    if (is_Company === "true") {
      navigate("/company", { replace: true });
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
      return;
    }
  }, [isAuthenticated, navigate]);

  // Agar user hali logged in bo'lmasa yoki company bo'lsa, loading ko'rsatish
  const is_Company = localStorage.getItem("isCompany");
  
  if (is_Company === "true" || !isAuthenticated) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="lg" />
      </Box>
    );
  }
  // Real-time validation funksiyasi
  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'companyName':
        if (!value.trim()) {
          newErrors.companyName = t('CompanyRegistration.company.enter_name', 'Введите название компании');
        } else if (value.trim().length < 2) {
          newErrors.companyName = t('CompanyRegistration.company.min_length', 'Название компании должно содержать не менее 2 символов');
        } else if (value.trim().length > 100) {
          newErrors.companyName = t('CompanyRegistration.company.max_length', 'Название компании не должно превышать 100 символов');
        } else {
          delete newErrors.companyName;
        }
        break;

      case 'bin':
        if (!value.trim()) {
          newErrors.bin = t('CompanyRegistration.company.enter_bin', 'Введите БИН');
        } else if (value.trim().length !== 9) {
          newErrors.bin = t('CompanyRegistration.company.bin_length', 'БИН должен состоять из 9 цифр');
        } else if (!/^\d+$/.test(value.trim())) {
          newErrors.bin = t('CompanyRegistration.company.bin_digits', 'БИН должен содержать только цифры');
        } else {
          delete newErrors.bin;
        }
        break;

      case 'address':
        if (!value.trim()) {
          newErrors.address = t('CompanyRegistration.company.enter_address', 'Введите адрес компании');
        } else if (value.trim().length < 5) {
          newErrors.address = t('CompanyRegistration.company.address_min', 'Адрес должен содержать не менее 5 символов');
        } else {
          delete newErrors.address;
        }
        break;

      case 'description':
        if (value.trim().length > 500) {
          newErrors.description = t('CompanyRegistration.company.description_limit', 'Описание не должно превышать 500 символов');
        } else {
          delete newErrors.description;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // BIN uchun faqat raqam qabul qiluvchi funksiya
  const handleBinChange = (e) => {
    const value = e.target.value;
    // Faqat raqamlarni qabul qilish
    const numericValue = value.replace(/\D/g, '');
    // 9 ta raqamgacha cheklash
    const limitedValue = numericValue.slice(0, 9);
    
    handleInputChange('bin', limitedValue);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Maydon tegishini belgilash
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Real-time validation
    if (touched[field] || value.length > 0) {
      validateField(field, value);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Fayl hajmini tekshirish (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t('CompanyRegistration.company.error', 'Ошибка!'),
          description: t('CompanyRegistration.company.logo_size', 'Размер логотипа не должен превышать 5MB'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Fayl turini tekshirish
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: t('CompanyRegistration.company.error', 'Ошибка!'),
          description: t("Orderform.form.attachments.formats", 'Поддерживаются форматы SVG, PNG, JPG, JPEG'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Rasm o'lchamini tekshirish
      const img = new Image();
      img.onload = () => {
        setFormData(prev => ({
          ...prev,
          logo: file
        }));

        // Preview yaratish
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      };
      
      img.onerror = () => {
        toast({
          title: t('CompanyRegistration.company.error', 'Ошибка!'),
          description: t('CompanyRegistration.company.invalid_file', 'Файл поврежден или имеет неверный формат'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      };
      
      img.src = URL.createObjectURL(file);
    }
  };

  // Kompaniya nomini tekshirish
  const validateCompanyName = (name) => {
    // Kamida bitta harf bo'lishi kerak
    if (!/[a-zA-ZА-Яа-яЁё\u0400-\u04FF]/.test(name)) {
      return false;
    }
    // Faqat ruxsat etilgan belgilar
    if (!/^[a-zA-ZА-Яа-яЁё\u0400-\u04FF0-9\s\-\_\.\"\']+$/.test(name)) {
      return false;
    }
    return true;
  };

  const validateForm = () => {
    const newErrors = {};

    // Kompaniya nomi tekshiruvi
    if (!formData.companyName.trim()) {
      newErrors.companyName = t('CompanyRegistration.company.enter_name', 'Введите название компании');
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = t('CompanyRegistration.company.min_length', 'Название компании должно содержать не менее 2 символов');
    } else if (formData.companyName.trim().length > 100) {
      newErrors.companyName = t('CompanyRegistration.company.max_length', 'Название компании не должно превышать 100 символов');
    } else if (!validateCompanyName(formData.companyName.trim())) {
      newErrors.companyName = 'Компания номида нотўғри белгилар бор';
    }

    // BIN tekshiruvi
    if (!formData.bin.trim()) {
      newErrors.bin = t('CompanyRegistration.company.enter_bin', 'Введите БИН');
    } else if (formData.bin.trim().length !== 9) {
      newErrors.bin = t('CompanyRegistration.company.bin_length', 'БИН должен состоять из 9 цифр');
    } else if (!/^\d+$/.test(formData.bin.trim())) {
      newErrors.bin = t('CompanyRegistration.company.bin_digits', 'БИН должен содержать только цифры');
    }

    // Address tekshiruvi
    if (!formData.address.trim()) {
      newErrors.address = t('CompanyRegistration.company.enter_address', 'Введите адрес компании');
    } else if (formData.address.trim().length < 5) {
      newErrors.address = t('CompanyRegistration.company.address_min', 'Адрес должен содержать не менее 5 символов');
    }

    // Tavsif tekshiruvi
    if (formData.description.trim().length > 500) {
      newErrors.description = t('CompanyRegistration.company.description_limit', 'Описание не должно превышать 500 символов');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // BIN mavjudligini tekshirish (demo)
  const checkBINExists = async (bin) => {
    // Bu yerda real API ga so'rov yuboriladi
    // Demo uchun ba'zi BIN raqamlarini "mavjud" deb qaytaramiz
    const existingBINs = ['123456789', '987654321', '111111111'];
    return existingBINs.includes(bin);
  };

  const handleSubmit = async () => {
    // Barcha maydonlarni tegilgan deb belgilash
    const allFields = ['companyName', 'bin', 'address', 'description'];
    const newTouched = {};
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    if (!validateForm()) {
      toast({
        title: t('CompanyRegistration.company.error', 'Ошибка!'),
        description: t('CompanyRegistration.company.fill_required', 'Пожалуйста, заполните все обязательные поля'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      // BIN mavjudligini tekshirish
      const binExists = await checkBINExists(formData.bin.trim());
      if (binExists) {
        setErrors(prev => ({
          ...prev,
          bin: t('CompanyRegistration.company.bin_exists', 'Этот БИН уже зарегистрирован')
        }));
        setIsLoading(false);
        toast({
          title: t('CompanyRegistration.company.error', 'Ошибка!'),
          description: t('CompanyRegistration.company.bin_exists', 'Этот БИН уже зарегистрирован'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Logo'ni base64 formatga o'tkazish
      let logoBase64 = null;
      if (formData.logo) {
        logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(formData.logo);
        });
      }

      // API ga yuborilayotgan ma'lumotlar
      const companyData = {
        companyName: formData.companyName.trim(),
        bin: formData.bin.trim(),
        address: formData.address.trim(), // country va city o'rniga address
        description: formData.description.trim(),
        logo: formData.logo,
        logoBase64: logoBase64, // base64 format logo
        logoPreview: logoPreview, // preview uchun
        timestamp: new Date().toISOString(),
        // Qo'shimcha meta ma'lumotlar
        metadata: {
          logoSize: formData.logo ? formData.logo.size : null,
          logoType: formData.logo ? formData.logo.type : null,
          logoName: formData.logo ? formData.logo.name : null,
          registrationIP: 'demo_ip',
          userAgent: navigator.userAgent,
          completionPercentage: calculateCompletionPercentage()
        }
      };

      // Demo uchun 2 soniya kutish
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success message
      toast({
        title: t('CompanyRegistration.company.success', 'Успешно!'),
        description: t('CompanyRegistration.company.registered', 'Компания успешно зарегистрирована'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Keyingi sahifaga barcha ma'lumotlarni yuborish
      navigate("/auth/registration-performer/activity", {
        state: {
          companyData: companyData,
          registrationSuccess: true,
          registrationDate: new Date().toISOString(),
          // Qo'shimcha ma'lumotlar
          formData: {
            companyName: formData.companyName.trim(),
            bin: formData.bin.trim(),
            address: formData.address.trim(),
            description: formData.description.trim(),
            logoPreview: logoPreview
          }
        }
      });

    } catch (error) {
      console.error('Company registration error:', error);
      toast({
        title: t('CompanyRegistration.company.error', 'Ошибка!'),
        description: error.message || t('CompanyRegistration.company.error', 'Что-то пошло не так. Пожалуйста, попробуйте снова.'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1)
  };

  // Formni to'ldirish foizini hisoblash
  const calculateCompletionPercentage = () => {
    const requiredFields = ['companyName', 'bin', 'address']; // country va city o'rniga address
    const filledFields = requiredFields.filter(field => 
      formData[field] && formData[field].toString().trim() !== ''
    );
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();

  return (
    <>
      <SideTranslator />
      <Box minH="100vh" bg="gray.50" py={{ base: "40px", md: 8 }}>
        <Container maxW="lg" px={{ base: 4, md: 6 }}>
          <VStack spacing={{ base: 3, md: 6 }} align="center">
            
            {/* Back Button */}
            <Button
              variant="ghost"
              leftIcon={<MdArrowBack />}
              onClick={handleBackClick}
              alignSelf="flex-start"
              color="gray.600"
              _hover={{ color: "gray.800", bg: "gray.100" }}
              size="sm"
            >
              {t('CompanyRegistration.company.register_title', 'Регистрация компании')}
            </Button>

            {/* Progress indicator */}
            {completionPercentage > 0 && (
              <Box w="full" bg="gray.200" borderRadius="full" h="2">
                <Box
                  bg="#fed500"
                  h="2"
                  borderRadius="full"
                  transition="width 0.3s ease"
                  width={`${completionPercentage}%`}
                />
                <Text fontSize="xs" color="gray.500" mt={1} textAlign="center">
                  {t('CompanyRegistration.company.completed', 'Заполнено:')} {completionPercentage}%
                </Text>
              </Box>
            )}

            {/* Logo Upload */}
            <Flex mt={completionPercentage > 0 ? 4 : 10} align="center" gap={6} w="full" justify="center">
              <Box position="relative" flexShrink={0}>
                <Avatar
                  size={"xl"}
                  src={logoPreview}
                  bg="gray.200"
                  cursor="pointer"
                  onClick={handleLogoClick}
                  _hover={{ opacity: 0.8 }}
                  icon={<MdBusiness size="40" />}
                />
                <Box
                  position="absolute"
                  bottom={0}
                  right={0}
                  bg="#fed500"
                  borderRadius="full"
                  p={2}
                  display={"flex"}
                  justifyContent={'center'}
                  alignItems={'center'}
                  cursor="pointer"
                  onClick={handleLogoClick}
                  _hover={{ bg: "#f5cd00" }}
                >
                  <Icon as={MdCameraAlt} w={4} h={4} color="gray.800" />
                </Box>
              </Box>
              
              <VStack spacing={1} align="flex-start" flex={1}>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  {t('CompanyRegistration.company.upload_logo', 'Загрузить логотип компании')}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {t("Orderform.form.attachments.formats", "Поддерживаются форматы SVG, PNG, JPG, JPEG")} (MAX. 5MB)
                </Text>
                <Button
                  mt={2}
                  size="sm"
                  bg="#fed500"
                  color="gray.900"
                  _hover={{ bg: "#f5cd00" }}
                  onClick={handleLogoClick}
                  px={3}
                  py={1}
                  fontWeight={"500"}
                >
                  {logoPreview ? t("CompanyRegistration.company.change", 'Изменить логотип') : t("CompanyRegistration.company.upload", 'Загрузить логотип')}
                </Button>
              </VStack>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                onChange={handleLogoChange}
                style={{ display: 'none' }}
              />
            </Flex>

            {/* Form */}
            <VStack spacing={4} w="full">
              
              {/* Address Input with LocationSearchInput */}
              <FormControl isInvalid={!!errors.address} isRequired>
                <FormLabel fontSize="sm" fontWeight="semibold" mb={1}>
                  {t('CompanyRegistration.company.address', 'Адрес компании')}
                </FormLabel>
                <LocationSearchInput
                  value={formData.address}
                  onChange={(value) => handleInputChange('address', value)}
                  placeholder={t('CompanyRegistration.company.enter_address', 'Введите адрес компании')}
                  i18n={i18n}
                  inputProps={{
                    borderColor: errors.address ? "red.300" : "gray.300",
                    _hover: { borderColor: errors.address ? "red.400" : "gray.400" },
                    _focus: { 
                      borderColor: errors.address ? "red.500" : "#fed500", 
                      boxShadow: errors.address ? "0 0 0 1px #E53E3E" : "0 0 0 1px #fed500",
                      _hover: { borderColor: errors.address ? "red.500" : "#fed500" }
                    },
                    bg: "white"
                  }}
                />
                {errors.address && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.address}
                  </Text>
                )}
              </FormControl>

              {/* Company Name */}
              <FormControl isInvalid={!!errors.companyName} isRequired>
                <Input
                  placeholder={t('CompanyRegistration.company.name', 'Название компании')}
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  borderColor={errors.companyName ? "red.300" : "gray.300"}
                  _hover={{ borderColor: errors.companyName ? "red.400" : "gray.400" }}
                  _focus={{ 
                    borderColor: errors.companyName ? "red.500" : "#fed500", 
                    boxShadow: errors.companyName ? "0 0 0 1px #E53E3E" : "0 0 0 1px #fed500",
                    _hover: { borderColor: errors.companyName ? "red.500" : "#fed500" }
                  }}
                  bg="white"
                  maxLength={100}
                />
                {errors.companyName && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.companyName}
                  </Text>
                )}
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {formData.companyName.length}/{t('CompanyRegistration.company.max_chars', '100')}
                </Text>
              </FormControl>

              {/* BIN */}
              <FormControl isInvalid={!!errors.bin} isRequired>
                <Input
                  placeholder={t('CompanyRegistration.company.bin', 'БИН (9 цифр)')}
                  value={formData.bin}
                  onChange={handleBinChange}
                  borderColor={errors.bin ? "red.300" : "gray.300"}
                  _hover={{ borderColor: errors.bin ? "red.400" : "gray.400" }}
                  _focus={{ 
                    borderColor: errors.bin ? "red.500" : "#fed500", 
                    boxShadow: errors.bin ? "0 0 0 1px #E53E3E" : "0 0 0 1px #fed500",
                    _hover: { borderColor: errors.bin ? "red.500" : "#fed500" }
                  }}
                  bg="white"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                {errors.bin && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.bin}
                  </Text>
                )}
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {formData.bin.length}/{t('CompanyRegistration.company.digits_9', '9')}
                </Text>
              </FormControl>

              {/* Company Description */}
              <FormControl isInvalid={!!errors.description}>
                <Textarea
                  placeholder={t('CompanyRegistration.company.description', 'Описание вашей компании (необязательно)')}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  borderColor={errors.description ? "red.300" : "gray.300"}
                  _hover={{ borderColor: errors.description ? "red.400" : "gray.400" }}
                  _focus={{ 
                    borderColor: errors.description ? "red.500" : "#fed500", 
                    boxShadow: errors.description ? "0 0 0 1px #E53E3E" : "0 0 0 1px #fed500",
                    _hover: { borderColor: errors.description ? "red.500" : "#fed500" }
                  }}
                  bg="white"
                  rows={4}
                  resize="none"
                  maxLength={500}
                />
                {errors.description && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.description}
                  </Text>
                )}
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {formData.description.length}/{t('CompanyRegistration.company.max_500', '500')}
                </Text>
              </FormControl>

              {/* Submit Button */}
              <Button
                w="full"
                isLoading={isLoading}
                loadingText={t('CompanyRegistration.company.saving', 'Сохраняется...')}
                onClick={handleSubmit}
                bg="#fed500"
                color="gray.900"
                _hover={{ bg: "#f5cd00" }}
                _active={{ bg: "#e6bf00" }}
                _disabled={{ 
                  bg: "gray.300",
                  color: "gray.500",
                  cursor: "not-allowed"
                }}
                mt={2}
                fontWeight={"500"}
                isDisabled={completionPercentage < 100}
              >
                {completionPercentage < 100 
                  ? `${t("CompanyRegistration.company.fill_all", "Заполните все поля")} (${completionPercentage}%)`
                  : t("CompanyRegistration.company.confirm", 'Подтвердить')
                }
              </Button>
            </VStack>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default CompanyRegistration;
