import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Textarea,
  Button,
  SimpleGrid,
  Checkbox,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  Heading,
  Divider,
  Icon,
  Image,
  Alert,
  AlertIcon,
  AlertDescription,
  Center,
  useToast,
  useOutsideClick,
  InputGroup,
  InputRightElement,
  Spinner,
  List,
  ListItem,
} from "@chakra-ui/react";
import {
  FaChevronLeft,
  FaCamera,
  FaSave,
  FaTools,
  FaCogs,
  FaWrench,
  FaIndustry,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { useTranslation } from "react-i18next";

// Mock data - kelajakda API dan keladi
const MOCK_API_DATA = {
  services: [
    // Поставщики спецтехники
    {
      id: 1,
      name: "Поставщики подъемного оборудования",
      category: "equipment",
      categoryName: "Поставщики спецтехники",
    },
    {
      id: 2,
      name: "Поставщики тракторной техники",
      category: "equipment",
      categoryName: "Поставщики спецтехники",
    },
    {
      id: 3,
      name: "Поставщики бурового и геологоразведочного оборудования",
      category: "equipment",
      categoryName: "Поставщики спецтехники",
    },
    {
      id: 4,
      name: "Поставщики дорожно-строительной техники",
      category: "equipment",
      categoryName: "Поставщики спецтехники",
    },
    {
      id: 5,
      name: "Поставщики коммунальной техники",
      category: "equipment",
      categoryName: "Поставщики спецтехники",
    },
    {
      id: 6,
      name: "Поставщики складской техники",
      category: "equipment",
      categoryName: "Поставщики спецтехники",
    },

    // Поставщики запчастей
    {
      id: 7,
      name: "Поставщики гидравлических систем и РТИ",
      category: "parts",
      categoryName: "Поставщики запчастей и комплектующих",
    },
    {
      id: 8,
      name: "Поставщики запчастей для ходовой части",
      category: "parts",
      categoryName: "Поставщики запчастей и комплектующих",
    },
    {
      id: 9,
      name: "Поставщики кабин и аксессуаров для спецтехники",
      category: "parts",
      categoryName: "Поставщики запчастей и комплектующих",
    },
    {
      id: 10,
      name: "Поставщики масел и фильтров",
      category: "parts",
      categoryName: "Поставщики запчастей и комплектующих",
    },
    {
      id: 11,
      name: "Поставщики отопительного оборудования",
      category: "parts",
      categoryName: "Поставщики запчастей и комплектующих",
    },
    {
      id: 12,
      name: "Поставщики систем автоматизации и управления спецтехникой",
      category: "parts",
      categoryName: "Поставщики запчастей и комплектующих",
    },

    // Аренда
    {
      id: 13,
      name: "Аренда техники с оператором",
      category: "rental",
      categoryName: "Арендные компании",
    },

    // Ремонт
    {
      id: 14,
      name: "Диагностика спецтехники",
      category: "repair",
      categoryName: "Ремонт спецтехники",
    },
    {
      id: 15,
      name: "Ремонт автобетононасосов",
      category: "repair",
      categoryName: "Ремонт спецтехники",
    },
    {
      id: 16,
      name: "Ремонт автовышек",
      category: "repair",
      categoryName: "Ремонт спецтехники",
    },
    {
      id: 17,
      name: "Ремонт асфальтоукладчиков",
      category: "repair",
      categoryName: "Ремонт спецтехники",
    },
    {
      id: 18,
      name: "Ремонт бульдозеров",
      category: "repair",
      categoryName: "Ремонт спецтехники",
    },
    {
      id: 19,
      name: "Ремонт грейдеров",
      category: "repair",
      categoryName: "Ремонт спецтехники",
    },
    {
      id: 20,
      name: "Ремонт двигателей спецтехники",
      category: "repair",
      categoryName: "Ремонт спецтехники",
    },
  ],

  // Kompaniya ma'lumotlari - API dan keladi
  companyData: {
    id: 1,
    companyName: "ouytrewq",
    bin: "123456787654",
    address: "Toshkent Shahri, Узбекистан",
    description: "lkjhgfdsa",
    logoUrl: null,
    selectedServiceIds: [1, 5, 7, 14], // Tanlangan xizmatlar ID lari
  },
};

// Category konfiguratsiyasi
const CATEGORY_CONFIG = {
  equipment: {
    icon: FaIndustry,
    color: "blue.600",
    bgColor: "blue.50",
  },
  parts: {
    icon: FaCogs,
    color: "green.600",
    bgColor: "green.50",
  },
  rental: {
    icon: FaTools,
    color: "purple.600",
    bgColor: "purple.50",
  },
  repair: {
    icon: FaWrench,
    color: "orange.600",
    bgColor: "orange.100",
  },
};

// LocationSearchInput komponenti
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
  
  // value prop o'zgarganida query ni yangilash
  useEffect(() => {
    setQuery(value || "");
  }, [value]);
  
  useOutsideClick({
    ref: suggestionsRef,
    handler: () => setShowSuggestions(false),
  });

  // Google Maps Places API dan ma'lumot olish
  const fetchPlaceSuggestions = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const selected_Lang = i18n?.language || 'uz';
      const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(searchQuery)}&language=${selected_Lang}`);
      const data = await response.json();
      setSuggestions(data.predictions || []);
    } catch (error) {
      console.error("Error fetching place suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPlaceSuggestions(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, i18n?.language]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange("address", newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (suggestion) => {
    setQuery(suggestion.description);
    onChange("address", suggestion.description); // Bu yerda ham to'g'ri callback
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <Box position="relative" ref={suggestionsRef} {...otherProps}>
      <InputGroup>
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          size={size}
          {...inputProps}
        />
        {isLoading && (
          <InputRightElement>
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
          maxH="200px"
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

// Reusable checkbox component
const CheckboxOption = ({ children, isChecked, onChange, ...props }) => {
  return (
    <Checkbox
      isChecked={isChecked}
      onChange={onChange}
      colorScheme="yellow"
      size="md"
      sx={{
        ".chakra-checkbox__control": {
          borderColor: "#fed500",
          _checked: {
            bg: "#fed500",
            borderColor: "#fed500",
            color: "white",
            _hover: {
              bg: "#fed500",
              borderColor: "#fed500",
            },
          },
          _focus: {
            boxShadow: "0 0 0 3px rgba(254, 213, 0, 0.6)",
          },
        },
      }}
      {...props}
    >
      <Text fontSize="sm" color="gray.700" lineHeight="1.4">
        {children}
      </Text>
    </Checkbox>
  );
};

const CompanyProfileForm = () => {
  const toast = useToast();
  const { i18n, t } = useTranslation();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  // Mock API data - kelajakda API dan load bo'ladi
  const [apiServices, setApiServices] = useState([]);
  const [formData, setFormData] = useState({
    companyName: "",
    bin: "",
    address: "",
    description: "",
  });
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState("");

  // Mock API dan ma'lumot yuklash
  useEffect(() => {
    // API call simulation
    const loadApiData = async () => {
      try {
        // Mock API response
        const { services, companyData } = MOCK_API_DATA;

        setApiServices(services);
        setFormData({
          companyName: companyData.companyName,
          bin: companyData.bin,
          address: companyData.address,
          description: companyData.description,
        });
        setSelectedServiceIds(companyData.selectedServiceIds);

        if (companyData.logoUrl) {
          setImagePreview(companyData.logoUrl);
        }
      } catch (error) {
        console.error("API ma'lumotlarini yuklashda xatolik:", error);
        toast({
          title: "Xatolik",
          description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    loadApiData();
  }, [toast]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceChange = (serviceId) => {
    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setUploadError("");

    if (!file) return;

    // limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Размер файла не должен превышать 5MB");
      return;
    }

    // Ruxsat etilgan formatlar
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Допустимые форматы: JPG, JPEG, PNG, SVG");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const base64String = e.target.result;
      setImageData(base64String);
      setImagePreview(base64String);
      toast({
        title: "Изображение загружено",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    };

    reader.onerror = () => {
      setUploadError("Ошибка при загрузке файла");
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageData(null);
    setImagePreview(null);
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    // Faqat tanlangan xizmatlar
    const selectedServices = apiServices.filter((service) =>
      selectedServiceIds.includes(service.id)
    );

    const saveData = {
      companyName: formData.companyName,
      bin: formData.bin,
      address: formData.address,
      description: formData.description,
      selectedServiceIds: selectedServiceIds, // Faqat ID lar
      selectedServices: selectedServices, // To'liq ma'lumot bilan
      logoBase64: imageData || null,
    };

    try {
      // API call simulation
      // console.log("=== SERVERGA YUBORILADIGAN MA'LUMOTLAR ===");
      // console.log("Kompaniya ma'lumotlari:", {
      //   companyName: saveData.companyName,
      //   bin: saveData.bin,
      //   address: saveData.address,
      //   description: saveData.description,
      // });
      // console.log("Tanlangan xizmatlar ID lari:", saveData.selectedServiceIds);
      // console.log("Tanlangan xizmatlar (to'liq):", saveData.selectedServices);
      // console.log(
      //   "Logo ma'lumoti:",
      //   saveData.logoBase64 ? "Base64 ma'lumot mavjud" : "Logo yo'q"
      // );

      // Mock API call
      // const response = await fetch('/api/company/update', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(saveData)
      // });

      toast({
        title: "Ma'lumotlar saqlandi",
        description: `${selectedServices.length} ta xizmat tanlandi va saqlandi`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni saqlashda xatolik yuz berdi",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const inputStyles = {
    borderColor: "#e2e8f0",
    _hover: { borderColor: "#fed500" },
    _focus: {
      borderColor: "#fed500",
      boxShadow: "0 0 0 1px #fed500",
    },
  };

  // Xizmatlarni kategoriya bo'yicha guruhlash
  const groupedServices = apiServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <Box p={{ base: 4, md: 6 }} minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack spacing={4}>
          <Icon
            cursor={"pointer"}
            onClick={() => navigate(-1)}
            as={FaChevronLeft}
            boxSize={6}
            color="#fed500"
          />
          <Heading size="xl" color="gray.800" fontWeight="bold">
            Профиль компании
          </Heading>
        </HStack>

        {/* Main Form Card */}
        <Card bg="white" shadow="xl" borderRadius="xl" overflow="hidden">
          <CardBody p={{ base: 6, md: 8 }}>
            <VStack spacing={8} align="stretch">
              {/* Company Info Section */}
              <Box>
                <Heading
                  size="md"
                  color="gray.800"
                  mb={6}
                  pb={2}
                  borderBottom="2px solid #fed500"
                >
                  Основная информация
                </Heading>

                <SimpleGrid
                  columns={{ base: 1, custom1080: 3 }}
                  spacing={8}
                  alignItems="start"
                >
                  {/* Left - Image Upload */}
                  <VStack spacing={4} align="center">
                    {imagePreview ? (
                      <Box position="relative">
                        <Image
                          src={imagePreview}
                          alt="Company Logo"
                          borderRadius="full"
                          w={{base: "150px", sm: "180px", custom1080: '150px', xl: '200px'}}
                          h={{base: "150px", sm: "180px", custom1080: "150px", xl: '200px'}}
                          objectFit="cover"
                          border="3px solid #fed500"
                        />
                        <Button
                          position="absolute"
                          top={-1}
                          right={-5}
                          size="sm"
                          colorScheme="red"
                          borderRadius="full"
                          onClick={removeImage}
                          w="30px"
                          h="30px"
                        >
                          <Icon as={FaTimes} boxSize={3} />
                        </Button>
                      </Box>
                    ) : (
                      <Center
                        w={{base: "150px", sm: "180px", custom1080: '150px', xl: '200px'}}
                        h={{base: "150px", sm: "180px", custom1080: '150px', xl: '200px'}}
                        bg="gray.100"
                        borderRadius="full"
                        border="2px dashed #fed500"
                        cursor="pointer"
                        onClick={() => fileInputRef.current?.click()}
                        transition="all 0.2s"
                        _hover={{ bg: "gray.200", transform: "scale(1.02)" }}
                      >
                        <VStack spacing={2}>
                          <Icon as={FaUpload} boxSize={{base: 6, sm: 8, custom1080: 6, xl: 8}} color="#fed500" />
                          <Text
                            color="gray.600"
                            fontSize={{base: "xs", sm: "sm", custom1080: "xs", xl: "sm"}}
                            textAlign="center"
                          >
                            Загрузить логотип
                          </Text>
                        </VStack>
                      </Center>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept=".jpg,.jpeg,.png,.svg"
                      style={{ display: "none" }}
                    />

                    <Button
                      leftIcon={<FaCamera />}
                      bg="#fed500"
                      color="black"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      _hover={{ bg: "#e6c200" }}
                      _active={{ bg: "#ccac00" }}
                    >
                      {imagePreview ? "Изменить фото" : "Загрузить фото"}
                    </Button>

                    {uploadError && (
                      <Alert status="error" borderRadius="md" fontSize="sm">
                        <AlertIcon boxSize={4} />
                        <AlertDescription>{uploadError}</AlertDescription>
                      </Alert>
                    )}

                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Максимальный размер: 5MB
                      <br />
                      Форматы: JPG, JPEG, PNG, SVG
                    </Text>
                  </VStack>

                  {/* Middle - Form Fields */}
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        Название компании
                      </FormLabel>
                      <Input
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        placeholder="Введите название компании"
                        size="lg"
                        {...inputStyles}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        БИН
                      </FormLabel>
                      <Input
                        value={formData.bin}
                        onChange={(e) =>
                          handleInputChange("bin", e.target.value)
                        }
                        placeholder="Введите БИН"
                        size="lg"
                        {...inputStyles}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        Адрес
                      </FormLabel>
                      {/* TUZATILGAN LocationSearchInput ishlatish */}
                      <LocationSearchInput
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Введите адрес"
                        size="lg"
                        i18n={i18n}
                        inputProps={inputStyles}
                      />
                    </FormControl>
                  </VStack>

                  {/* Right - Description */}
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        Описание вашей компании
                      </FormLabel>
                      <Textarea
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Введите описание компании, её деятельности и преимуществ..."
                        rows={6}
                        minH={"150px"}
                        maxH={{base: "370px", custom900: "270px"}}
                        resize="vertical"
                        {...inputStyles}
                      />
                    </FormControl>
                  </VStack>
                </SimpleGrid>
              </Box>

              <Divider borderColor="#fed500" borderWidth="1px" />

              {/* Services Section */}
              <VStack spacing={8} align="stretch">
                <Box>
                  <Heading size="md" color="gray.800" mb={2}>
                    Специализация компании
                  </Heading>
                  <Text fontSize="sm" color="gray.600" mb={6}>
                    Выберите направления деятельности и услуги, которые
                    предоставляет ваша компания.
                  </Text>
                </Box>

                {/* Kategoriya bo'yicha xizmatlarni ko'rsatish */}
                {Object.entries(groupedServices).map(
                  ([categoryKey, services]) => {
                    const config = CATEGORY_CONFIG[categoryKey];
                    const categoryName =
                      services[0]?.categoryName || categoryKey;

                    return (
                      <Box
                        key={categoryKey}
                        p={6}
                        bg={config?.bgColor || "gray.50"}
                        borderRadius="xl"
                        border="1px solid #e2e8f0"
                      >
                        <HStack mb={6}>
                          <Icon
                            as={config?.icon || FaTools}
                            color={config?.color || "gray.600"}
                            boxSize={6}
                          />
                          <Heading size="sm" color="gray.800">
                            {categoryName}
                          </Heading>
                        </HStack>
                        <SimpleGrid
                          columns={{ base: 1, md: 2, lg: 3 }}
                          spacing={4}
                        >
                          {services.map((service) => (
                            <CheckboxOption
                              key={service.id}
                              isChecked={selectedServiceIds.includes(
                                service.id
                              )}
                              onChange={() => handleServiceChange(service.id)}
                            >
                              {service.name}
                            </CheckboxOption>
                          ))}
                        </SimpleGrid>
                      </Box>
                    );
                  }
                )}
              </VStack>

              {/* Save Button */}
              <VStack justify="center" my={4}>
                <Text fontSize={{base: "xs", custom380: "sm", sm: "md", custom570: "lg"}}>
                    ({selectedServiceIds.length}) услуг выбрано
                </Text>
                <Button
                  leftIcon={<FaSave />}
                  bg="#fed500"
                  color="black"
                  size="lg"
                  maxW={'full'}
                  onClick={handleSave}
                  px={12}
                  py={6}
                  fontSize={{base: "xs", custom380: "sm", sm: "md", custom570: "lg"}}
                  fontWeight="bold"
                  _hover={{ bg: "#e6c200", transform: "translateY(-2px)" }}
                  _active={{ bg: "#ccac00" }}
                  transition="all 0.2s"
                  boxShadow="lg"
                >
                  Сохранить данные
                </Button>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default CompanyProfileForm;
