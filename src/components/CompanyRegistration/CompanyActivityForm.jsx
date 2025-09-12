import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  Container,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertDescription,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  useBreakpointValue,
  IconButton,
  useDisclosure,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Checkbox,
  CheckboxGroup,
  Stack,
  Spinner
} from '@chakra-ui/react';
import { MdArrowBack, MdClose } from 'react-icons/md';
import { FiChevronDown, FiX } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import SideTranslator from '../../Pages/SideTranslator';
import { useTranslation } from 'react-i18next';

const CompanyActivityForm = () => {
  const [formData, setFormData] = useState({
    orderSettings: [],
    techTypes: [],
    workingBrands: []
  });

  const [showAlert, setShowAlert] = useState(true);
  const [companyData, setCompanyData] = useState(null);
  const { t } = useTranslation();
  // All hooks must be called at the top level
  const { isOpen: isOrderOpen, onToggle: onOrderToggle } = useDisclosure();
  const { isOpen: isTechOpen, onToggle: onTechToggle } = useDisclosure();
  const { isOpen: isBrandOpen, onToggle: onBrandToggle } = useDisclosure();
  const maxVisibleItems = useBreakpointValue({ base: 2, sm: 3, md: 5, lg: 7 });
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Navigate orqali kelgan ma'lumotlarni olish
    if (location.state) {
      const { companyData, registrationSuccess, registrationDate, formData } = location.state;
      
      if (registrationSuccess && companyData) {
        setCompanyData(companyData);
        // console.log('Kelgan kompaniya ma\'lumotlari:', companyData);
        // console.log('Ro\'yxatdan o\'tish sanasi:', registrationDate);
        // console.log('Form ma\'lumotlari:', formData);
      } else {
        // Agar ma'lumotlar yo'q bo'lsa, oldingi sahifaga qaytarish
        navigate('/auth/registration-performer/company');
      }
    } else {
      // Agar state yo'q bo'lsa, oldingi sahifaga qaytarish
      navigate('/auth/registration-performer/company');
    }
  }, [location, navigate]);

  if (!companyData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh" flexDir={'column'} gap={"40px"}>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="orange.50" size="xl" />
        <Text>{t("Orderform.form.attachments.loading", "Загрузка...")}</Text>
      </Box>
    );
  }

  // Data options
  const orderOptions = [
    'Ремонт техники',
    'Продажа запчастей',
    'Техническое обслуживание',
    'Диагностика',
    'Установка оборудования',
    'Гарантийное обслуживание',
    'Консультации',
    'Выезд на дом',
    'Экспресс ремонт',
    'Восстановление данных'
  ];

  const techTypeOptions = [
    'Смартфоны',
    'Планшеты',
    'Ноутбуки',
    'Компьютеры',
    'Телевизоры',
    'Холодильники',
    'Стиральные машины',
    'Кондиционеры',
    'Микроволновки',
    'Пылесосы',
    'Игровые консоли',
    'Принтеры',
    'Камеры',
    'Аудиотехника'
  ];

  const brandOptions = [
    'Apple',
    'Samsung',
    'Xiaomi',
    'Huawei',
    'Sony',
    'LG',
    'Dell',
    'HP',
    'Lenovo',
    'Asus',
    'Acer',
    'MSI',
    'Canon',
    'Nikon',
    'Bosch',
    'Siemens',
    'Philips',
    'Panasonic',
    'Toshiba',
    'Whirlpool'
  ];

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [field]: newValues
      };
    });
  };

  const removeItem = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const clearAll = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: []
    }));
  };

  const handleSubmit = () => {
    // Form ma'lumotlarini tayyorlash
    const activityData = {
      orderSettings: formData.orderSettings || [],
      techTypes: formData.techTypes || [],
      workingBrands: formData.workingBrands || []
    };
    
    // console.log('Form ma\'lumotlari yuborilmoqda:', activityData);
    localStorage.setItem("isCompany", "true");
    // Keyingi sahifaga navigate qilish - companyData va activityData bilan
    navigate('/company', {
      state: {
        companyData: companyData,
        activityData: activityData,
        registrationSuccess: true,
        skipped: false
      }
    });
  };

  const handleSkip = () => {
    // Bo'sh ma'lumotlar bilan keyingi sahifaga o'tish
    const skippedActivityData = {
      orderSettings: [],
      techTypes: [],
      workingBrands: []
    };
    
    // console.log('Form o\'tkazib yuborildi:', skippedActivityData);
    localStorage.setItem("isCompany", "true");
    
    // Keyingi sahifaga navigate qilish
    navigate('/company', {
      state: {
        companyData: companyData,
        activityData: skippedActivityData,
        registrationSuccess: true,
        skipped: true
      }
    });
  };

  const handleGoBack = () => {
    // Oldingi sahifaga qaytish - companyData bilan
    navigate('/auth/registration-performer', {
      state: {
        companyData: companyData,
        fromActivityForm: true
      }
    });
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const renderMultiSelectField = (
    field, 
    options, 
    label, 
    placeholder,
    isOpen,
    onToggle
  ) => {
    const selectedItems = formData[field];
    const visibleItems = selectedItems.slice(0, maxVisibleItems);
    const hiddenCount = selectedItems.length - maxVisibleItems;

    return (
      <FormControl>
        <FormLabel 
          fontSize={{ base: "sm", md: "md" }} 
          fontWeight="semibold" 
          mb={3} 
          color="gray.700"
        >
          {label}
        </FormLabel>
        
        {/* Selected items display */}
        {selectedItems.length > 0 && (
          <Flex wrap="wrap" gap={2} mb={3}>
            {visibleItems.map((item) => (
              <Tag
                key={item}
                size={{ base: "sm", md: "md" }}
                borderRadius="full"
                variant="solid"
                bg="gray.100"
                color="gray.700"
                border="1px solid"
                borderColor="gray.200"
              >
                <TagLabel fontSize={{ base: "xs", md: "sm" }}>{item}</TagLabel>
                <TagCloseButton
                  onClick={() => removeItem(field, item)}
                  color="gray.500"
                  _hover={{ color: "gray.700" }}
                />
              </Tag>
            ))}
            
            {hiddenCount > 0 && (
              <Badge
                colorScheme="blue"
                borderRadius="full"
                px={3}
                py={1}
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight="medium"
              >
                +{hiddenCount}
              </Badge>
            )}
          </Flex>
        )}

        {/* Dropdown Menu */}
        <Menu closeOnSelect={false} isOpen={isOpen} onClose={onToggle}>
          <MenuButton
            as={Button}
            rightIcon={<FiChevronDown />}
            w="full"
            textAlign="left"
            fontWeight="normal"
            bg="white"
            border="1px solid"
            borderColor="gray.300"
            _hover={{ borderColor: "gray.400" }}
            _focus={{ 
              borderColor: "#fed500", 
              boxShadow: "0 0 0 1px #fed500"
            }}
            _active={{ bg: "gray.50" }}
            onClick={onToggle}
            justifyContent="space-between"
            py={{ base: 2, md: 3 }}
            px={{ base: 3, md: 4 }}
            fontSize={{ base: "sm", md: "md" }}
            minH={{ base: "40px", md: "48px" }}
          >
            <Text color={selectedItems.length > 0 ? "gray.800" : "gray.500"}>
              {selectedItems.length > 0 
                ? `${t("Orderform.select_type.selected", "Выбрано")}: ${selectedItems.length}` 
                : placeholder
              }
            </Text>
          </MenuButton>
          
          <MenuList 
            maxH="300px" 
            overflowY="auto" 
            w="full" 
            minW={{ base: "280px", md: "400px" }}
            fontSize={{ base: "sm", md: "md" }}
          >
            {/* Clear all option */}
            {selectedItems.length > 0 && (
              <>
                <MenuItem
                  onClick={() => clearAll(field)}
                  color="red.500"
                  _hover={{ bg: "red.50" }}
                  icon={<FiX />}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {t("partners.reset", "Очистить все")}
                </MenuItem>
                <MenuDivider />
              </>
            )}
            
            {/* Options */}
            <CheckboxGroup value={selectedItems}>
              <Stack spacing={0}>
                {options.map((option) => (
                  <MenuItem
                    key={option}
                    onClick={() => handleMultiSelect(field, option)}
                    _hover={{ bg: "gray.50" }}
                    py={{ base: 2, md: 3 }}
                  >
                    <Checkbox
                      isChecked={selectedItems.includes(option)}
                      colorScheme="yellow"
                      mr={3}
                      pointerEvents="none"
                      size={{ base: "sm", md: "md" }}
                    >
                      <Text fontSize={{ base: "sm", md: "md" }}>{option}</Text>
                    </Checkbox>
                  </MenuItem>
                ))}
              </Stack>
            </CheckboxGroup>
          </MenuList>
        </Menu>
      </FormControl>
    );
  };

  return (
    <>
      <SideTranslator />
      <Box 
        minH="100vh" 
        bg="gray.50" 
        py={{ base: 4, sm: 6, md: 8 }}
        px={{ base: 2, sm: 4 }}
      >
        <Container 
          maxW={{ base: "full", sm: "md", md: "lg", lg: "xl" }} 
          px={{ base: 2, sm: 4, md: 6 }}
        >
          <VStack 
            spacing={{ base: 4, sm: 6, md: 8 }} 
            align="stretch"
            maxW="100%"
          >
            
            {/* Header */}
            <VStack spacing={{ base: 3, md: 4 }} align="flex-start">
              <Button
                variant="ghost"
                leftIcon={<MdArrowBack />}
                color="gray.600"
                _hover={{ color: "gray.800", bg: "gray.100" }}
                size={{ base: "sm", md: "md" }}
                alignSelf="flex-start"
                onClick={handleGoBack}
                fontSize={{ base: "sm", md: "md" }}
              >
                <Text display={{ base: "none", sm: "block" }}>
                  {t("CompanyActivityForm.about_company", "Информация о деятельности компании")}
                </Text>
                <Text display={{ base: "block", sm: "none" }}>
                  {t("ApplicationForm.back", "Назад")}
                </Text>
              </Button>

              {/* Info Alert */}
              {showAlert && (
                <Alert 
                  status="info" 
                  borderRadius={{ base: "md", md: "lg" }} 
                  bg="blue.50" 
                  border="1px solid" 
                  borderColor="blue.200"
                  fontSize={{ base: "sm", md: "md" }}
                  py={{ base: 3, md: 4 }}
                >
                  <AlertIcon color="blue.500" />
                  <AlertDescription fontSize={{ base: "sm", md: "md" }} color="blue.700">
                    {t("CompanyActivityForm.based_onSelectedType", "По выбранному типу, вам будут поступать заказы от клиентов")}
                  </AlertDescription>
                  <IconButton
                    aria-label="Close alert"
                    icon={<MdClose />}
                    size="sm"
                    variant="ghost"
                    color="blue.500"
                    ml="auto"
                    onClick={closeAlert}
                  />
                </Alert>
              )}
            </VStack>

            {/* Form Fields */}
            <VStack spacing={{ base: 6, md: 8 }} w="full">
              
              {/* Order Settings */}
              {renderMultiSelectField(
                'orderSettings',
                orderOptions,
                t("CompanyActivityForm.order_settings", 'Настройки заказов'),
                t("CompanyRegistration.company.choose",'Выбрать'),
                isOrderOpen,
                onOrderToggle
              )}

              {/* Tech Types */}
              {renderMultiSelectField(
                'techTypes',
                techTypeOptions,
                t("CompanyActivityForm.tech_types", 'Тип техники'),
                t("CompanyRegistration.company.choose",'Выбрать'),
                isTechOpen,
                onTechToggle
              )}

              {/* Working Brands */}
              {renderMultiSelectField(
                'workingBrands',
                brandOptions,
                t("CompanyActivityForm.working_brands", 'С какими марками вы работаете ?'),
                t("CompanyRegistration.company.choose",'Выбрать'),
                isBrandOpen,
                onBrandToggle
              )}

            </VStack>

            {/* Action Buttons */}
            <HStack 
              spacing={{ base: 3, md: 4 }} 
              pt={{ base: 4, md: 6 }}
              flexDirection={{ base: "column", sm: "row" }}
            >
              <Button
                flex={1}
                variant="outline"
                borderColor="#fed500"
                color="gray.800"
                _hover={{ bg: "#fed500", color: "gray.900" }}
                _active={{ bg: "#f5cd00" }}
                fontWeight="medium"
                py={{ base: 5, md: 6 }}
                onClick={handleSkip}
                fontSize={{ base: "sm", md: "md" }}
                w={{ base: "full", sm: "auto" }}
              >
                {t("CompanyActivityForm.skip", "Пропустить")}
              </Button>
              
              <Button
                flex={1}
                bg="#fed500"
                color="gray.900"
                _hover={{ bg: "#f5cd00" }}
                _active={{ bg: "#e6bf00" }}
                fontWeight="medium"
                py={{ base: 5, md: 6 }}
                onClick={handleSubmit}
                fontSize={{ base: "sm", md: "md" }}
                w={{ base: "full", sm: "auto" }}
              >
                {t("CompanyRegistration.company.confirm", "Подтвердить")}
              </Button>
            </HStack>

            {/* Summary */}
            {(formData.orderSettings.length > 0 || formData.techTypes.length > 0 || formData.workingBrands.length > 0) && (
              <Box
                bg="white"
                p={{ base: 4, md: 6 }}
                borderRadius={{ base: "md", md: "lg" }}
                border="1px solid"
                borderColor="gray.200"
                shadow="sm"
              >
                <Text 
                  fontSize={{ base: "sm", md: "md" }} 
                  fontWeight="semibold" 
                  color="gray.700" 
                  mb={3}
                >
                  {t("CompanyActivityForm.selected_settings", "Выбранные настройки:")}
                </Text>
                <VStack spacing={2} align="flex-start">
                  {formData.orderSettings.length > 0 && (
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                      {t("CompanyActivityForm.order_settings", "Настройки заказов:")} <Badge colorScheme="blue">{formData.orderSettings.length}</Badge>
                    </Text>
                  )}
                  {formData.techTypes.length > 0 && (
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                      {t("CompanyActivityForm.tech_types", "Типы техники:")} <Badge colorScheme="green">{formData.techTypes.length}</Badge>
                    </Text>
                  )}
                  {formData.workingBrands.length > 0 && (
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                      {t("CompanyActivityForm.working_brands", "Марки:")} <Badge colorScheme="purple">{formData.workingBrands.length}</Badge>
                    </Text>
                  )}
                </VStack> 
              </Box>
            )}
            
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default CompanyActivityForm;