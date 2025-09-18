import React, { useState } from 'react';
import {
  Box, Button, Text, VStack, Input, Icon, useToast,
  Heading, Container, FormControl, FormErrorMessage,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { MdEmail, MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './logic/AuthContext';
import { useTranslation } from 'react-i18next';

const ForgotPasswordForm = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [inputType, setInputType] = useState(''); // "email" yoki "phone"
  const toast = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // AuthContext dan funksiyalarni olish
  const { isUserExists, sendPasswordResetCode } = useAuth();

  const validateEmailOrPhone = (value, type) => {
    if (type === 'email') {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    } else if (type === 'phone') {
      // Phone validation (9 raqam)
      return value.length === 9 && /^[0-9]{9}$/.test(value);
    }
    return false;
  };

  const handleInputChange = (e) => {
    let value = e.target.value;

    // Agar input bo'sh bo'lsa, turni reset qilamiz
    if (!value.trim()) {
      setEmailOrPhone('');
      setInputType('');
      if (emailError) {
        setEmailError('');
      }
      return;
    }

    // Birinchi belgiga qarab input turini aniqlaymiz
    const firstChar = value.charAt(0);
    
    if (/^[a-zA-Z]/.test(firstChar)) {
      // Email input - harflar, raqamlar, @, ., _, - qabul qiladi
      const emailValue = value.replace(/[^a-zA-Z0-9@._-]/g, '');
      setEmailOrPhone(emailValue);
      setInputType('email');
    } else if (/^[0-9]/.test(firstChar)) {
      // Phone input - faqat raqamlar, maksimal 9 ta
      const phoneValue = value.replace(/\D/g, '').slice(0, 9);
      setEmailOrPhone(phoneValue);
      setInputType('phone');
    } else {
      // Noto'g'ri belgi kiritilgan bo'lsa, o'zgarishni rad qilamiz
      return;
    }

    // Error ni clear qilish
    if (emailError && value.trim()) {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailOrPhone.trim()) {
      setEmailError(t("ForgotPassword.emailOrPhoneRequired", "Необходимо ввести email или номер телефона"));
      return;
    }

    if (!inputType) {
      setEmailError(t("ForgotPassword.invalidFormat", "Введите правильный формат"));
      return;
    }

    if (!validateEmailOrPhone(emailOrPhone, inputType)) {
      if (inputType === 'email') {
        setEmailError(t("ForgotPassword.invalidEmail", "Введите правильный email"));
      } else {
        setEmailError(t("ForgotPassword.invalidPhone", "Введите правильный номер телефона"));
      }
      return;
    }

    // Foydalanuvchi mavjudligini tekshirish
    if (!isUserExists(emailOrPhone)) {
      setEmailError(t("ForgotPassword.userNotFound", "Пользователь с таким email или телефоном не найден"));
      return;
    }

    setIsLoading(true);

    try {
      // AuthContext orqali parol tiklash kodini yuborish
      const result = await sendPasswordResetCode(emailOrPhone);
      
      if (result.success) {
        const messageType = inputType === 'email' ? 'email' : 'SMS';
        const destination = inputType === 'email' 
          ? emailOrPhone 
          : `+998${emailOrPhone}`;

        toast({
          title: 'Muvaffaqiyat!',
          description: `${t("ForgotPassword.resetCodeSent", "Код для сброса пароля")} ${messageType} ${t("ForgotPassword.sentVia", "отправлен через")} ${destination} ${t("ForgotPassword.sentTo", "на")}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Password reset verification sahifasiga yo'naltirish
        navigate('/password-reset-verification', {
          state: {
            emailOrPhone: emailOrPhone,
            type: inputType
          }
        });
      }

    } catch (error) {
      console.error('❌ Forgot password error:', error);

      toast({
        title: t("ForgotPassword.error", "Ошибка!"),
        description: error.message || t("ForgotPassword.unexpectedError", "Что-то пошло не так. Попробуйте еще раз."),
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/auth/login');
  };

  const getInputPlaceholder = () => {
    if (inputType === 'email') {
      return 'example@mail.com';
    } else if (inputType === 'phone') {
      return '901234567';
    }
    return 'example@mail.com yoki 901234567';
  };

  const getInputProps = () => {
    const baseProps = {
      placeholder: getInputPlaceholder(),
      value: emailOrPhone,
      onChange: handleInputChange,
      size: "lg",
      borderRadius: "md",
      borderWidth: 2,
      borderColor: emailError ? "red.300" : "gray.300",
      _focus: {
        borderColor: emailError ? "red.400" : "#fed500",
        boxShadow: emailError
          ? "0 0 0 1px #F56565"
          : "0 0 0 1px #fed500, 0 0 12px rgba(254, 213, 0, 0.5)"
      },
      _hover: {
        borderColor: emailError ? "red.400" : "#f5cd00"
      },
      bg: "white",
      color: "gray.800",
      onKeyDown: (e) => {
        if (e.key === 'Enter') {
          handleSubmit(e);
        }
      }
    };

    if (inputType === 'phone') {
      return {
        ...baseProps,
        type: "tel",
        inputMode: "numeric",
        pl: "60px"
      };
    } else if (inputType === 'email') {
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
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="md">
        <VStack spacing={8} align="center">

          {/* Header */}
          <VStack spacing={4} textAlign="center" w="full">
            <Button
              variant="ghost"
              leftIcon={<MdArrowBack />}
              onClick={handleBackClick}
              alignSelf="flex-start"
              color="gray.600"
              _hover={{ color: "gray.800", bg: "gray.100" }}
            >
              {t("ForgotPassword.title", "Сброс пароля")}
            </Button>

            <Box
              w={16}
              h={16}
              bg="#fff8cc"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={MdEmail} w={8} h={8} color="#fed500" />
            </Box>

            <Heading size="lg" color="gray.800">
              {t("ForgotPassword.title", "Сброс пароля")}
            </Heading>
            <Text color="gray.600" textAlign="center">
              {t("ForgotPassword.instruction", "Введите ваш email или номер телефона, и мы отправим вам код для сброса пароля")}
            </Text>
          </VStack>

          {/* Form */}
          <VStack spacing={6} w="full">
            <FormControl isInvalid={!!emailError} w="full">
              <Text mb={2} color="gray.700" fontWeight="medium">
                {t("ForgotPassword.placeholder", "Email или номер телефона")}
              </Text>
              
              {inputType === 'phone' ? (
                <InputGroup>
                  <InputLeftElement
                    left={3}
                    color="gray.600"
                    fontSize="lg"
                    fontWeight="medium"
                    pointerEvents="none"
                  >
                    +998
                  </InputLeftElement>
                  <Input {...getInputProps()} />
                </InputGroup>
              ) : (
                <Input {...getInputProps()} />
              )}
              
              <FormErrorMessage color="red.500" fontSize="sm">
                {emailError}
              </FormErrorMessage>
            </FormControl>

            <Button
              size="lg"
              w="full"
              isLoading={isLoading}
              loadingText={t("ForgotPassword.sending", "Отправка...")}
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
            >
              {t("ForgotPassword.sendCode", "Отправить код")}
            </Button>
          </VStack>

          {/* Info Box */}
          <Box
            p={4}
            bg="#fffbe6"
            borderRadius="md"
            borderLeft="4px solid"
            borderLeftColor="#fed500"
            w="full"
          >
            <Text fontSize="sm" color="#9a8700">
              <strong>{t("ForgotPassword.note", "Примечание:")}</strong> {t("ForgotPassword.checkSpam", "Если мы отправили письмо, проверьте папку \"Спам\".")} 
              {t("ForgotPassword.smsDelay", "SMS обычно приходит в течение 5 минут.")}
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default ForgotPasswordForm;