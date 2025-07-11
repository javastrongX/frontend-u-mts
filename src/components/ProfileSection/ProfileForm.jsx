import { useState, useRef } from 'react';
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
  Stack
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
} from 'react-icons/fi';

import { keyframes } from "@emotion/react"

import { SearchableSelect } from './profilecomponents/SearchableSelect'

// Instagram-style rotating animation
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Pulsing animation for avatar
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const ProfileForm = () => {
  // Bazadan kelgan ma'lumotlar (misol)
  const [formData, setFormData] = useState({
    name: 'Gaybullayev Jorabek Alisher ogli',
    country: 'uz', // Uzbekistan kodini qo'shamiz
    city: 'tashkent', // Toshkent kodini qo'shamiz
    phone: '+7 (777) 123-45-67',
    email: 'jorabek@example.com',
    bio: 'Tajribali dasturchi va IT konsultant. Web va mobil ilovalar yaratish bo\'yicha 5 yillik tajribaga egaman.',
    notifications: true,
    publicProfile: true,
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [avatarImage, setAvatarImage] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Davlatlar ro'yxati
  const countryOptions = [
    { 
      value: 'kz', 
      label: '🇰🇿 Казахстан',
      searchKeys: ['казахстан', 'kazakhstan', 'qazaqstan']
    },
    { 
      value: 'uz', 
      label: '🇺🇿 Узбекистан',
      searchKeys: ['узбекистан', 'uzbekistan', 'oʻzbekiston']
    },
    { 
      value: 'ru', 
      label: '🇷🇺 Россия',
      searchKeys: ['россия', 'russia', 'rusiya']
    },
    { 
      value: 'kg', 
      label: '🇰🇬 Кыргызстан',
      searchKeys: ['кыргызстан', 'kyrgyzstan', 'kirgiziya']
    },
    { 
      value: 'tj', 
      label: '🇹🇯 Таджикистан',
      searchKeys: ['таджикистан', 'tajikistan', 'tojikiston']
    },
    { 
      value: 'tm', 
      label: '🇹🇲 Туркменистан',
      searchKeys: ['туркменистан', 'turkmenistan', 'türkmenistan']
    },
    { 
      value: 'az', 
      label: '🇦🇿 Азербайджан',
      searchKeys: ['азербайджан', 'azerbaijan', 'azərbaycan']
    },
    { 
      value: 'by', 
      label: '🇧🇾 Беларусь',
      searchKeys: ['беларусь', 'belarus', 'беларусiя']
    },
    { 
      value: 'ua', 
      label: '🇺🇦 Украина',
      searchKeys: ['украина', 'ukraine', 'україна']
    },
    { 
      value: 'ge', 
      label: '🇬🇪 Грузия',
      searchKeys: ['грузия', 'georgia', 'საქართველო']
    },
    { 
      value: 'am', 
      label: '🇦🇲 Армения',
      searchKeys: ['армения', 'armenia', 'հայաստան']
    },
    { 
      value: 'md', 
      label: '🇲🇩 Молдова',
      searchKeys: ['молдова', 'moldova', 'молдавия']
    },
  ];

  // Shaharlar ro'yxati - davlatga qarab
  const getCityOptions = (countryCode) => {
    const cities = {
      kz: [
        { value: 'almaty', label: 'Алматы' },
        { value: 'astana', label: 'Нур-Султан (Астана)' },
        { value: 'shymkent', label: 'Шымкент' },
        { value: 'aktobe', label: 'Актобе' },
        { value: 'taraz', label: 'Тараз' },
        { value: 'pavlodar', label: 'Павлодар' },
        { value: 'ust-kamenogorsk', label: 'Усть-Каменогорск' },
        { value: 'karaganda', label: 'Караганда' },
      ],
      uz: [
        { value: 'tashkent', label: 'Ташкент' },
        { value: 'samarkand', label: 'Самарканд' },
        { value: 'bukhara', label: 'Бухара' },
        { value: 'andijan', label: 'Андижан' },
        { value: 'namangan', label: 'Наманган' },
        { value: 'fergana', label: 'Фергана' },
        { value: 'nukus', label: 'Нукус' },
        { value: 'khiva', label: 'Хива' },
      ],
      ru: [
        { value: 'moscow', label: 'Москва' },
        { value: 'spb', label: 'Санкт-Петербург' },
        { value: 'novosibirsk', label: 'Новосибирск' },
        { value: 'ekaterinburg', label: 'Екатеринбург' },
        { value: 'kazan', label: 'Казань' },
        { value: 'nizhny-novgorod', label: 'Нижний Новгород' },
        { value: 'chelyabinsk', label: 'Челябинск' },
        { value: 'samara', label: 'Самара' },
      ],
      kg: [
        { value: 'bishkek', label: 'Бишкек' },
        { value: 'osh', label: 'Ош' },
        { value: 'jalal-abad', label: 'Джалал-Абад' },
        { value: 'karakol', label: 'Каракол' },
      ],
      tj: [
        { value: 'dushanbe', label: 'Душанбе' },
        { value: 'khujand', label: 'Худжанд' },
        { value: 'kulob', label: 'Кулоб' },
        { value: 'qurghonteppa', label: 'Курган-Тюбе' },
      ],
      tm: [
        { value: 'ashgabat', label: 'Ашхабад' },
        { value: 'turkmenbashi', label: 'Туркменбаши' },
        { value: 'mary', label: 'Мары' },
        { value: 'turkmenabat', label: 'Туркменабат' },
      ],
    };
    return cities[countryCode] || [];
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Agar davlat o'zgarsa, shaharni tozalash
      if (field === 'country') {
        newData.city = '';
      }
      return newData;
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Профиль обновлен!',
        description: 'Ваши данные успешно сохранены.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    }, 2000);
  };

  // Rasm yuklash funksiyasi
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Faqat rasm fayllarini qabul qilish
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Xato!',
          description: 'Iltimos, faqat rasm fayllarini yuklang.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Fayl hajmini tekshirish (5MB gacha)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Xato!',
          description: 'Rasm hajmi 5MB dan kichik bo\'lishi kerak.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Upload boshlash
      setIsUploading(true);
      setUploadProgress(0);

      // Progress bar animatsiyasi
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15 + 5; // Realistik progress
        });
      }, 200);

      // FileReader bilan rasmni o'qish
      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          setAvatarImage(e.target.result);
          setIsUploading(false);
          setUploadProgress(0);
          toast({
            title: 'Rasm yuklandi!',
            description: 'Avatar muvaffaqiyatli yangilandi.',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        }, 1500); // Upload tugash animatsiyasi uchun kechikish
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Yashirin file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
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
                    background={isUploading 
                      ? `conic-gradient(from 0deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80, #405DE6)`
                      : avatarImage 
                        ? 'linear-gradient(45deg, #833AB4, #C13584, #E1306C, #F56040)'
                        : 'gray.200'
                    }
                    animation={isUploading ? `${rotate} 2s linear infinite` : 'none'}
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
                    onClick={handleCameraClick}
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
                      {Math.round(uploadProgress)}% yuklandi
                    </Text>
                  </VStack>
                )}
                
                <Button 
                  size="sm" 
                  colorScheme="black" 
                  variant="outline"
                  borderRadius="xl"
                  onClick={handleUploadClick}
                  leftIcon={<FiUpload />}
                  isLoading={isUploading}
                  loadingText="Yuklanmoqda..."
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Rasm yuklash
                </Button>
              </VStack>
              
              {/* Basic Info */}
              <VStack spacing={4} flex={1} align="stretch">
                <FormControl>
                  <FormLabel fontWeight="semibold" color="gray.700">Полное имя</FormLabel>
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
                
                <Stack direction={{ base: "column", md: 'row' }} spacing={4}>
                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">Страна</FormLabel>
                    <SearchableSelect
                      placeholder="Выбрать страну"
                      value={formData.country}
                      onChange={(value) => handleInputChange('country', value)}
                      options={countryOptions}
                      size="lg"
                      borderRadius="xl"
                      colorScheme="purple"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">Город</FormLabel>
                    <SearchableSelect
                      placeholder={formData.country ? "Выбрать город" : "Сначала выберите страну"}
                      value={formData.city}
                      onChange={(value) => handleInputChange('city', value)}
                      options={getCityOptions(formData.country)}
                      size="lg"
                      borderRadius="xl"
                      colorScheme="purple"
                      disabled={!formData.country}
                    />
                  </FormControl>
                </Stack>

                {/* Contact Info */}
                <Stack direction={{ base: "column", md: 'row' }} spacing={4}>
                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">Телефон</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement h={10}>
                        <FiPhone color="gray.400" />
                      </InputLeftElement>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
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
                        <FiMail color="gray.400" />
                      </InputLeftElement>
                      <Input
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
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
                  <FormLabel fontWeight="semibold" color="gray.700">О себе</FormLabel>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Расскажите о себе и ваших услугах..."
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
                  loadingText="Сохранение..."
                  onClick={handleSave}
                  leftIcon={<FiCheck />}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
                  transition="all 0.2s"
                >
                  Сохранить изменения
                </Button>
              </VStack>
            </Stack>
            
            <Divider />
            
            {/* Security Section */}
            <VStack spacing={6} align="stretch">
              <Heading size="md" color="gray.600">
                Безопасность и приватность
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">Новый пароль</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Придумайте надежный пароль"
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
                          onClick={() => setShowPassword(!showPassword)}
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">Повторите пароль</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Повторите пароль"
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </VStack>

                <VStack spacing={4} align="stretch">
                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <FormLabel mb="0" fontWeight="semibold" color="gray.700">
                      Push-уведомления
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
                    Сменить пароль
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
        <ModalContent borderRadius="2xl">
          <ModalHeader>Подтверждение смены пароля</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Вы уверены, что хотите сменить пароль? Это действие потребует повторной авторизации.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} borderRadius="xl">
              Отмена
            </Button>
            <Button colorScheme="orange" onClick={onClose} borderRadius="xl">
              Подтвердить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};