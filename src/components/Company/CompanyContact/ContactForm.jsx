import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Text,
  useToast,
  Heading,
  useBreakpointValue,
} from '@chakra-ui/react';
import { IoIosAddCircle as AddIcon } from "react-icons/io";
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate, useNavigation } from 'react-router-dom';
import { PhoneInput, SocialInput } from './HelperComponents';
import { useTranslation } from 'react-i18next';


// Phone validation function
const isValidPhoneNumber = (number) => {
  // Remove all spaces and check if contains only digits
  const cleanNumber = number.replace(/\s+/g, '');
  return /^\d+$/.test(cleanNumber) && cleanNumber.length >= 7 && cleanNumber.length <= 15;
};

const ContactForm = () => {
  const { t } = useTranslation();
  // State with stable initial values
  const [phones, setPhones] = useState(() => [
    { id: Date.now(), countryCode: '+998', number: '' }
  ]);
  
  const [socials, setSocials] = useState(() => [
    { id: Date.now() + 1, platform: 'instagram', username: '' }
  ]);

  // Loading state for API requests
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // Responsive values
  const maxWidth = useBreakpointValue({ base: "full", md: "700px" });
  const selectWidth = useBreakpointValue({ base: "full", sm: "120px", md: "150px" });
  const stackSpacing = useBreakpointValue({ base: 4, md: 6 });

  // API BASE URL
  // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-api-domain.com/api';

  // Component mount - fetch existing contacts from API
  useEffect(() => {
    // API GET request to fetch user's existing contacts
    const fetchContacts = async () => {
      // try {
      //   const response = await fetch(`${API_BASE_URL}/user/contacts`, {
      //     method: 'GET',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // if authentication required
      //     },
      //   });

      //   if (response.ok) {
      //     const data = await response.json();
      //     
      //     // Set phones if exists in response
      //     if (data.phones && data.phones.length > 0) {
      //       setPhones(data.phones.map((phone, index) => ({
      //         id: Date.now() + index,
      //         countryCode: phone.countryCode || '+998',
      //         number: phone.number || ''
      //       })));
      //     }
      //     
      //     // Set socials if exists in response
      //     if (data.socials && data.socials.length > 0) {
      //       setSocials(data.socials.map((social, index) => ({
      //         id: Date.now() + index + 1000,
      //         platform: social.platform || 'instagram',
      //         username: social.username || ''
      //       })));
      //     }
      //   }
      // } catch (error) {
      //   console.error('Error fetching contacts:', error);
      //   toast({
      //     title: 'Xatolik',
      //     description: 'Kontakt ma\'lumotlarini yuklashda xatolik yuz berdi',
      //     status: 'error',
      //     duration: 3000,
      //     isClosable: true,
      //   });
      // }
    };

    fetchContacts();
  }, [toast]);

  // Memoized handlers to prevent unnecessary re-renders
  const addPhone = useCallback(() => {
    setPhones(prev => [...prev, {
      id: Date.now(),
      countryCode: '+998',
      number: ''
    }]);
  }, []);

  const removePhone = useCallback((id) => {
    setPhones(prev => prev.filter(phone => phone.id !== id));
  }, []);

  const updatePhone = useCallback((id, field, value) => {
    setPhones(prev => prev.map(phone => 
      phone.id === id ? { ...phone, [field]: value } : phone
    ));
  }, []);

  const addSocial = useCallback(() => {
    setSocials(prev => [...prev, {
      id: Date.now(),
      platform: 'instagram',
      username: ''
    }]);
  }, []);

  const removeSocial = useCallback((id) => {
    setSocials(prev => prev.filter(social => social.id !== id));
  }, []);

  const updateSocial = useCallback((id, field, value) => {
    setSocials(prev => prev.map(social => 
      social.id === id ? { ...social, [field]: value } : social
    ));
  }, []);

  // Enhanced validation
  const validateData = useCallback(() => {
    const validPhones = phones.filter(phone => phone.number.trim());
    const invalidPhones = validPhones.filter(phone => !isValidPhoneNumber(phone.number));
    
    if (validPhones.length === 0) {
      toast({
        title: t("UserCompletion.error", 'Ошибка!'),
        description: t("Business_mode.company_contact.atLeastOnePhone", "Должен быть введен хотя бы один номер телефона."),
        status: 'error',
        duration: 3000, 
        isClosable: true,
      });
      return null;
    }

    if (invalidPhones.length > 0) {
      toast({
        title: t("UserCompletion.error", 'Ошибка!'),
        description: t("Business_mode.company_contact.invalidPhone", "Номер телефона должен состоять только из цифр и содержать от 7 до 15 символов."),
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return null;
    }

    const validSocials = socials.filter(social => social.username.trim());

    return {
      phones: validPhones.map(phone => ({
        countryCode: phone.countryCode,
        number: phone.number.trim().replace(/\s+/g, ' ')
      })),
      socials: validSocials.map(social => ({
        platform: social.platform,
        username: social.username.trim()
      }))
    };
  }, [phones, socials, toast]);

  const handleSave = useCallback(async () => {
    const contactData = validateData();
    
    if (!contactData) return;

    setIsLoading(true);

    try {
      // API POST request to save contacts
      // const response = await fetch(`${API_BASE_URL}/user/contacts`, {
      //   method: 'POST', // yoki 'PUT' agar update bo'lsa
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // if authentication required
      //   },
      //   body: JSON.stringify({
      //     phones: contactData.phones,
      //     socials: contactData.socials,
      //     // Additional fields if needed:
      //     // userId: localStorage.getItem('userId'), // if needed
      //     // updatedAt: new Date().toISOString(),
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const result = await response.json();
      
      // Success case - mock for now
      // console.log('Contact Data to be sent:', contactData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t("UserCompletion.success", 'Успешно!'),
        description: t("Business_mode.company_contact.success", "Контактная информация успешно сохранена"),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Optional: Navigate to another page after successful save
      // navigate('/profile');

    } catch (error) {
      console.error('Error saving contacts:', error);
      
      // API Error handling
      toast({
        title: t("UserCompletion.error", 'Ошибка!'),
        description: t("Business_mode.company_contact.error", "Произошла ошибка при сохранении контактных данных. Пожалуйста, попробуйте снова."),
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [validateData, toast]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleSave]);

  // Memoized phone inputs
  const phoneInputs = useMemo(() => 
    phones.map((phone) => (
      <PhoneInput
        key={phone.id}
        phone={phone}
        canDelete={phones.length > 1}
        onUpdate={updatePhone}
        onRemove={removePhone}
        selectWidth={selectWidth}
        isValidPhoneNumber={isValidPhoneNumber}
      />
    )), 
    [phones, updatePhone, removePhone, selectWidth]
  );

  // Memoized social inputs
  const socialInputs = useMemo(() =>
    socials.map((social) => (
      <SocialInput
        key={social.id}
        social={social}
        canDelete={socials.length > 1}
        onUpdate={updateSocial}
        onRemove={removeSocial}
        selectWidth={selectWidth}
      />
    )),
    [socials, updateSocial, removeSocial, selectWidth]
  );

  return (
    <Box maxW="full" mt={{base: 3, sm: 6, md: 10}} mx={2}>
      <Box 
        bg="#fff" 
        borderRadius="lg"
        border={'1px'}
        borderColor={'#fed500'} 
        p={8} 
        boxShadow="lg"
        maxW="full"
      >
        <HStack align={'flex-start'}>
            <FaChevronLeft size={24} color="#fed500" onClick={() => navigate(-1)} cursor={'pointer'}/>
            <VStack 
                maxW={maxWidth} 
                spacing={stackSpacing} 
                align="stretch"
                pl={{base: 0, md: 6}}
                mx={{ base: "auto", md: 0 }}
            >

                {/* Header */}
                <Box textAlign={{ base: "center", md: "left" }}>
                    <Heading 
                    fontSize={"25px"} 
                    mb={2} 
                    color="gray.800"
                    >
                    {t("contactBottomModal.phone", "Контакты")}
                    </Heading>
                    <Text 
                    color="gray.600" 
                    fontSize={{ base: "xs", sm: "sm", md: "md" }}
                    maxW="600px"
                    mx={{ base: "auto", md: "0" }}
                    >
                    {t("Business_mode.company_contact.contact_form", "Контакты будут указаны на страницах вашего профиля, объявлений и заявок")}
                    </Text>
                </Box>

            {/* Phone Numbers Section */}
            <FormControl>
                <FormLabel 
                color="gray.700" 
                fontWeight="semibold"
                fontSize={{ base: "sm", md: "md" }}
                >
                {t("Business_mode.company_contact.phone", "Телефонные номера")}
                </FormLabel>
                <VStack spacing={3} align="stretch">
                {phoneInputs}
                
                <Button
                    leftIcon={<AddIcon size={20} />}
                    onClick={addPhone}
                    variant="outline"
                    colorScheme="blue"
                    color={'blue.400'}
                    size={{ base: "sm", md: "md" }}
                    alignSelf="flex-start"
                    fontSize={{ base: "sm", md: "md" }}
                >
                    {t("Business_mode.company_contact.add_contact", "Добавить контакт")}
                </Button>
                </VStack>
            </FormControl>

            {/* Social Media Section */}
            <FormControl>
                <FormLabel 
                color="gray.700" 
                fontWeight="semibold"
                fontSize={{ base: "sm", md: "md" }}
                >
                {t("Business_mode.company_contact.social", "Социальные сети")}
                </FormLabel>
                <VStack spacing={3} align="stretch">
                {socialInputs}
                
                <Button
                    leftIcon={<AddIcon size={20} />}
                    onClick={addSocial}
                    variant="outline"
                    colorScheme="blue"
                    color={'blue.400'}
                    size={{ base: "sm", md: "md" }}
                    alignSelf="flex-start"
                    fontSize={{ base: "sm", md: "md" }}
                >
                    {t("Business_mode.company_contact.add_social", "Добавить соц сети")}
                </Button>
                </VStack>
            </FormControl>

            {/* Save Button */}
            <Button
                onClick={handleSave}
                bg="#fed500"
                color="black"
                size={{ base: "md", md: "lg" }}
                fontWeight="bold"
                _hover={{ bg: "#e6c000" }}
                _active={{ bg: "#ccab00" }}
                mt={4}
                w={{ base: "full", md: "auto" }}
                fontSize={{ base: "md", md: "lg" }}
                isLoading={isLoading}
                loadingText={t("Business_mode.company_contact.saving", "Сохранение...")}
            >
                <Text display={{base: "none", md: 'block'}}>
                    {t("Business_mode.company_contact.save", "Сохранить")} (Ctrl+Enter)
                </Text>
                <Text display={{base: "block", md: 'none'}}>
                    {t("Business_mode.company_contact.save", "Сохранить")}
                </Text>
            </Button>
            </VStack>
        </HStack>
      </Box>
    </Box>
  );
};

export default ContactForm;