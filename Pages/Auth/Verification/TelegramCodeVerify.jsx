import {
  Box,
  HStack,
  PinInput,
  PinInputField,
  Button,
  Text,
  IconButton,
  Heading,
  useToast,
  VStack,
  Link,
  Flex,
  Input,
  Icon,
} from "@chakra-ui/react";
import { FaChevronLeft, FaRedoAlt } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { ResendCodeButton } from "./ResendCodeButton";
import { useAuth } from "../logic/AuthContext";
import { useTranslation } from "react-i18next";

// Constants
const API_ENDPOINTS = {
  TELEGRAM_USER_DATA: 'https://verificationbot-zj0l.onrender.com/api/auth/user-data'
};

export default function TelegramCodeVerify() {
  const [passCode, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForTelegram, setIsWaitingForTelegram] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { uniqueId, code, serverResponse } = location.state || {};
  const [serverResponsedata, setServerResponsedata] = useState(serverResponse);
  const [passingCode, setPassingCode] = useState(code);
  const { verifyUser, registerUser } = useAuth();

  // State dan ma'lumotlarni olish
  // UniqueId yo'q bo'lsa login pagega redirect qilish
  useEffect(() => {
    if (!uniqueId) {
      toast({
        title: "Xatolik!",
        description: "Seans yaroqsiz. Iltimos, qaytadan urinib ko'ring.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/auth/login", { replace: true });
    }
  }, [uniqueId, navigate, toast]);

  // Success callback
  const handleResendSuccess = useCallback(
    (data) => {
      toast({
        title: "Yuborildi!",
        description: "Yangi kod Telegram orqali yuborildi.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      setCode("");
      setServerResponsedata(data.serverResponse);
      setPassingCode(data.code);
    },
    [toast]
  );

  // Error callback
  
  const handleResendError = useCallback(
    (error) => {
      console.error("Resend failed:", error);
      toast({
        title: "Xatolik!",
        description: "Kodni qayta yuborishda xatolik yuz berdi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    [toast]
  );

  // Telegram redirect linki
  const redirectLink = uniqueId ? serverResponsedata?.bot_url : "";

  // Telegram user ma'lumotlarini olish funksiyasi
  const fetchTelegramUserData = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.TELEGRAM_USER_DATA, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unique_id: uniqueId }),
      });

      if (!response.ok) {
        // 404 bo‘lsa => user hali raqam yubormagan
        if (response.status === 404) return null;

        // boshqa xatoliklarda matn qaytarib log qilamiz
        const errorText = await response.text();
        console.error("❌ Backend error:", errorText);
        throw new Error(`Telegram user data failed: ${response.status}`);
      }

      // JSON bo‘lishiga ishonamiz
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching telegram user data:", error);
      return null;
    }
  }, [uniqueId]);

  // Kodni tasdiqlash
  const handleSubmit = useCallback(async () => {
    if (passCode.length !== 5) {
      toast({
        title: "Xatolik!",
        description: "Iltimos, 5 ta belgini to'liq kiriting.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Kodlarni solishtirish
      const enteredCode = String(passCode).trim().toLowerCase();
      const expectedCode = String(passingCode).trim().toLowerCase();

      if (enteredCode !== expectedCode) {
        throw new Error("Kod noto'g'ri");
      }

      // Telegram orqali user ma'lumotlarini kutish
      setIsWaitingForTelegram(true);
      
      let telegramUserData = null;
      let attempts = 0;
      const maxAttempts = 30; // 30 sekund kutish (har 1 sekundda bir marta)
      
      while (attempts < maxAttempts && !telegramUserData) {
        try {
          telegramUserData = await fetchTelegramUserData();
          if (telegramUserData) {
            break;
          }
        } catch (error) {
          // Agar 404 bo'lmasa, xatolik
          if (!error.message.includes('404')) {
            throw error;
          }
        }
        
        // 1 sekund kutish
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      setIsWaitingForTelegram(false);

      if (!telegramUserData) {
        throw new Error("Telegram orqali ma'lumotlar olinmadi. Iltimos, botga telefon raqamingizni yuboring.");
      }
      
      toast({
        title: "Tasdiqlandi!",
        description: "Kod muvaffaqiyatli tasdiqlandi!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // User ma'lumotlarini qayta ishlash
      let phoneNumber = telegramUserData.phone;
      
      // Telefon raqamni formatlash - +998 prefiksini olib tashlash
      if (phoneNumber.startsWith('+998')) {
        phoneNumber = phoneNumber.substring(4); // +998 ni olib tashlash
      } else if (phoneNumber.startsWith('998')) {
        phoneNumber = phoneNumber.substring(3); // 998 ni olib tashlash
      }
      // Auth contextga ma'lumotlarni yuborish
      registerUser({
        country: "Узбекистан",
        countryCode: "uz",
        emailOrPhone: phoneNumber,
        type: "phone",
      });
      
      const very = verifyUser(phoneNumber);
      // Profil to'ldirish sahifasiga yo'naltirish (agar kerak bo'lsa)
      navigate("/auth/profile-completion", {
        state: {
          country: "uz",
          emailOrPhone: phoneNumber,
          verified: true,
        },
        replace: true
      });

    } catch (error) {
      setIsWaitingForTelegram(false);
      
      toast({
        title: "Xatolik!",
        description:
          error.message === "Kod noto'g'ri"
            ? "Kod noto'g'ri, iltimos qayta urinib ko'ring."
            : error.message || "Xatolik yuz berdi, iltimos qayta urinib ko'ring.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      
      // Xato bo'lganda kodni tozalash
      setCode("");
    } finally {
      setIsLoading(false);
    }
  }, [passCode, passingCode, toast, fetchTelegramUserData, registerUser, verifyUser]);

  // Orqaga qaytish
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Login sahifasiga o'tish
  const handleLogin = useCallback(() => {
    navigate("/auth/login", { replace: true });
  }, [navigate]);

  // Telegram sahifasini yangi oynada ochish
  const handleRedirect = useCallback(() => {
    if (redirectLink) {
      window.open(redirectLink, "_blank", "noopener,noreferrer");
    }
  }, [redirectLink]);

  // Enter tugmasi orqali submit qilish
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && passCode.length === 5 && !isLoading) {
        handleSubmit();
      }
    },
    [passCode.length, isLoading, handleSubmit]
  );

  // UniqueId yo'q bo'lsa componentni render qilmaslik
  if (!uniqueId) {
    return null;
  }

  return (
    <Box
      w="100vw"
      h="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      onKeyDown={handleKeyPress}
    >
      <Box
        w="100%"
        maxW="700px"
        h="100%"
        maxH="550px"
        bg="white"
        borderRadius="3xl"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        overflow="hidden"
        position="relative"
      >
        {/* Header with back button */}
        <Flex
          align="center"
          justify="space-between"
          p={6}
          pb={4}
          bg="gray.50"
          borderBottom="1px"
          borderColor="gray.100"
        >
          <IconButton
            icon={<FaChevronLeft />}
            aria-label="Orqaga"
            variant="ghost"
            size="md"
            onClick={handleBack}
            _hover={{ bg: "gray.200" }}
          />
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            Tasdiqlash
          </Text>
          <Box w="40px" />
        </Flex>

        {/* Main content */}
        <VStack spacing={6} p={8} pt={6}>
          {/* Title & Subtitle */}
          <VStack spacing={2} textAlign="center" w="100%">
            <VStack align="flex-start" w="100%" maxW="500px">
              <Text fontSize="sm" color="gray.600">
                Kodni olish uchun telegramga o'ting
              </Text>
              <HStack w="100%">
                <Input
                  value={redirectLink}
                  p={2}
                  isReadOnly
                  onFocus={(e) => e.target.select()}
                  bg="gray.50"
                  borderColor="gray.200"
                  fontSize="sm"
                />
                <IconButton
                  icon={<Icon as={FaArrowUpRightFromSquare} />}
                  aria-label="Telegramga o'tish"
                  bg="blue.50"
                  color="blue.500"
                  borderRadius="md"
                  onClick={handleRedirect}
                  _hover={{ bg: "blue.100" }}
                  isDisabled={!redirectLink}
                />
              </HStack>
            </VStack>

            <Heading fontSize="2xl" fontWeight="bold" color="gray.800" mt={4}>
              Kodni kiriting
            </Heading>
            <Text fontSize="sm" color="gray.600" lineHeight="1.5">
              {isWaitingForTelegram 
                ? "Telegram orqali telefon raqamingizni yuboring va kutib turing..." 
                : "Telegram orqali yuborilgan 5 xonali kodni kiriting"
              }
            </Text>
          </VStack>

          {/* PinInput */}
          <Box>
            <HStack justify="center" spacing={3}>
              <PinInput
                otp
                type="alphanumeric"
                onChange={setCode}
                size="lg"
                value={passCode}
                autoFocus
                isDisabled={isWaitingForTelegram}
              >
                {[...Array(5)].map((_, index) => (
                  <PinInputField
                    key={index}
                    w="70px"
                    h="70px"
                    borderColor="gray.300"
                    focusBorderColor="#fed500"
                    borderRadius="xl"
                    fontSize="xl"
                    fontWeight="semibold"
                    textAlign="center"
                    _hover={{ borderColor: "#fed500" }}
                    _invalid={{ borderColor: "red.300" }}
                    _disabled={{ bg: "gray.100", cursor: "not-allowed" }}
                    transition="all 0.2s"
                  />
                ))}
              </PinInput>
            </HStack>
          </Box>

          {/* Submit button */}
          <Button
            w="100%"
            h="50px"
            bg="#fed500"
            color="black"
            fontWeight="semibold"
            fontSize="md"
            _hover={{
              bg: "#e6c200",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(254, 213, 0, 0.4)",
            }}
            _active={{ transform: "translateY(0)" }}
            _disabled={{
              bg: "gray.300",
              color: "gray.500",
              cursor: "not-allowed",
              transform: "none",
              boxShadow: "none",
            }}
            borderRadius="xl"
            transition="all 0.2s"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText={isWaitingForTelegram ? "Telegram ma'lumotlari kutilmoqda..." : "Tekshirilmoqda..."}
            isDisabled={passCode.length !== 5 || isWaitingForTelegram}
          >
            Tasdiqlash
          </Button>

          {/* Resend code */}
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.500">
              Kod kelmadimi?
            </Text>
            <ResendCodeButton
              variant="link"
              size="sm"
              fontWeight="semibold"
              leftIcon={<FaRedoAlt />}
              color="blue.500"
              _hover={{ color: "blue.400" }}
              onSuccess={handleResendSuccess}
              onError={handleResendError}
              isDisabled={isLoading || isWaitingForTelegram}
            />
          </HStack>

          {/* Login link */}
          <Box pt={4} borderTop="1px" borderColor="gray.100" w="100%">
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Sizda akkount bormi?{" "}
              <Link
                color="blue.500"
                fontWeight="semibold"
                onClick={handleLogin}
                _hover={{
                  color: "blue.400",
                  textDecoration: "underline",
                }}
                cursor="pointer"
              >
                Login
              </Link>
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
