import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Link,
  VStack,
  Heading,
  Icon,
  Flex,
  List,
  ListItem,
  useDisclosure,
  useOutsideClick,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronDown, FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "./logic/AuthContext";
import SideTranslator from "../SideTranslator";

const Register = () => {
  const [country, setCountry] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const selectRef = useRef();
  const toast = useToast();
  const { t } = useTranslation();
  const { isUserExists, registerUser, isAuthenticated } = useAuth();

  // Country list with flags
  const countries = [
    { value: "uz", label: "Узбекистан", flag: "🇺🇿" },
    { value: "af", label: "Афганистан", flag: "🇦🇫" },
    { value: "am", label: "Армения", flag: "🇦🇲" },
    { value: "az", label: "Азербайджан", flag: "🇦🇿" },
    { value: "bh", label: "Бахрейн", flag: "🇧🇭" },
    { value: "bd", label: "Бангладеш", flag: "🇧🇩" },
    { value: "bt", label: "Бутан", flag: "🇧🇹" },
    { value: "bn", label: "Бруней", flag: "🇧🇳" },
    { value: "kh", label: "Камбоджа", flag: "🇰🇭" },
    { value: "cn", label: "Китай", flag: "🇨🇳" },
    { value: "cy", label: "Кипр", flag: "🇨🇾" },
    { value: "ge", label: "Грузия", flag: "🇬🇪" },
    { value: "in", label: "Индия", flag: "🇮🇳" },
    { value: "id", label: "Индонезия", flag: "🇮🇩" },
    { value: "ir", label: "Иран", flag: "🇮🇷" },
    { value: "iq", label: "Ирак", flag: "🇮🇶" },
    { value: "jp", label: "Япония", flag: "🇯🇵" },
    { value: "jo", label: "Иордания", flag: "🇯🇴" },
    { value: "kz", label: "Казахстан", flag: "🇰🇿" },
    { value: "kr", label: "Южная Корея", flag: "🇰🇷" },
    { value: "kw", label: "Кувейт", flag: "🇰🇼" },
    { value: "kg", label: "Кыргызстан", flag: "🇰🇬" },
    { value: "la", label: "Лаос", flag: "🇱🇦" },
    { value: "lb", label: "Ливан", flag: "🇱🇧" },
    { value: "my", label: "Малайзия", flag: "🇲🇾" },
    { value: "mv", label: "Мальдивы", flag: "🇲🇻" },
    { value: "mn", label: "Монголия", flag: "🇲🇳" },
    { value: "mm", label: "Мьянма", flag: "🇲🇲" },
    { value: "np", label: "Непал", flag: "🇳🇵" },
    { value: "om", label: "Оман", flag: "🇴🇲" },
    { value: "pk", label: "Пакистан", flag: "🇵🇰" },
    { value: "ps", label: "Палестина", flag: "🇵🇸" },
    { value: "qa", label: "Катар", flag: "🇶🇦" },
    { value: "ru", label: "Россия", flag: "🇷🇺" },
    { value: "sa", label: "Саудовская Аравия", flag: "🇸🇦" },
    { value: "sg", label: "Сингапур", flag: "🇸🇬" },
    { value: "lk", label: "Шри-Ланка", flag: "🇱🇰" },
    { value: "sy", label: "Сирия", flag: "🇸🇾" },
    { value: "tj", label: "Таджикистан", flag: "🇹🇯" },
    { value: "th", label: "Таиланд", flag: "🇹🇭" },
    { value: "tr", label: "Турция", flag: "🇹🇷" },
    { value: "tm", label: "Туркменистан", flag: "🇹🇲" },
    { value: "ae", label: "Объединённые Арабские Эмираты", flag: "🇦🇪" },
    { value: "vn", label: "Вьетнам", flag: "🇻🇳" },
    { value: "ye", label: "Йемен", flag: "🇾🇪" },
    { value: "hk", label: "Гонконг", flag: "🇭🇰" },
    { value: "mo", label: "Макао", flag: "🇲🇴" },
    { value: "tw", label: "Тайвань", flag: "🇹🇼" },
  ];


  // Email validation regex memoized
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  // Phone validation regex for Uzbekistan (only digits after +998)
  const phoneRegex = useMemo(() => /^[0-9]{9}$/, []);

  // Filter countries by search
  const filteredCountries = useMemo(() => countries.filter(countryItem =>
    countryItem.label.toLowerCase().includes(searchTerm.toLowerCase())
  ), [searchTerm]);

  const selectedCountry = countries.find(c => c.value === country);
  const isUzbekistan = country === "uz";

  // Agar foydalanuvchi allaqachon login qilgan bo'lsa, bosh sahifaga yo'naltirish
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useOutsideClick({
    ref: selectRef,
    handler: onClose,
  });

  const handleCountrySelect = useCallback((selectedValue) => {
    setCountry(selectedValue);
    setSearchTerm("");
    setEmailOrPhone(""); // Clear email/phone when country changes
    onClose();
    
    // Clear errors when country changes
    if (errors.country || errors.emailOrPhone) {
      setErrors(prev => ({ 
        ...prev, 
        country: null, 
        emailOrPhone: null 
      }));
    }
  }, [errors.country, errors.emailOrPhone]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!country) {
      newErrors.country = t('auth_register.country_err', "Пожалуйста, выберите страну");
    }
    
    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = isUzbekistan 
        ? t('auth_register.phone_err', "Номер телефона обязателен") 
        : t('auth_register.email_err', "Email обязателен");
    } else {
      if (isUzbekistan) {
        // Phone validation for Uzbekistan (only digits, 9 characters)
        if (!phoneRegex.test(emailOrPhone)) {
          newErrors.emailOrPhone = t('auth_register.phone_format_error', "Неверный формат номера телефона");
        }
      } else {
        // Email validation for other countries
        if (!emailRegex.test(emailOrPhone)) {
          newErrors.emailOrPhone = t('auth_register.email_format_error', "Неверный формат email");
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [country, emailOrPhone, t, isUzbekistan, emailRegex, phoneRegex]);

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: t("auth_register.error", "Произошла ошибка!"),
        description: t("auth_register.fill_fields", "Пожалуйста, заполните все поля"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Foydalanuvchi mavjudligini tekshirish
    if (isUserExists(emailOrPhone)) {
      toast({
        title: t("auth_register.userExists", "Пользователь уже существует"),
        description: t("auth_register.userExistsDescription", "Этот email/номер телефона уже зарегистрирован. Перейдите на страницу входа."),
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      navigate("/auth/login", { 
        state: { 
          emailOrPhone: emailOrPhone 
        } 
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Yangi foydalanuvchini ro'yxatga olish (country bilan birga)
      const newUser = registerUser({
        country: selectedCountry.label, // Country nomini saqlash
        countryCode: country, // Country code ni ham saqlash
        emailOrPhone,
        type: isUzbekistan ? 'phone' : 'email'
      });

      toast({
        title: t("auth_register.registerSuccess", "Регистрация прошла успешно"),
        description: t("auth_register.verificationCodeSent", "Код подтверждения отправлен. Проверьте email/телефон."),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Navigate to verification page
      navigate("/verify", { 
        state: { 
          country: selectedCountry.label, // Country nomini uzatish
          countryCode: country, // Country code ni ham uzatish
          emailOrPhone,
          type: isUzbekistan ? 'phone' : 'email' 
        } 
      });
    } catch (error) {
      toast({
        title: t("auth_register.error", "Произошла ошибка!"),
        description: error.message || t("auth_register.registration_failed", "Произошла ошибка при регистрации!"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, toast, t, navigate, country, selectedCountry, emailOrPhone, isUzbekistan, isUserExists, registerUser]);

  const handleEmailOrPhoneChange = useCallback((e) => {
    let value = e.target.value;
    
    // For Uzbekistan, allow only digits and limit to 9 characters
    if (isUzbekistan) {
      value = value.replace(/\D/g, '').slice(0, 9);
    }
    
    setEmailOrPhone(value);
    
    // Clear error when user starts typing
    if (errors.emailOrPhone) {
      setErrors(prev => ({ ...prev, emailOrPhone: null }));
    }
  }, [errors.emailOrPhone, isUzbekistan]);

  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleLoginClick = useCallback(() => {
    navigate("/auth/login");
  }, [navigate]);

  const getInputPlaceholder = () => {
    if (isUzbekistan) {
      return "901234567";
    }
    return "example@mail.com";
  };

  const getInputLabel = () => {
    if (isUzbekistan) {
      return t("auth_register.phone", "Номер телефона");
    }
    return "Email";
  };

  return (
    <>
      <SideTranslator />
      <Flex 
        minH="100vh" 
        align="center" 
        justify="center" 
        bg="gray.50" 
        px={4}
      >
        <Box
          w="100%"
          maxW={{ base: "400px", md: "500px", lg: "600px" }}
          mx="auto"
          p={{ base: 6, md: 8, lg: 10 }}
          borderRadius="xl"
          boxShadow="lg"
          bg="white"
          border="1px solid"
          borderColor="gray.100"
          _hover={{ borderColor: "gray.200" }}
          transition="border-color 0.2s"
        >
          <Heading
            onClick={handleBackClick}
            cursor="pointer"
            _hover={{ color: "orange.500" }}
            as="h2"
            size="md"
            mb={8}
            display="flex"
            alignItems="center"
            gap={2}
            transition="color 0.2s"
          >
            <Icon as={FaChevronLeft} />
            <Text>{t("auth_register.register", "Регистрация")}</Text>
          </Heading>

          <Box as="form" onSubmit={handleRegister}>
            <VStack spacing={6} align="stretch">
              {/* Country select */}
              <FormControl 
                isInvalid={!!errors.country} 
                isRequired
              >
                <FormLabel fontSize="sm" fontWeight="semibold">
                  {t("auth_register.country", "Страна")}
                </FormLabel>
                <Box position="relative" ref={selectRef}>
                  <Box
                    display="flex"
                    alignItems="center"
                    border="1px solid"
                    borderColor={errors.country ? "red.300" : "gray.300"}
                    borderRadius="md"
                    px={3}
                    py={3}
                    cursor="pointer"
                    onClick={isOpen ? onClose : onOpen}
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ 
                      borderColor: "orange.500", 
                      boxShadow: "0 0 0 1px #fed500" 
                    }}
                    minH="48px"
                    size="lg"
                    transition="border-color 0.2s"
                  >
                    <Box flex={1} color={selectedCountry ? "black" : "gray.500"}>
                      {selectedCountry ? (
                        <Box display="flex" alignItems="center" gap={2}>
                          <Text fontSize="lg" as="span">{selectedCountry.flag}</Text>
                          <Text as="span">{selectedCountry.label}</Text>
                        </Box>
                      ) : (
                        <Text as="span">{t("auth_register.select_country", "Выберите страну")}</Text>
                      )}
                    </Box>
                    <Icon as={FaChevronDown} color="gray.400" />
                  </Box>
                  
                  <FormErrorMessage fontSize="sm">
                    {errors.country}
                  </FormErrorMessage>

                  {isOpen && (
                    <Box
                      position="absolute"
                      top="100%"
                      left={0}
                      right={0}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      boxShadow="lg"
                      zIndex={1000}
                      maxH="250px"
                      overflow="hidden"
                      mt={1}
                    >
                      <Box p={2} borderBottom="1px solid" borderColor="gray.100">
                        <Box position="relative">
                          <Icon
                            as={FaSearch}
                            position="absolute"
                            left={3}
                            top="50%"
                            transform="translateY(-50%)"
                            color="gray.400"
                            fontSize="sm"
                          />
                          <Input
                            placeholder={t("auth_register.input_placeleholder", "Поиск страны..")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            pl={8}
                            size="sm"
                            border="1px solid"
                            borderColor="gray.200"
                            _focus={{ borderColor: "orange.500" }}
                            autoComplete="off"
                          />
                        </Box>
                      </Box>
                      <List maxH="180px" overflowY="auto">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((countryOption) => (
                            <ListItem
                              key={countryOption.value}
                              px={3}
                              py={2}
                              cursor="pointer"
                              _hover={{ bg: country === countryOption.value ? "#f8dd54" : "orange.100" }}
                              bg={country === countryOption.value ? "orange.50" : "transparent"}
                              color={country === countryOption.value ? "orange.600" : "black"}
                              fontWeight={country === countryOption.value ? "500" : "normal"}
                              onClick={() => handleCountrySelect(countryOption.value)}
                              display="flex"
                              alignItems="center"
                              gap={2}
                            >
                              <Text fontSize="lg" as="span">{countryOption.flag}</Text>
                              <Text as="span">{countryOption.label}</Text>
                            </ListItem>
                          ))
                        ) : (
                          <ListItem px={3} py={4} color="gray.500" textAlign="center">
                            {t("auth_register.country_notFound", "Страна не найдена")}
                          </ListItem>
                        )}
                      </List>
                    </Box>
                  )}
                </Box>
              </FormControl>

              {/* Email or Phone based on country */}
              <FormControl 
                isInvalid={!!errors.emailOrPhone} 
                isRequired
              >
                <FormLabel fontSize="sm" fontWeight="semibold">
                  {getInputLabel()}
                </FormLabel>
                {isUzbekistan ? (
                  <Box position="relative">
                    <Text
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.600"
                      fontSize="lg"
                      fontWeight="medium"
                      zIndex={1}
                      pointerEvents="none"
                    >
                      +998
                    </Text>
                    <Input
                      placeholder={getInputPlaceholder()}
                      type="tel"
                      value={emailOrPhone}
                      onChange={handleEmailOrPhoneChange}
                      borderColor={errors.emailOrPhone ? "red.300" : "gray.300"}
                      _hover={{ borderColor: "gray.400" }}
                      _focus={{ 
                        borderColor: "orange.500", 
                        boxShadow: "0 0 0 1px #fed500",
                        _hover: { borderColor: "orange.500" }
                      }}
                      size="lg"
                      pl="60px"
                      autoComplete="tel"
                      inputMode="numeric"
                    />
                  </Box>
                ) : (
                  <Input
                    placeholder={getInputPlaceholder()}
                    type="email"
                    value={emailOrPhone}
                    onChange={handleEmailOrPhoneChange}
                    borderColor={errors.emailOrPhone ? "red.300" : "gray.300"}
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ 
                      borderColor: "orange.500", 
                      boxShadow: "0 0 0 1px #fed500",
                      _hover: { borderColor: "orange.500" }
                    }}
                    size="lg"
                    autoComplete="email"
                  />
                )}
                <FormErrorMessage fontSize="sm">
                  {errors.emailOrPhone}
                </FormErrorMessage>
              </FormControl>

              {/* Login link */}
              <Text fontSize="sm" textAlign="center" color="gray.600">
                {t("auth_register.already_login", "Уже зарегистрированы?")}{" "}
                <Link
                  color="#9a8700"
                  fontWeight="600"
                  onClick={handleLoginClick}
                  _hover={{ 
                    textDecoration: "underline", 
                    color: "#b89e00" 
                  }}
                  transition="color 0.2s"
                >
                  {t("auth_register.login", "Авторизуйтесь")}
                </Link>
              </Text>

              {/* Register button */}
              <Button
                type="submit"
                bg="#fed500"
                color="gray.900"
                w="100%"
                size="lg"
                fontWeight="600"
                _hover={{ bg: "#f5cd00" }}
                _active={{ bg: "#e6bf00" }}
                isLoading={isLoading}
                loadingText={t("auth_register.registering", "Проверяется...")}
                transition="background-color 0.2s"
                boxShadow="0 2px 8px rgba(254, 213, 0, 0.15)"
                _focus={{ boxShadow: "0 0 0 3px rgba(254, 213, 0, 0.2)" }}
              >
                {t("auth_register.continue", "Подтвердить")}
              </Button>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default Register;