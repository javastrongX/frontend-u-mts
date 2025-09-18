import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../logic/AuthContext";
import { validateRegistrationForm } from "../utils/validation";
import { COUNTRIES } from "../constants/countries";

export const useRegistration = () => {
  const [country, setCountry] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { t } = useTranslation();
  const { isUserExists, registerUser, isAuthenticated } = useAuth();

  const isUzbekistan = country === "uz";
  const selectedCountry = COUNTRIES.find(c => c.value === country);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Pre-fill form from navigation state
  useEffect(() => {
    if (location.state?.emailOrPhone) {
      setEmailOrPhone(location.state.emailOrPhone);
    }
    if (location.state?.country) {
      setCountry(location.state.country);
    }
  }, [location.state]);

  const handleCountryChange = useCallback((selectedValue) => {
    setCountry(selectedValue);
    setEmailOrPhone(""); // Clear email/phone when country changes
    
    // Clear errors when country changes
    if (errors.country || errors.emailOrPhone) {
      setErrors(prev => ({ 
        ...prev, 
        country: null, 
        emailOrPhone: null 
      }));
    }
  }, [errors.country, errors.emailOrPhone]);

  const handleContactChange = useCallback((value) => {
    setEmailOrPhone(value);
    
    // Clear error when user starts typing
    if (errors.emailOrPhone) {
      setErrors(prev => ({ ...prev, emailOrPhone: null }));
    }
  }, [errors.emailOrPhone]);

  const validateForm = useCallback(() => {
    const newErrors = validateRegistrationForm(country, emailOrPhone, t);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [country, emailOrPhone, t]);

  const handleSubmit = useCallback(async (e) => {
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

    // Check if user already exists
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
      
      // Register new user
      const newUser = registerUser({
        country: selectedCountry.label,
        countryCode: country,
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
          country: selectedCountry.label,
          countryCode: country,
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

  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleLoginClick = useCallback(() => {
    navigate("/auth/login");
  }, [navigate]);

  return {
    // State
    country,
    emailOrPhone,
    errors,
    isLoading,
    isUzbekistan,
    selectedCountry,
    t,
    
    // Handlers
    handleCountryChange,
    handleContactChange,
    handleSubmit,
    handleBackClick,
    handleLoginClick,
  };
};