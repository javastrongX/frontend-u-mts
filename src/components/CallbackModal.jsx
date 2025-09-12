import React, { useState, useCallback, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  InputGroup,
  InputLeftAddon,
  useToast,
  FormErrorMessage,
  Box
} from '@chakra-ui/react';

// Uzbekistan telefon raqamlari uchun validatsiya

export const CallbackModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    phone: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToast();

  // Telefon raqamini format qilish
  const formatPhoneNumber = useCallback((value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  }, []);

  // Telefon validatsiyasi
  const validatePhone = useCallback((phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 9) return "Telefon raqami 9 ta raqamdan iborat bo'lishi kerak";
    return null;
  }, []);

  // Ism validatsiyasi
  const validateName = useCallback((name) => {
    if (!name.trim()) return "Ism kiritish majburiy";
    if (name.trim().length < 2) return "Ism kamida 2 ta belgidan iborat bo'lishi kerak";
    if (name.trim().length > 50) return "Ism 50 ta belgidan oshmasligi kerak";
    return null;
  }, []);

  // Input o'zgarishlarini boshqarish
  const handleInputChange = useCallback((field, value) => {
    if (field === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 9) {
        const formattedValue = formatPhoneNumber(digits);
        setFormData(prev => ({ ...prev, [field]: formattedValue }));
        
        // Telefon o'zgarganida xatolikni tozalash
        if (errors.phone) {
          setErrors(prev => ({ ...prev, phone: null }));
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Ism o'zgarganida xatolikni tozalash
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    }
  }, [formatPhoneNumber, errors]);

  // Forma validatsiyasi
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validatePhone, validateName]);

  // Formani yuborish
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const submitData = {
        phone: `+998 ${formData.phone}`,
        name: formData.name.trim()
      };
      
      await onSubmit?.(submitData);
      
      toast({
        title: "Muvaffaqiyatli!",
        description: "So'rovingiz qabul qilindi. Tez orada siz bilan bog'lanamiz.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      handleClose();
    } catch (error) {
      toast({
        title: "Xatolik!",
        description: "So'rov yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, onSubmit, toast]);

  // Modal yopish
  const handleClose = useCallback(() => {
    setFormData({ phone: '', name: '' });
    setErrors({});
    setIsLoading(false);
    onClose();
  }, [onClose]);



  // Form to'ldirilganligini tekshirish
  const isFormValid = useMemo(() => {
    return formData.phone.replace(/\D/g, '').length === 9 && 
           formData.name.trim().length >= 2 && 
           Object.keys(errors).length === 0;
  }, [formData, errors]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      isCentered
      motionPreset="slideInBottom"
      size="md"
    >
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent mx={4} borderRadius="xl">
        <ModalHeader 
          fontSize="xl" 
          fontWeight="bold" 
          color="gray.800"
          pb={2}
        >
          Qayta qo'ng'iroq buyurtma qilish
        </ModalHeader>
        <ModalCloseButton 
          size="lg"
          color="gray.500"
          _hover={{ bg: 'gray.100' }}
        />
        
        <ModalBody pb={6}>
          <Text 
            fontSize="sm" 
            color="gray.600" 
            mb={6}
          >
            Kontakt ma'lumotlarini qoldiring va menejer siz bilan bog'lanadi
          </Text>
          
          <VStack spacing={5} align="stretch">
            <FormControl isInvalid={!!errors.phone}>
              <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                Telefon raqami
              </FormLabel>
              <InputGroup>
                <InputLeftAddon 
                  children="+998"
                  bg="gray.50"
                  color="gray.700"
                  borderColor="gray.200"
                  fontSize="sm"
                />
                <Input
                  type="tel"
                  placeholder="90 123 45 67"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  borderColor="gray.200"
                  fontSize="sm"
                  _hover={{ borderColor: 'gray.300' }}
                  _focus={{ 
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)'
                  }}
                />
              </InputGroup>
              <FormErrorMessage fontSize="xs">
                {errors.phone}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.name}>
              <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                Ism
              </FormLabel>
              <Input
                type="text"
                placeholder="Ismingizni kiriting"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                borderColor="gray.200"
                fontSize="sm"
                _hover={{ borderColor: 'gray.300' }}
                _focus={{ 
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)'
                }}
              />
              <FormErrorMessage fontSize="xs">
                {errors.name}
              </FormErrorMessage>
            </FormControl>

            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Yuborilmoqda..."
              isDisabled={!isFormValid}
              borderRadius="lg"
              fontWeight="semibold"
              _hover={{ 
                transform: 'translateY(-1px)',
                boxShadow: 'lg'
              }}
              transition="all 0.2s"
            >
              Yuborish
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
