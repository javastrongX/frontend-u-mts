import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Text, VStack, HStack, Input, Icon, useToast,
  Heading, Container, Flex, FormControl, FormLabel, InputGroup, InputRightElement
} from '@chakra-ui/react';
import { MdEmail, MdLock, MdCheckCircle, MdArrowBack } from 'react-icons/md';
import { BiRefresh } from 'react-icons/bi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../logic/AuthContext'; // AuthContext ni import qiling

const PasswordResetVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // AuthContext'dan to'g'ri funksiya nomlarini oling
  const { verifyResetCode, resetPassword, sendPasswordResetCode } = useAuth();

  const { emailOrPhone, type } = location.state || {};
  
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  const inputRefs = useRef([]);
  const toast = useToast();

  // Agar state bo'sh bo'lsa, forgot password sahifasiga yo'naltirish
  useEffect(() => {
    if (!emailOrPhone) {
      toast({
        title: 'Xato!',
        description: 'Avval parolni tiklash so\'rovini yuboring.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/forgot-password');
    }
  }, [emailOrPhone, navigate, toast]);

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
    
    try {
      await new Promise((res) => setTimeout(res, 1500));
      
      // AuthContext orqali kodni tekshirish (to'g'ri funksiya nomi)
      const result = await verifyResetCode(emailOrPhone, verificationCode);
      
      if (result.success) {
        setIsVerified(true);
        setShowPasswordForm(true);
        showToast('Muvaffaqiyat!', 'Kod tasdiqlandi. Endi yangi parol yarating.', 'success');
      }
    } catch (error) {
      console.error('Verification error:', error);
      showToast('Xato!', error.message || 'Noto\'g\'ri kod. Qaytadan urinib ko\'ring.', 'error');
      setCode(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setCountdown(60);
    setCode(['', '', '', '']);
    inputRefs.current[0]?.focus();
    
    try {
      // AuthContext orqali kodni qayta yuborish
      await sendPasswordResetCode(emailOrPhone);
      showToast('Kod qayta yuborildi', 'Yangi tasdiqlash kodi yuborildi', 'info');
    } catch (error) {
      console.error('Resend error:', error);
      showToast('Xato!', error.message || 'Kod yuborishda xatolik yuz berdi', 'error');
    }
  };

  const validatePassword = () => {
    if (!newPassword.trim()) {
      setPasswordError('Yangi parol kiritilishi shart');
      return false;
    }
    if (newPassword.length < 6) {
      setPasswordError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Parollar mos kelmayapti');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handlePasswordUpdate = async () => {
    if (!validatePassword()) return;

    setIsPasswordLoading(true);
    
    try {
      await new Promise(res => setTimeout(res, 1500));
      
      // AuthContext orqali parolni yangilash (to'g'ri funksiya nomi)
      const result = await resetPassword(emailOrPhone, newPassword);
      
      if (result.success) {
        showToast('Muvaffaqiyat!', 'Parol muvaffaqiyatli yangilandi', 'success');
        
        // Login sahifasiga yo'naltirish
        setTimeout(() => {
          navigate('/auth/login', {
            state: {
              emailOrPhone: emailOrPhone,
              message: 'Parol yangilandi. Endi yangi parol bilan kiring.'
            }
          });
        }, 2000);
      }
      
    } catch (error) {
      console.error('Password update error:', error);
      showToast('Xato!', error.message || 'Parol yangilashda xatolik yuz berdi', 'error');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/forgot-password');
  };

  // Agar state ma'lumotlari yo'q bo'lsa, loading ko'rsatish
  if (!emailOrPhone) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Text>Yuklanmoqda...</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="md">
        <VStack spacing={8} align="center">
          
          {/* Back Button */}
          <Button
            variant="ghost"
            leftIcon={<MdArrowBack />}
            onClick={handleBackClick}
            alignSelf="flex-start"
            color="gray.600"
            _hover={{ color: "gray.800", bg: "gray.100" }}
          >
            Orqaga
          </Button>

          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Box w={16} h={16} bg="#fff8cc" borderRadius="full" display="flex" alignItems="center" justifyContent="center">
              <Icon as={showPasswordForm ? MdLock : MdEmail} w={8} h={8} color="#fed500" />
            </Box>
            <Heading size="lg" color="gray.800">
              {showPasswordForm ? 'Yangi parol yarating' : 'Parolni tiklash'}
            </Heading>
            {!showPasswordForm && (
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
            )}
          </VStack>

          {/* Kod kiritish yoki parol yaratish */}
          {showPasswordForm ? (
            // Yangi parol yaratish formi
            <VStack spacing={6} w="full">
              <FormControl isInvalid={!!passwordError}>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  Yangi parol
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Yangi parolni kiriting"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    borderColor={passwordError ? "red.300" : "gray.300"}
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ 
                      borderColor: "#fed500", 
                      boxShadow: "0 0 0 1px #fed500",
                      _hover: { borderColor: "#fed500" }
                    }}
                  />
                  <InputRightElement>
                    <Icon
                      as={showPassword ? FaEyeSlash : FaEye}
                      cursor="pointer"
                      mb={2}
                      onClick={() => setShowPassword(!showPassword)}
                      color="gray.500"
                      _hover={{ color: "gray.700" }}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isInvalid={!!passwordError}>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  Parolni tasdiqlang
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Parolni qayta kiriting"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    borderColor={passwordError ? "red.300" : "gray.300"}
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ 
                      borderColor: "#fed500", 
                      boxShadow: "0 0 0 1px #fed500",
                      _hover: { borderColor: "#fed500" }
                    }}
                  />
                  <InputRightElement>
                    <Icon
                      as={showConfirmPassword ? FaEyeSlash : FaEye}
                      cursor="pointer"
                      mb={2}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      color="gray.500"
                      _hover={{ color: "gray.700" }}
                    />
                  </InputRightElement>
                </InputGroup>
                {passwordError && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {passwordError}
                  </Text>
                )}
              </FormControl>

              <Button
                size="lg"
                w="full"
                isLoading={isPasswordLoading}
                loadingText="Yangilanmoqda..."
                onClick={handlePasswordUpdate}
                isDisabled={!newPassword || !confirmPassword}
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
                Parolni yangilash
              </Button>
            </VStack>
          ) : (
            // Kod kiritish formi
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
          )}

          {/* Qayta yuborish tugmasi */}
          {!showPasswordForm && (
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
                Kodni tasdiqlash
              </Button>
            </VStack>
          )}

          {/* Demo Info */}
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

export default PasswordResetVerification;