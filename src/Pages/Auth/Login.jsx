import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Link,
  VStack,
  Heading,
  Icon,
  Flex,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { FaChevronLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "./logic/AuthContext";
import SideTranslator from "../SideTranslator";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState(""); // "email" yoki "phone"
  
  const toast = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // AuthContext dan login funksiyasini olish
  const { login, isAuthenticated } = useAuth();

  // Agar foydalanuvchi allaqachon login qilgan bo'lsa, bosh sahifaga yo'naltirish
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Register sahifasidan kelgan email/phone ni olish
  useEffect(() => {
    if (location.state?.emailOrPhone) {
      const value = location.state.emailOrPhone;
      setEmailOrPhone(value);
      // Input turini aniqlash
      if (/^[a-zA-Z]/.test(value)) {
        setInputType("email");
      } else if (/^[0-9]/.test(value)) {
        setInputType("phone");
      }
    }
  }, [location.state]);

  // Email validation regex memoized
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  // Phone validation regex (9 raqam)
  const phoneRegex = useMemo(() => /^[0-9]{9}$/, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = t("auth_login.email_or_phone_err", "Email или номер обязательны для заполнения");
    } else if (inputType === "email") {
      // Email validation
      if (!emailRegex.test(emailOrPhone)) {
        newErrors.emailOrPhone = t("auth_login.email_format_error", "Email введён неправильно!");
      }
    } else if (inputType === "phone") {
      // Phone validation - faqat raqamlarni tekshirish
      if (!phoneRegex.test(emailOrPhone)) {
        newErrors.emailOrPhone = t("auth_login.invalidPhoneLength", "Номер телефона должен содержать 9 цифр");
      }
    }

    if (!password.trim()) {
      newErrors.password = t("auth_login.password_err", "Пароль введён неправильно!");
    } else if (password.length < 6) {
      newErrors.password = t("auth_login.passwordMinLength", "Пароль должен содержать не менее 6 символов");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [emailOrPhone, password, inputType, t, emailRegex, phoneRegex]);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: t("auth_login.error", "Ошибка"),
        description: t("auth_login.fillAllFields", "Пожалуйста, заполните все поля правильно"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(emailOrPhone, password);
      toast({
        title: t("auth_login.success", "Успешно"),
        description: t("auth_login.loginSuccess", "Вы успешно вошли в систему!"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Bosh sahifaga yo'naltirish
      navigate("/", { replace: true });
      
    } catch (error) {
      toast({
        title: t("auth_login.loginErrorTitle", "Ошибка входа"),
        description: error.message || t("auth_login.loginErrorMessage", "Произошла ошибка во время входа в систему"),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, toast, navigate, emailOrPhone, password, login]);

  const handleEmailOrPhoneChange = useCallback((e) => {
    let value = e.target.value;
    
    // Agar input bo'sh bo'lsa, turni reset qilamiz
    if (!value.trim()) {
      setEmailOrPhone("");
      setInputType("");
      return;
    }

    // Birinchi belgiga qarab input turini aniqlaymiz
    const firstChar = value.charAt(0);
    
    if (/^[a-zA-Z]/.test(firstChar)) {
      // Email input - harflar, raqamlar, @, ., _, - qabul qiladi
      const emailValue = value.replace(/[^a-zA-Z0-9@._-]/g, '');
      setEmailOrPhone(emailValue);
      setInputType("email");
    } else if (/^[0-9]/.test(firstChar)) {
      // Phone input - faqat raqamlar, maksimal 9 ta
      const phoneValue = value.replace(/\D/g, '').slice(0, 9);
      setEmailOrPhone(phoneValue);
      setInputType("phone");
    } else {
      // Noto'g'ri belgi kiritilgan bo'lsa, o'zgarishni rad qilamiz
      return;
    }
    
    // Clear error when user starts typing
    if (errors.emailOrPhone) {
      setErrors(prev => ({ ...prev, emailOrPhone: null }));
    }
  }, [errors.emailOrPhone]);

  const handlePasswordChange = useCallback((e) => {
    const value = e.target.value;
    setPassword(value);
    
    // Clear error when user starts typing
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: null }));
    }
  }, [errors.password]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleBackClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleForgotPasswordClick = useCallback(() => {
    navigate("/forgot-password");
  }, [navigate]);

  const handleRegisterClick = useCallback(() => {
    navigate("/auth/register");
  }, [navigate]);

  const getInputPlaceholder = () => {
    if (inputType === "email") {
      return "example@mail.com";
    } else if (inputType === "phone") {
      return "901234567";
    }
    return "example@mail.com yoki 901234567";
  };

  const getInputProps = () => {
    const baseProps = {
      placeholder: getInputPlaceholder(),
      value: emailOrPhone,
      onChange: handleEmailOrPhoneChange,
      borderColor: errors.emailOrPhone ? "red.300" : "gray.300",
      _hover: { borderColor: "gray.400" },
      _focus: { 
        borderColor: "orange.500", 
        boxShadow: "0 0 0 1px #fed500",
        _hover: { borderColor: "orange.500" }
      },
      size: { base: "lg", md: "lg", lg: "lg" },
      autoComplete: "username"
    };

    if (inputType === "phone") {
      return {
        ...baseProps,
        type: "tel",
        inputMode: "numeric",
        pl: { base: "60px", md: "65px" }
      };
    } else if (inputType === "email") {
      return {
        ...baseProps,
        type: "email"
      };
    } else {
      return {
        ...baseProps,
        type: "text"
      };
    }
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
          maxW={{ base: "400px", md: "480px", lg: "520px", xl: "560px" }}
          mx="auto"
          p={{ base: 6, md: 8, lg: 10, xl: 12 }}
          borderRadius={{ base: "xl", md: "2xl" }}
          boxShadow={{ base: "lg", md: "xl", lg: "2xl" }}
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
            size={{ base: "md", md: "lg" }}
            mb={{ base: 6, md: 8, lg: 10 }}
            display="flex"
            alignItems="center"
            gap={2}
            transition="color 0.2s"
          >
            <Icon as={FaChevronLeft} />
            <Text>{t("auth_login.login", "Вход")}</Text>
          </Heading>

          <Box as="form" onSubmit={handleLogin}>
            <VStack spacing={{ base: 5, md: 6, lg: 7 }} align="stretch">
              <FormControl 
                isInvalid={!!errors.emailOrPhone} 
                isRequired
              >
                <FormLabel 
                  fontSize={{ base: "sm", md: "md" }} 
                  fontWeight="semibold"
                  mb={{ base: 2, md: 3 }}
                >
                  {t("auth_login.email_or_phone", "Email или номер телефона")}
                </FormLabel>
                
                {inputType === "phone" ? (
                  <Box position="relative">
                    <Text
                      position="absolute"
                      left={{ base: 3, md: 4 }}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.600"
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="medium"
                      zIndex={1}
                      pointerEvents="none"
                    >
                      +998
                    </Text>
                    <Input {...getInputProps()} />
                  </Box>
                ) : (
                  <Input {...getInputProps()} />
                )}
                
                <FormErrorMessage fontSize={{ base: "sm", md: "md" }}>
                  {errors.emailOrPhone}
                </FormErrorMessage>
              </FormControl>

              <FormControl 
                isInvalid={!!errors.password} 
                isRequired
              >
                <FormLabel 
                  fontSize={{ base: "sm", md: "md" }} 
                  fontWeight="semibold"
                  mb={{ base: 2, md: 3 }}
                >
                  {t("auth_login.password", "Пароль")}
                </FormLabel>
                <InputGroup size={{ base: "lg", md: "lg", lg: "lg" }}>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth_login.password", "Пароль")}
                    value={password}
                    onChange={handlePasswordChange}
                    borderColor={errors.password ? "red.300" : "gray.300"}
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ 
                      borderColor: "orange.500", 
                      boxShadow: "0 0 0 1px #fed500",
                      _hover: { borderColor: "orange.500" }
                    }}
                    autoComplete="current-password"
                  />
                  <InputRightElement>
                    <Icon
                      mb={2}
                      as={showPassword ? FaEyeSlash : FaEye}
                      cursor="pointer"
                      onClick={togglePasswordVisibility}
                      color="gray.500"
                      _hover={{ color: "gray.700" }}
                      transition="color 0.2s"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      w={{ base: 4, md: 5 }}
                      h={{ base: 4, md: 5 }}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize={{ base: "sm", md: "md" }}>
                  {errors.password}
                </FormErrorMessage>
              </FormControl>

              <Box textAlign="right" w="full">
                <Link
                  color="#9a8700"
                  fontWeight="600"
                  fontSize={{ base: "sm", md: "md" }}
                  onClick={handleForgotPasswordClick}
                  _hover={{ 
                    textDecoration: "underline", 
                    color: "#b89e00" 
                  }}
                  transition="color 0.2s"
                >
                  {t("auth_login.forgot_passw", "Забыли пароль?")}
                </Link>
              </Box>

              <Button
                type="submit"
                bg="#fed500"
                color="gray.900"
                w="100%"
                size={{ base: "lg", md: "lg", lg: "lg" }}
                h={{ base: "48px", md: "52px", lg: "56px" }}
                fontWeight="600"
                fontSize={{ base: "md", md: "lg" }}
                _hover={{ bg: "#f5cd00" }}
                _active={{ bg: "#e6bf00" }}
                isLoading={isLoading}
                loadingText={t("auth_login.verifying", "Проверяется...")}
                transition="background-color 0.2s"
                boxShadow="0 2px 8px rgba(254, 213, 0, 0.15)"
                _focus={{ boxShadow: "0 0 0 3px rgba(254, 213, 0, 0.2)" }}
              >
                {t("auth_login.login_verify", "Подтвердить")}
              </Button>

              <Text 
                fontSize={{ base: "sm", md: "md" }} 
                textAlign="center" 
                color="gray.600"
              >
                {t("auth_login.no_account", "Нет аккаунта?")} {" "}
                <Link
                  color="#9a8700"
                  fontWeight="600"
                  onClick={handleRegisterClick}
                  _hover={{ 
                    textDecoration: "underline", 
                    color: "#b89e00" 
                  }}
                  transition="color 0.2s"
                >
                  {t("auth_login.register", "Регистрация")}
                </Link>
              </Text>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default Login;