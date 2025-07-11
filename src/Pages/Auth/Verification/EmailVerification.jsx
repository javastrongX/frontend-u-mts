import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Text, VStack, HStack, Input, Icon, useToast,
  Heading, Container, Flex
} from '@chakra-ui/react';
import { MdEmail, MdLock, MdCheckCircle } from 'react-icons/md';
import { BiRefresh } from 'react-icons/bi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../logic/AuthContext';

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyUser } = useAuth();

  const { country, emailOrPhone, type } = location.state || {};
  
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);
  const toast = useToast();
  const email = emailOrPhone;

  // Agar state bo'sh bo'lsa, login sahifasiga yo'naltirish
  useEffect(() => {
    if (!emailOrPhone || !country) {
      toast({
        title: 'Xato!',
        description: 'Avval ro\'yxatdan o\'ting yoki allaqachon Ro\'yhatdan o\'tgansiz.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/auth/register');
    }
  }, [emailOrPhone, country, navigate, toast]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
    if (newCode.every((d) => d !== '')) handleVerification(newCode.join(''));
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const digits = text.replace(/\D/g, '').slice(0, 4).split('');
      const newCode = [...code];
      digits.forEach((d, i) => {
        if (i < 4) newCode[i] = d;
      });
      setCode(newCode);
      if (newCode.every(d => d !== '')) handleVerification(newCode.join(''));
    } catch (e) {
      console.error("Clipboard read error:", e);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      handlePaste();
    }
  };

  const showToast = (title, description, status) => {
    toast({
      title, description, status,
      duration: 3000,
      isClosable: true,
    });
  };

  const handleVerification = async (verificationCode) => {
    setIsLoading(true);
    const apiPayload = {
      email: email,
      verificationCode: verificationCode,
      timestamp: new Date().toISOString(),
      userId: 'demo-user-123'
    };
    console.log('API ga yuborilayotgan ma\'lumotlar:', apiPayload);

    try {
      await new Promise((res) => setTimeout(res, 1500));
      
      // Demo uchun har qanday 4 raqamli kod qabul qilinadi
      if (verificationCode.length === 4) {
        // AuthContext orqali foydalanuvchini tasdiqlash
        const verifiedUser = verifyUser(emailOrPhone);
        
        if (verifiedUser) {
          setIsVerified(true);
          showToast('Muvaffaqiyat!', 'Email/telefon manzil tasdiqlandi', 'success');
        } else {
          showToast('Xato!', 'Foydalanuvchi topilmadi', 'error');
        }
      } else {
        showToast('Xato!', 'Noto\'g\'ri kod. Qaytadan urinib ko\'ring.', 'error');
        setCode(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      showToast('Xato!', 'Nimadir noto\'g\'ri ketdi. Qaytadan urinib ko\'ring.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setCountdown(60);
    setCode(['', '', '', '']);
    inputRefs.current[0]?.focus();
    
    const resendPayload = {
      email: email,
      action: 'resend_verification_code',
      timestamp: new Date().toISOString(),
      userId: 'demo-user-123'
    };
    console.log('Kod qayta yuborish API ga:', resendPayload);
    
    try {
      await new Promise(res => setTimeout(res, 1000));
      showToast('Kod qayta yuborildi', 'Yangi tasdiqlash kodi yuborildi', 'info');
    } catch (error) {
      console.error('Resend error:', error);
      showToast('Xato!', 'Kod yuborishda xatolik yuz berdi', 'error');
    }
  };

  const handleContinue = () => {
    // Profil to'ldirish sahifasiga yo'naltirish
    navigate('/auth/profile-completion', {
      state: {
        emailOrPhone: emailOrPhone,
        country: country,
        verified: true
      }
    });
  };

  // Agar state ma'lumotlari yo'q bo'lsa, loading ko'rsatish
  if (!emailOrPhone || !country) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Text>Yuklanmoqda...</Text>
      </Box>
    );
  }

  if (isVerified) {
    return (
      <Box minH="100vh" bg="gray.50" py={12}>
        <Container maxW="md">
          <VStack spacing={8} align="center">
            <Box w={20} h={20} bg="green.100" borderRadius="full" display="flex" alignItems="center" justifyContent="center">
              <Icon as={MdCheckCircle} w={10} h={10} color="green.500" />
            </Box>
            <VStack spacing={4} textAlign="center">
              <Heading size="lg" color="gray.800">
                {type === 'phone' ? 'Telefon tasdiqlandi!' : 'Email tasdiqlandi!'}
              </Heading>
              <Text color="gray.600">
                Sizning {type === 'phone' ? 'telefon raqamingiz' : 'email manzilingiz'} muvaffaqiyatli tasdiqlandi.
              </Text>
              <Text fontSize="sm" color="gray.500">
                Endi profilingizni to'ldiring
              </Text>
            </VStack>
            <Button
              bg="#fed500"
              color="gray.900"
              size="lg"
              w="full"
              _hover={{ bg: "#f5cd00" }}
              _active={{ bg: "#e6bf00" }}
              onClick={handleContinue}
            >
              Profilni to'ldirish
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="md">
        <VStack spacing={8} align="center">
          <VStack spacing={4} textAlign="center">
            <Box w={16} h={16} bg="#fff8cc" borderRadius="full" display="flex" alignItems="center" justifyContent="center">
              <Icon as={MdLock} w={8} h={8} color="#fed500" />
            </Box>
            <Heading size="lg" color="gray.800">Registratsiyani tasdiqlang</Heading>
            <VStack spacing={2}>
              <Text color="gray.600">
                Tasdiqlash uchun kod yuborildi
              </Text>
              <Flex align="center" gap={2}>
                <Icon as={type === 'phone' ? MdLock : MdEmail} color="#fed500" />
                <Text color="#9a8700" fontWeight="medium">
                  {type === 'phone' ? `+998 ${emailOrPhone}` : emailOrPhone}
                </Text>
              </Flex>
            </VStack>
          </VStack>

          <VStack spacing={6}>
            <HStack spacing={4}>
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  textAlign="center"
                  fontSize="2xl"
                  fontWeight="bold"
                  w={16}
                  h={16}
                  borderRadius="xl"
                  borderWidth={2}
                  borderColor={digit ? "#fed500" : "gray.300"}
                  _focus={{
                    borderColor: "#fed500",
                    boxShadow: "0 0 0 1px #fed500, 0 0 20px rgba(254, 213, 0, 0.4)"
                  }}
                  _hover={{ borderColor: "#f5cd00" }}
                  bg="white"
                  color="gray.800"
                  type="tel"
                />
              ))}
            </HStack>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              {type === 'phone' 
                ? 'SMS odatda 5 daqiqa ichida keladi.' 
                : 'Xat odatda 15 daqiqa ichida keladi, "Spam" papkasini ham tekshirib ko\'ring.'
              }
            </Text>
          </VStack>

          <VStack spacing={4}>
            {countdown > 0 ? (
              <Text fontSize="sm" color="gray.500">Kodni qayta yuborish ({countdown}s)</Text>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<BiRefresh />}
                onClick={handleResendCode}
                color="#9a8700"
                _hover={{ bg: "#fff8cc", color: "#b89e00" }}
              >
                Kodni qayta yuborish
              </Button>
            )}
            <Button
              size="lg"
              w="full"
              isLoading={isLoading}
              loadingText="Tekshirilmoqda..."
              onClick={() => handleVerification(code.join(''))}
              isDisabled={code.includes('')}
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
              Registratsiyani tasdiqlash
            </Button>
          </VStack>

          <Box p={4} bg="#fffbe6" borderRadius="md" borderLeft="4px solid" borderLeftColor="#fed500" w="full">
            <Text fontSize="sm" color="#9a8700">
              <strong>Demo uchun:</strong> Har qanday 4 raqamli kodni kiriting (masalan: 1234, 5678, va boshqalar).
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default EmailVerification;