import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Text, VStack, Input, Icon, useToast,
  Heading, Container, FormControl, FormLabel, Select,
  InputGroup, InputRightElement, Avatar, Flex, HStack
} from '@chakra-ui/react';
import { MdArrowBack, MdPerson, MdCameraAlt } from 'react-icons/md';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './logic/AuthContext';

const UserProfileCompletion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateUserProfile } = useAuth();
  const fileInputRef = useRef(null);

  // Location state dan ma'lumotlarni olish
  const { emailOrPhone, country, verified } = location.state || {};
  
  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
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
        title: 'Xato!',
        description: 'Avval emailni tasdiqlang.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/auth/register');
    }
  }, [emailOrPhone, country, verified, navigate, toast]);

  // Uzbekistan shaharlari ro'yxati
  const uzbekistanCities = [
    'Toshkent',
    'Samarqand',
    'Buxoro',
    'Andijon',
    'Namangan',
    'Qo\'qon',
    'Farg\'ona',
    'Nukus',
    'Urganch',
    'Xiva',
    'Qarshi',
    'Shahridada',
    'Termiz',
    'Jizzax',
    'Navoiy',
    'Guliston',
    'Margilon',
    'Chirchiq',
    'Olmaliq',
    'Bekobod'
  ];

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
          title: 'Xato!',
          description: 'Rasm hajmi 5MB dan oshmasligi kerak',
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
          title: 'Xato!',
          description: 'Faqat JPG, PNG, SVG formatdagi rasmlar ruxsat etilgan',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        avatar: file
      }));

      // Preview yaratish
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Ism tekshiruvi
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'F.I.O ni kiriting';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'F.I.O kamida 2 ta belgidan iborat bo\'lishi kerak';
    }

    // Shahar tekshiruvi
    if (!formData.city) {
      newErrors.city = 'Shaharni tanlang';
    }

    // Parol tekshiruvi
    if (!formData.password) {
      newErrors.password = 'Parolni kiriting';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak';
    }

    // Parolni tasdiqlash tekshiruvi
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Parolni qayta kiriting';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Parollar mos kelmayapti';
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
        city: formData.city,
        password: formData.password,
        avatar: formData.avatar,
        country: country || 'Uzbekistan',
        timestamp: new Date().toISOString()
      };

      console.log('Profile completion data:', profileData);

      // Demo uchun 2 soniya kutish
      await new Promise(resolve => setTimeout(resolve, 2000));

      // AuthContext orqali profil ma'lumotlarini saqlash
      await updateUserProfile(profileData);

      toast({
        title: 'Muvaffaqiyat!',
        description: 'Profilingiz muvaffaqiyatli to\'ldirildi',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Login sahifasiga yo'naltirish
      setTimeout(() => {
        navigate('/auth/login', {
          state: {
            emailOrPhone: emailOrPhone,
            message: 'Profilingiz muvaffaqiyatli yaratildi. Endi tizimga kirishingiz mumkin.',
            profileCompleted: true
          }
        });
      }, 1500);

    } catch (error) {
      console.error('Profile completion error:', error);
      toast({
        title: 'Xato!',
        description: error.message || 'Nimadir noto\'g\'ri ketdi. Qaytadan urinib ko\'ring.',
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
        <Text>Yuklanmoqda...</Text>
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
            Orqaga
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
              Данные Пользователя
            </Heading>
            <Text fontSize="xs" color="gray.600" textAlign="center">
              {emailOrPhone} uchun profil ma'lumotlarini to'ldiring
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
                Загрузить фото
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
                // fontSize="xs"
                px={3}
                py={1}
              >
                Выбрать
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
            
            {/* City Selection */}
            <FormControl isInvalid={!!errors.city}>
              <FormLabel fontSize="sm" fontWeight="semibold" mb={1}>
                Город
              </FormLabel>
              <Select
                placeholder="Выбрать"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                borderColor={errors.city ? "red.300" : "gray.300"}
                _hover={{ borderColor: errors.city ? "red.400" : "gray.400" }}
                _focus={{ 
                  borderColor: errors.city ? "red.500" : "#fed500", 
                  boxShadow: errors.city ? "0 0 0 1px #E53E3E" : "0 0 0 1px #fed500",
                  _hover: { borderColor: errors.city ? "red.500" : "#fed500" }
                }}
                bg="white"
              >
                {uzbekistanCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
              {errors.city && (
                <Text color="red.500" fontSize="xs" mt={1}>
                  {errors.city}
                </Text>
              )}
            </FormControl>

            {/* Full Name */}
            <FormControl isInvalid={!!errors.fullName}>
              <FormLabel fontSize="sm" fontWeight="semibold" mb={1}>
                Ф.И.О <Text as="span" color="red.500">*</Text>
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
                Придумайте пароль <Text as="span" color="red.500">*</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
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
                Повторите пароль
              </FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Подтвердите пароль"
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
              loadingText="Сохраняется..."
              onClick={handleSubmit}
              bg="#fed500"
              color="gray.900"
              _hover={{ bg: "#f5cd00" }}
              _active={{ bg: "#e6bf00" }}
              mt={2}
            >
              Подтвердить
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default UserProfileCompletion;