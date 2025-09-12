import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Text, VStack, Input, Icon, useToast,
  Heading, Container, FormControl, FormLabel, Select,
  InputGroup, InputRightElement, Avatar, Flex, HStack,
  Spinner, List, ListItem, useOutsideClick
} from '@chakra-ui/react';
import { MdArrowBack, MdPerson, MdCameraAlt } from 'react-icons/md';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './logic/AuthContext';
import { useTranslation } from 'react-i18next';

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
      const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(searchQuery)}&language=${selected_Lang}`);
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

const UserProfileCompletion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateUserProfile } = useAuth();
  const fileInputRef = useRef(null);
  const { t, i18n } = useTranslation();
  // Location state dan ma'lumotlarni olish
  const { emailOrPhone, country, verified } = location.state || {};
  
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    password: '',
    confirmPassword: '',
    avatar: null
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const toast = useToast();

  // Agar state ma'lumotlari yo'q bo'lsa yoki tasdiqlanmagan bo'lsa, yo'naltirish
  useEffect(() => {
    if (!emailOrPhone || !country || !verified) {
      toast({
        title: t("UserComplation.error", "Ошибка!"),
        description: t("UserComplation.emailConfirmationRequired", "Сначала подтвердите электронную почту."),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/auth/register');
    }
  }, [emailOrPhone, country, verified, navigate, toast]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Xatolikni tozalash
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Fayl hajmini tekshirish (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t('UserCompletion.error', "Ошибка!"),
          description: t('UserCompletion.imageTooLarge', "Размер файла превышает 5MB!"),
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
          title: t('UserCompletion.error', "Ошибка!"),
          description: t('UserCompletion.invalidImageFormat', "Допускаются только изображения в форматах JPG, PNG, SVG."),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // FileReader bilan rasmni o'qish
      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          setAvatarPreview(e.target.result);
          setFormData(prev => ({
            ...prev,
            avatar: e.target.result // Faqat base64 string saqlaymiz
          }));
          toast({
            title: t('UserCompletion.success', "Успешно!"),
            description: t('UserCompletion.imageUploaded', "Изображение успешно загружено!"),
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Ism tekshiruvi
    if (!formData.fullName.trim()) {
      newErrors.fullName = t("UserCompletion.enterFullName", "Введите Ф.И.О.");
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = t("UserCompletion.fullNameTooShort", "Ф.И.О. должно содержать более 2 символов.");
    }

    // Address tekshiruvi
    if (!formData.address) {
      newErrors.address = t("UserCompletion.selectAddress", "Введите адрес.");
    }

    // Parol tekshiruvi
    if (!formData.password) {
      newErrors.password = t("UserCompletion.enterPassword", "Введите пароль.");
    } else if (formData.password.length < 6) {
      newErrors.password = t("UserCompletion.passwordTooShort", "Пароль должен содержать более 6 символов.");
    }

    // Parolni tasdiqlash tekshiruvi
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("UserCompletion.reenterPassword", "Повторите пароль.");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("UserCompletion.passwordMismatch", "Пароли не совпадают.");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // API ga yuborilayotgan ma'lumotlar
      const profileData = {
        emailOrPhone,
        fullName: formData.fullName.trim(),
        address: formData.address,
        password: formData.password,
        avatar: formData.avatar,
        timestamp: new Date().toISOString()
      };

      // console.log('Profile completion data:', profileData);

      // Demo uchun 2 soniya kutish
      await new Promise(resolve => setTimeout(resolve, 2000));

      // AuthContext orqali profil ma'lumotlarini saqlash
      await updateUserProfile(profileData);

      toast({
        title: t("UserCompletion.success", "Успешно!"),
        description: t("UserCompletion.profileCompleted", "Профиль успешно создан!"),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Login sahifasiga yo'naltirish
      setTimeout(() => {
        navigate('/auth/login', {
          state: {
            emailOrPhone: emailOrPhone,
            message: t("UserCompletion.profileCreated", "Ваш профиль успешно создан. Теперь вы можете войти в систему."),
            profileCompleted: true
          }
        });
      }, 1500);

    } catch (error) {
      console.error('Profile completion error:', error);
      toast({
        title: t("UserCompletion.error", "Ошибка!"),
        description: error.message || t("UserCompletion.genericError", "Что-то пошло не так. Пожалуйста, попробуйте еще раз."),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/auth/register', {
      state: { emailOrPhone, country, type: emailOrPhone?.includes('@') ? 'email' : 'phone' }
    });
    console.log('Back button clicked');
  };

  // Agar state ma'lumotlari yo'q bo'lsa, loading ko'rsatish
  if (!emailOrPhone || !country || !verified) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Text>{t("UserCompletion.loading", "Загрузка...")}</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={{ base: 2, md: 8 }}>
      <Container maxW="md" px={{ base: 4, md: 6 }}>
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
            {t("UserCompletion.back", "Назад")}
          </Button>

          {/* Header - Compact */}
          <VStack spacing={2} textAlign="center">
            <Box 
              w={12} 
              h={12} 
              bg="#fff8cc" 
              borderRadius="full" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
            >
              <Icon as={MdPerson} w={6} h={6} color="#fed500" />
            </Box>
            <Heading size="md" color="gray.800">
              {t("UserCompletion.userData", "Данные Пользователя")}
            </Heading>
            <Text fontSize="xs" color="gray.600" textAlign="center">
              {emailOrPhone} {t("UserComplation.completeProfile", "Заполните информацию профиля")}
            </Text>
          </VStack>

          {/* Avatar Upload - Compact */}
          <Flex align="center" gap={6} w="full">
            <Box position="relative" flexShrink={0}>
              <Avatar
                size={"xl"}
                src={avatarPreview}
                bg="gray.200"
                cursor="pointer"
                onClick={handleAvatarClick}
                _hover={{ opacity: 0.8 }}
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
                onClick={handleAvatarClick}
                _hover={{ bg: "#f5cd00" }}
              >
                <Icon as={MdCameraAlt} w={4} h={4} color="gray.800" />
              </Box>
            </Box>
            
            <VStack spacing={1} align="flex-start" flex={1}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                {t("UserComplation.uploadPhoto", "Загрузить фото")}
              </Text>
              <Text fontSize="xs" color="gray.500">
                SVG, PNG, JPG (MAX. 5MB)
              </Text>
              <Button
                mt={2}
                size="sm"
                bg="#fed500"
                color="gray.900"
                _hover={{ bg: "#f5cd00" }}
                onClick={handleAvatarClick}
                px={3}
                py={1}
              >
                {t("UserComplation.choose", "Выбрать")}
              </Button>
            </VStack>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/svg+xml"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </Flex>

          {/* Form - Compact */}
          <VStack spacing={4} w="full">
            
            {/* Address Selection */}
            <FormControl isInvalid={!!errors.address}>
              <FormLabel fontSize="sm" fontWeight="semibold" mb={1}>
                {t("UserComplation.address", "Адрес")}
              </FormLabel>
              <LocationSearchInput
                value={formData.address}
                onChange={(value) => handleInputChange('address', value)}
                placeholder={t("UserComplation.enterAddress", "Введите адрес")}
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

            {/* Full Name */}
            <FormControl isInvalid={!!errors.fullName}>
              <FormLabel fontSize="sm" fontWeight="semibold" mb={1}>
                {t("UserComplation.fullName", "Ф.И.О")} <Text as="span" color="red.500">*</Text>
              </FormLabel>
              <Input
                placeholder="Введите ваше полное имя"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                borderColor={errors.fullName ? "red.300" : "gray.300"}
                _hover={{ borderColor: errors.fullName ? "red.400" : "gray.400" }}
                _focus={{ 
                  borderColor: errors.fullName ? "red.500" : "#fed500", 
                  boxShadow: errors.fullName ? "0 0 0 1px #E53E3E" : "0 0 0 1px #fed500",
                  _hover: { borderColor: errors.fullName ? "red.500" : "#fed500" }
                }}
                bg="white"
              />
              {errors.fullName && (
                <Text color="red.500" fontSize="xs" mt={1}>
                  {errors.fullName}
                </Text>
              )}
            </FormControl>

            {/* Password */}
            <FormControl isInvalid={!!errors.password}>
              <FormLabel fontSize="sm" fontWeight="semibold" mb={1}>
                {t("UserComplation.createPassword", "Придумайте пароль")} <Text as="span" color="red.500">*</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("UserComplation.passwordPlaceholder", "Введите пароль")}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  borderColor={errors.password ? "red.300" : "gray.300"}
                  _hover={{ borderColor: errors.password ? "red.400" : "gray.400" }}
                  _focus={{ 
                    borderColor: errors.password ? "red.500" : "#fed500", 
                    boxShadow: errors.password ? "0 0 0 1px #E53E3E" : "0 0 0 1px #fed500",
                    _hover: { borderColor: errors.password ? "red.500" : "#fed500" }
                  }}
                  bg="white"
                />
                <InputRightElement>
                  <Icon
                    as={showPassword ? FaEyeSlash : FaEye}
                    cursor="pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    color="gray.500"
                    _hover={{ color: "gray.700" }}
                    w={4}
                    h={4}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && (
                <Text color="red.500" fontSize="xs" mt={1}>
                  {errors.password}
                </Text>
              )}
            </FormControl>

            {/* Confirm Password */}
            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel fontSize="sm" fontWeight="semibold" mb={1}>
                {t("UserComplation.repeatPassword", "Повторите пароль")}
              </FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("UserComplation.confirmPasswordPlaceholder", "Подтвердите пароль")}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  borderColor={errors.confirmPassword ? "red.300" : "gray.300"}
                  _hover={{ borderColor: errors.confirmPassword ? "red.400" : "gray.400" }}
                  _focus={{ 
                    borderColor: errors.confirmPassword ? "red.500" : "#fed500", 
                    boxShadow: errors.confirmPassword ? "0 0 0 1px #E53E3E" : "0 0 0 1px #fed500",
                    _hover: { borderColor: errors.confirmPassword ? "red.500" : "#fed500" }
                  }}
                  bg="white"
                />
                <InputRightElement>
                  <Icon
                    as={showConfirmPassword ? FaEyeSlash : FaEye}
                    cursor="pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    color="gray.500"
                    _hover={{ color: "gray.700" }}
                    w={4}
                    h={4}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.confirmPassword && (
                <Text color="red.500" fontSize="xs" mt={1}>
                  {errors.confirmPassword}
                </Text>
              )}
            </FormControl>

            {/* Submit Button */}
            <Button
              w="full"
              isLoading={isLoading}
              loadingText={t("UserComplation.saving", "Сохраняется...")}
              onClick={handleSubmit}
              bg="#fed500"
              color="gray.900"
              _hover={{ bg: "#f5cd00" }}
              _active={{ bg: "#e6bf00" }}
              mt={2}
            >
              {t("UserComplation.confirm", "Подтвердить")}
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default UserProfileCompletion;