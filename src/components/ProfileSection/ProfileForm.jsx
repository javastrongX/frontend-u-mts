import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  VStack,
  Card,
  CardBody,
  Avatar,
  IconButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Textarea,
  Switch,
  Progress,
  Divider,
  Heading,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
  useToast,
  useDisclosure,
  Stack,
  useOutsideClick,
  Spinner,
  List,
  ListItem,
  HStack
} from '@chakra-ui/react';
import { 
  FiCamera, 
  FiUpload, 
  FiPhone, 
  FiMail, 
  FiCheck, 
  FiEye, 
  FiEyeOff, 
  FiLogOut,
  FiMapPin,
} from 'react-icons/fi';

import { keyframes } from "@emotion/react"
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../Pages/Auth/logic/AuthContext';

// Animations
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Constants
const UPLOAD_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: 'image/*',
  PROGRESS_INTERVAL: 200,
  PROGRESS_INCREMENT: { min: 5, max: 15 },
  COMPLETION_DELAY: 1500
};

const DEBOUNCE_DELAY = 300;
const MIN_SEARCH_LENGTH = 2;
const MAX_SUGGESTIONS_HEIGHT = '200px';

// LocationSearchInput Component
const LocationSearchInput = ({
  value,
  onChange,
  placeholder,
  size,
  inputProps = {},
  i18n,
  ...otherProps
}) => {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef();
  const suggestionsRef = useRef();
  
  // Sync with external value changes
  useEffect(() => {
    setQuery(value || "");
  }, [value]);
  
  useOutsideClick({
    ref: suggestionsRef,
    handler: () => setShowSuggestions(false),
  });

  // Memoized API call function
  const fetchPlaceSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < MIN_SEARCH_LENGTH) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const selectedLang = i18n?.language || 'uz';
      const response = await fetch(
        `https://backend-u-mts.onrender.com/api/places/autocomplete?input=${encodeURIComponent(searchQuery)}&language=${selectedLang}`
      );
      const data = await response.json();
      setSuggestions(data.predictions || []);
    } catch (error) {
      console.error("Error fetching place suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [i18n?.language]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPlaceSuggestions(query);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [query, fetchPlaceSuggestions]);

  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange("address", newValue);
    setShowSuggestions(true);
  }, [onChange]);

  const handleSuggestionSelect = useCallback((suggestion) => {
    setQuery(suggestion.description);
    onChange("address", suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
  }, [onChange]);

  const handleInputFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions.length]);

  return (
    <Box position="relative" ref={suggestionsRef} {...otherProps}>
      <InputGroup>
        <InputLeftElement h={size === 'lg' ? 10 : 8}>
          <FiMapPin color="#718096" />
        </InputLeftElement>
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          size={size}
          borderRadius="xl"
          focusBorderColor="orange.50"
          _focus={{
            boxShadow: '0 0 0 1px #FF6B35',
            borderColor: 'orange.50'
          }}
          {...inputProps}
        />
        {isLoading && (
          <InputRightElement h={size === 'lg' ? 10 : 8}>
            <Spinner size="sm" color="gray.400" />
          </InputRightElement>
        )}
      </InputGroup>

      {showSuggestions && suggestions.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={1000}
          bg="white"
          border="2px solid"
          borderColor="gray.200"
          borderRadius="xl"
          boxShadow="lg"
          maxH={MAX_SUGGESTIONS_HEIGHT}
          overflowY="auto"
          mt={1}
        >
          <List spacing={0}>
            {suggestions.map((suggestion) => (
              <ListItem
                key={suggestion.place_id}
                px={4}
                py={3}
                cursor="pointer"
                _hover={{ bg: "gray.50" }}
                _first={{ borderTopRadius: "xl" }}
                _last={{ borderBottomRadius: "xl" }}
                onClick={() => handleSuggestionSelect(suggestion)}
                borderBottom="1px solid"
                borderBottomColor="gray.100"
              >
                <HStack spacing={3}>
                  <FiMapPin color="#718096" size={14} />
                  <Text fontSize="sm" color="gray.700">
                    {suggestion.description}
                  </Text>
                </HStack>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export const ProfileForm = () => {
  const { logout, getUserProfile, updateUserProfile, changePassword } = useAuth();
  const { i18n, t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const userData = useMemo(() => getUserProfile() || {}, []);
  
  // Form state
  const [formData, setFormData] = useState({
    name: userData?.fullName || 'User',
    address: userData?.address || '',
    phone: userData?.type === 'phone' ? userData?.emailOrPhone : '',
    email: userData?.type === 'email' ? userData?.emailOrPhone : '',
    bio: userData?.bio || '',
    notifications: userData?.pushNotification || true,
    newPassword: '',
    confirmPassword: '',
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [avatarImage, setAvatarImage] = useState(userData?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Memoized handlers
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const showToast = useCallback((title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
      position: 'top-right'
    });
  }, [toast]);

  const validatePasswords = useCallback(() => {
    if (!formData.newPassword || !formData.confirmPassword) {
      showToast(
        t('ProfileSection.password_error', 'Ошибка пароля'),
        t('ProfileSection.password_required', 'Заполните все поля пароля'),
        'error'
      );
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast(
        t('ProfileSection.password_mismatch', 'Пароли не совпадают'),
        t('ProfileSection.password_mismatch_desc', 'Проверьте правильность ввода паролей'),
        'error'
      );
      return false;
    }

    return true;
  }, [formData.newPassword, formData.confirmPassword, showToast, t]);

  const handleSave = useCallback(async () => {
    setIsLoading(true);

    const profileData = {
      emailOrPhone: userData?.emailOrPhone,
      fullName: formData.name,
      address: formData.address,
      bio: formData.bio,
      avatar: avatarImage,
      pushNotification: formData.notifications
    };

    // console.log('Profile Data:', profileData);

    try {
      await updateUserProfile(profileData);
      
      setTimeout(() => {
        setIsLoading(false);
        showToast(
          t('ProfileSection.update_profile', 'Профиль обновлен!'),
          t('ProfileSection.update_profile_desc', "Ваши данные успешно сохранены."),
          'success'
        );
      }, 2000);
    } catch (error) {
      console.error('Profile update error:', error);
      setIsLoading(false);
      showToast(
        t('ProfileSection.update_error', 'Ошибка обновления'),
        t('ProfileSection.update_error_desc', "Не удалось обновить профиль."),
        'error'
      );
    }
  }, [userData?.emailOrPhone, formData.name, formData.address, formData.bio, formData.notifications, avatarImage, updateUserProfile, showToast, t]);

  const handlePasswordSave = useCallback(async () => {
    if (!validatePasswords()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const passwordData = {
      emailOrPhone: userData?.emailOrPhone,
      newPassword: formData.newPassword,
    };

    try {
      await changePassword(passwordData);
      
      setTimeout(() => {
        setIsLoading(false);
        setFormData(prev => ({
          ...prev,
          newPassword: '',
          confirmPassword: ''
        }));
        
        showToast(
          t('ProfileSection.password_updated', 'Пароль обновлен!'),
          t('ProfileSection.password_updated_desc', "Ваш пароль успешно изменен."),
          'success'
        );
      }, 2000);
    } catch (error) {
      console.error('Password update error:', error);
      setIsLoading(false);
      showToast(
        t('ProfileSection.password_update_error', 'Ошибка смены пароля'),
        t('ProfileSection.password_update_error_desc', "Не удалось изменить пароль."),
        'error'
      );
    }
  }, [validatePasswords, userData?.emailOrPhone, formData.newPassword, changePassword, showToast, t]);

  const validateFile = useCallback((file) => {
    if (!file.type.startsWith('image/')) {
      showToast(
        t('ProfileSection.upload_error', 'Ошибка загрузки'),
        t('ProfileSection.upload_image_only', 'Пожалуйста, выберите изображение.'),
        'error'
      );
      return false;
    }

    if (file.size > UPLOAD_CONFIG.MAX_SIZE) {
      showToast(
        t('ProfileSection.upload_error', 'Ошибка загрузки'),
        t('ProfileSection.image_size', 'Размер изображения должен быть меньше 5MB.'),
        'error'
      );
      return false;
    }

    return true;
  }, [showToast, t]);

  const simulateProgress = useCallback(() => {
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.random() * UPLOAD_CONFIG.PROGRESS_INCREMENT.max + UPLOAD_CONFIG.PROGRESS_INCREMENT.min;
        return Math.min(prev + increment, 100);
      });
    }, UPLOAD_CONFIG.PROGRESS_INTERVAL);

    return interval;
  }, []);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file || !validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = simulateProgress();

    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        setAvatarImage(e.target.result);
        setIsUploading(false);
        setUploadProgress(0);
        showToast(
          t('ProfileSection.success_upload', 'Изображение успешно загружено'),
          t('ProfileSection.success_upload_avatar', 'Аватар успешно обновлен'),
          'success'
        );
      }, UPLOAD_CONFIG.COMPLETION_DELAY);
    };
    reader.readAsDataURL(file);
  }, [validateFile, simulateProgress, showToast, t]);

  const handleFileClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const formatPhone = useCallback((phone) => {
    if (!phone) return '';
    return `+998 ${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 7)} ${phone.slice(7, 9)}`;
  }, []);

  const togglePasswordVisibility = useCallback((field) => {
    if (field === 'password') {
      setShowPassword(prev => !prev);
    } else {
      setShowConfirmPassword(prev => !prev);
    }
  }, []);

  // Memoized avatar border style
  const avatarBorderStyle = useMemo(() => ({
    background: isUploading 
      ? `conic-gradient(from 0deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80, #405DE6)`
      : avatarImage 
        ? 'linear-gradient(45deg, #833AB4, #C13584, #E1306C, #F56040)'
        : 'gray.200',
    animation: isUploading ? `${rotate} 2s linear infinite` : 'none',
  }), [isUploading, avatarImage]);

  return (
    <VStack spacing={6} align="stretch">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept={UPLOAD_CONFIG.ACCEPTED_TYPES}
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      {/* Main Profile Form */}
      <Card boxShadow="2xl" borderRadius="2xl">
        <CardBody p={{base: 4, md: 6, lg: 8}}>
          <VStack spacing={8} align="stretch">
            {/* Avatar Section */}
            <Stack 
              direction={{ base: "column", lg: 'row' }} 
              spacing={8} 
            >
              <VStack spacing={4} align="center">
                <Box position="relative">
                  {/* Instagram-style border animation */}
                  <Box
                    position="absolute"
                    top="-4px"
                    left="-4px"
                    right="-4px"
                    bottom="-4px"
                    borderRadius="full"
                    {...avatarBorderStyle}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      right: '4px',
                      bottom: '4px',
                      borderRadius: 'full',
                      background: 'white',
                    }}
                  />
                  
                  <Avatar 
                    size="2xl" 
                    src={avatarImage}
                    position="relative"
                    zIndex={2}
                    animation={isUploading ? `${pulse} 1s ease-in-out infinite` : 'none'}
                    transition="all 0.3s ease"
                  />
                  
                  <IconButton
                    icon={<FiCamera />}
                    position="absolute"
                    bottom="0"
                    right="0"
                    size="sm"
                    colorScheme="yellow"
                    borderRadius="full"
                    onClick={handleFileClick}
                    zIndex={3}
                    boxShadow="lg"
                    _hover={{ transform: 'scale(1.1)' }}
                    transition="all 0.2s"
                  />
                </Box>
                
                {/* Progress indicator */}
                {isUploading && (
                  <VStack spacing={2}>
                    <Progress 
                      value={uploadProgress} 
                      size="sm" 
                      width="120px" 
                      colorScheme="yellow" 
                      borderRadius="full"
                      bg="gray.100"
                    />
                    <Text fontSize="sm" color="gray.600">
                      {Math.round(uploadProgress)}% {t("ProfileSection.downloaded", "Загружено")}
                    </Text>
                  </VStack>
                )}
                
                <Button 
                  size="sm" 
                  colorScheme="black" 
                  variant="outline"
                  borderRadius="xl"
                  onClick={handleFileClick}
                  leftIcon={<FiUpload />}
                  isLoading={isUploading}
                  loadingText={t("ProfileSection.uploading", "Загрузка...")}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  {t("ProfileSection.upload_image", "Загрузить изображение")}
                </Button>
              </VStack>
              
              {/* Basic Info */}
              <VStack spacing={4} flex={1} align="stretch">
                <FormControl>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    {t("ProfileSection.full_name", "Полное имя")}
                  </FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    size="lg"
                    borderRadius="xl"
                    focusBorderColor="orange.50"
                    _focus={{
                      boxShadow: '0 0 0 1px #FF6B35',
                      borderColor: 'orange.50'
                    }}
                  />
                </FormControl>
                
                {/* Address section */}
                <FormControl>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    {t("ProfileSection.address", "Адрес")}
                  </FormLabel>
                  <LocationSearchInput
                    placeholder={t("ProfileSection.enter_address", "Введите ваш адрес")}
                    value={formData.address}
                    onChange={handleInputChange}
                    size="lg"
                    i18n={i18n}
                  />
                </FormControl>
                  
                {/* Contact Info */}
                <Stack direction={{ base: "column", md: 'row' }} spacing={4}>
                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      {t("ProfileSection.phone", "Номер телефона")}
                    </FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement h={10}>
                        <FiPhone color={userData?.type === "phone" ? "#000" : "#A0AEC0"} />
                      </InputLeftElement>
                      <Input
                        value={userData?.type === "phone" ? formatPhone(formData.phone) : t("ProfileSection.not_provided", "Не указано")}
                        disabled
                        borderRadius="xl"
                        focusBorderColor="orange.50"
                        _focus={{
                          boxShadow: '0 0 0 1px #FF6B35',
                          borderColor: 'orange.50'
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                
                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">Email</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement h={10}>
                        <FiMail color={userData?.type === "email" ? "#000" : "#A0AEC0"} />
                      </InputLeftElement>
                      <Input
                        value={userData?.type === "email" ? formData.email : t("ProfileSection.not_provided", "Не указано")}
                        disabled
                        borderRadius="xl"
                        focusBorderColor="orange.50"
                        _focus={{
                          boxShadow: '0 0 0 1px #FF6B35',
                          borderColor: 'orange.50'
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                </Stack>

                {/* Bio */}
                <FormControl>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    {t("ProfileSection.about_yourself", "О себе")}
                  </FormLabel>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder={t("ProfileSection.about_yourself_placeholder", "Расскажите о себе и ваших услугах...")}
                    size="lg"
                    borderRadius="xl"
                    focusBorderColor="orange.50"
                    rows={4}
                    minH={'120px'}
                    maxH={'320px'}
                    _focus={{
                      boxShadow: '0 0 0 1px #FF6B35',
                      borderColor: 'orange.50'
                    }}
                  />
                </FormControl>
                
                <Button 
                  colorScheme="yellow" 
                  size="lg" 
                  borderRadius="xl"
                  isLoading={isLoading}
                  loadingText={t("ProfileSection.saving", "Сохранение...")}
                  onClick={handleSave}
                  leftIcon={<FiCheck />}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
                  transition="all 0.2s"
                >
                  {t("ProfileSection.save", "Сохранить изменения")}
                </Button>
              </VStack>
            </Stack>
            
            <Divider />
            
            {/* Security Section */}
            <VStack spacing={6} align="stretch">
              <Heading size="md" color="gray.600">
                {t("ProfileSection.security", "Безопасность и приватность")}
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      {t("ProfileSection.new_password", "Новый пароль")}
                    </FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t("ProfileSection.new_password_placeholder", "Придумайте надежный пароль")}
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        borderRadius="xl"
                        focusBorderColor="orange.50"
                        _focus={{
                          boxShadow: '0 0 0 1px #FF6B35',
                          borderColor: 'orange.50'
                        }}
                      />
                      <InputRightElement h={10}>
                        <IconButton
                          variant="ghost"
                          icon={showPassword ? <FiEyeOff /> : <FiEye />}
                          onClick={() => togglePasswordVisibility('password')}
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      {t("ProfileSection.confirm_password", "Повторите пароль")}
                    </FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t("ProfileSection.confirm_password", "Повторите пароль")}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        borderRadius="xl"
                        focusBorderColor="orange.50"
                        _focus={{
                          boxShadow: '0 0 0 1px #FF6B35',
                          borderColor: 'orange.50'
                        }}
                      />
                      <InputRightElement h={10}>
                        <IconButton
                          variant="ghost"
                          icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                          onClick={() => togglePasswordVisibility('confirm')}
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </VStack>

                <VStack spacing={4} align="stretch">
                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <FormLabel mb="0" fontWeight="semibold" color="gray.700">
                      {t("ProfileSection.push_notifications", "Push-уведомления")}
                    </FormLabel>
                    <Switch
                      colorScheme="yellow"
                      isChecked={formData.notifications}
                      onChange={(e) => handleInputChange('notifications', e.target.checked)}
                      size="lg"
                    />
                  </FormControl>
                  
                  <Button 
                    colorScheme="red" 
                    variant="outline"
                    size="lg"
                    borderRadius="xl"
                    onClick={onOpen}
                    leftIcon={<FiLogOut />}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    {t("ProfileSection.change_password", "Сменить пароль")}
                  </Button>
                </VStack>
              </SimpleGrid>
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Password Change Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl" mx={3}>
          <ModalHeader>
            {t("ProfileSection.modal_header", "Подтверждение смены пароля")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              {t("ProfileSection.modal_body", "Вы уверены, что хотите сменить пароль? Это действие потребует повторной авторизации.")}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} borderRadius="xl">
              {t("ProfileSection.cancel", "Отмена")}
            </Button>
            <Button 
              colorScheme="orange" 
              onClick={() => {onClose(); handlePasswordSave();}} 
              borderRadius="xl"
            >
              {t("ProfileSection.confirm", "Подтвердить")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
