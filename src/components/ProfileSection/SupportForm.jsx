import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  useDisclosure,
  useOutsideClick,
  Icon,
  List,
  ListItem,
  InputGroup,
  InputLeftAddon,
  VStack,
  HStack,
  useToast,
  Container,
  Kbd,
} from "@chakra-ui/react";
import { FaChevronDown, FaMapMarkerAlt, FaSearch } from "react-icons/fa";

// Cities data
const cities = [
  { value: "tashkent", label: "Tashkent"},
  { value: "samarkand", label: "Samarkand"},
  { value: "bukhara", label: "Bukhara"},
  { value: "nukus", label: "Nukus"},
  { value: "fergana", label: "Fergana"},
  { value: "namangan", label: "Namangan"},
  { value: "andijan", label: "Andijan"},
  { value: "termez", label: "Termez"},
  { value: "qarshi", label: "Qarshi"},
  { value: "guliston", label: "Guliston"},
];

const SupportForm = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selectRef = useRef();
  const dropdownRef = useRef();
  const searchInputRef = useRef();
  const listRef = useRef();
  const toast = useToast();

  useOutsideClick({
    ref: selectRef,
    handler: onClose,
  });

  const selectedCity = cities.find((c) => c.value === form.city);

  // Filter cities based on search
  const filteredCities = cities.filter((city) =>
    city.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Smart positioning for dropdown
  useEffect(() => {
    if (isOpen && selectRef.current) {
      const selectRect = selectRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - selectRect.bottom;
      const spaceAbove = selectRect.top;
      const dropdownHeight = 300; // Approximate dropdown height

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < filteredCities.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev > 0 ? prev - 1 : filteredCities.length - 1
        );
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        handleCitySelect(filteredCities[highlightedIndex].value);
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, filteredCities]);

  // Auto-focus search when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phone") {
        newValue = value.replace(/\D/g, "").slice(0, 9);
    }

    setForm((prev) => ({
        ...prev,
        [name]: newValue,
    }));

    if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
    }
    };

  const handleCitySelect = (selectedValue) => {
    setForm((prev) => ({
      ...prev,
      city: selectedValue,
    }));
    setSearchTerm("");
    setHighlightedIndex(-1);
    onClose();
    setErrors((prev) => ({ ...prev, city: null }));
  };

  const handleDropdownToggle = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Имя обязательно";
    if (!form.phone.trim()) newErrors.phone = "Номер телефона обязателен";
    if (!form.city) newErrors.city = "Выберите город";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        setIsSubmitting(false);
        toast({
          title: "Заявка отправлена!",
          description: "Мы свяжемся с вами в ближайшее время.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setForm({ name: "", phone: "", city: "" });
      }, 2000);
    }
  };

  return (
    <Box minH="80vh" bg="gray.50" py={{base: "100px", md: "60px"}}>
      <Container p={4} maxW="100%">
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={12}
          align={{base: 'center', lg: "flex-start"}}
          justifyContent={'space-between'}
        >
          {/* Left Section */}
          <Box flex="1" w={{base: "100%", lg: "50%"}}>
            <VStack spacing={6} align={{base: "center", md: "start"}}>
              <Text
                fontSize={{ base: "28px", md: "38px", lg: "48px" }}
                fontWeight="bold"
                lineHeight="1.2"
                color="gray.900"
              >
                Поможем в выборе!
              </Text>
              
              <VStack spacing={4} align={"start"} color="gray.600" fontSize="16px" lineHeight="1.6">
                <Text textAlign={{base: 'center', md: "left"}}>
                  Если у вас остались вопросы или вы не знаете, что выбрать, обратитесь в наш отдел продаж или оставьте заявку.
                </Text>
                <Text textAlign={{base: 'center', md: "left"}}>
                  По вопросам объявлений и личного кабинета просим обращаться в службу заботы о пользователях.
                </Text>
              </VStack>

              <Box display={'flex'} gap={3} align={"center"} justifyContent={{base: 'center', md: "left"}} w={"100%"} fontSize="16px" color="gray.700" flexWrap="wrap">
                <Text fontWeight="medium" as={"a"} href="tel:+998947144403" p={2} bg={"orange.100"} borderRadius={'lg'}>+998 94 7144403</Text>
                <Text as={"a"} href="mailto:info@tservice.kz" p={2} bg={"orange.100"} borderRadius={'lg'}>info@tservice.kz</Text>
              </Box>
              <Text color="gray.600">Toshkent, Chilonzor 20D</Text>
            </VStack>
          </Box>

          {/* Form Section */}
          <Box
            bg="white"
            borderRadius="16px"
            p={8}
            boxShadow="0 4px 20px rgba(0,0,0,0.08)"
            w={{base: "100%", lg: "50%"}}
            border="1px solid"
            borderColor="gray.100"
          >
            <VStack spacing={6} as="form" onSubmit={handleSubmit}>
              {/* Name Input */}
              <FormControl isRequired>
                <FormLabel fontSize="14px" fontWeight="500" color="gray.700" mb={2}>
                  Имя
                </FormLabel>
                <Input
                  placeholder="Введите ваше имя"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  bg="gray.50"
                  border="1px solid"
                  borderColor={errors.name ? "red.300" : "gray.200"}
                  borderRadius="8px"
                  h="48px"
                  fontSize="16px"
                  _hover={{ borderColor: errors.name ? "red.400" : "gray.300" }}
                  _focus={{ 
                    borderColor: errors.name ? "red.500" : "blue.400", 
                    bg: "white",
                    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)"
                  }}
                  transition="all 0.2s"
                />
                {errors.name && (
                  <Text color="red.500" fontSize="12px" mt={1}>
                    {errors.name}
                  </Text>
                )}
              </FormControl>

              {/* Phone Input */}
              <FormControl isRequired>
                <FormLabel fontSize="14px" fontWeight="500" color="gray.700" mb={2}>
                  Номер телефона
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon
                    bg="gray.100"
                    border="1px solid"
                    borderColor={errors.phone ? "red.300" : "gray.200"}
                    borderRadius="8px 0 0 8px"
                    h="48px"
                    children="+998"
                    fontSize="16px"
                    color="gray.700"
                    pointerEvents={"none"}
                  />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="90 123 45 67"
                    value={form.phone}
                    onChange={handleInputChange}
                    bg="gray.50"
                    border="1px solid"
                    borderColor={errors.phone ? "red.300" : "gray.200"}
                    borderRadius="0 8px 8px 0"
                    borderLeft="none"
                    h="48px"
                    fontSize="16px"
                    _hover={{ borderColor: errors.phone ? "red.400" : "gray.300" }}
                    _focus={{ 
                      borderColor: errors.phone ? "red.500" : "blue.400", 
                      bg: "white",
                      boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)"
                    }}
                    onKeyDown={(e) => {
                      const allowed = /^[0-9\s]$/;
                      if (!allowed.test(e.key) && e.key !== "Backspace" && e.key !== "Tab" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                        e.preventDefault();
                      }
                    }}
                    transition="all 0.2s"
                  />
                </InputGroup>
                {errors.phone && (
                  <Text color="red.500" fontSize="12px" mt={1}>
                    {errors.phone}
                  </Text>
                )}
              </FormControl>

              {/* City Select with Smart Positioning */}
              <FormControl isRequired>
                <FormLabel fontSize="14px" fontWeight="500" color="gray.700" mb={2}>
                  Город
                  <Text as="span" fontSize="12px" color="gray.500" ml={2}>
                    {isOpen && "(используйте ↑↓ для навигации, Enter для выбора)"}
                  </Text>
                </FormLabel>
                <Box position="relative" ref={selectRef}>
                  <Box
                    display="flex"
                    alignItems="center"
                    bg="gray.50"
                    border="1px solid"
                    borderColor={errors.city ? "red.300" : isOpen ? "blue.400" : "gray.200"}
                    borderRadius="8px"
                    px={4}
                    py={3}
                    cursor="pointer"
                    onClick={handleDropdownToggle}
                    _hover={{ 
                      borderColor: errors.city ? "red.400" : "gray.300",
                      bg: "gray.100"
                    }}
                    h="48px"
                    userSelect="none"
                    transition="all 0.2s"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleDropdownToggle();
                      }
                    }}
                  >
                    <Icon as={FaMapMarkerAlt} color="gray.400" mr={3} />
                    <Box flex={1} color={selectedCity ? "gray.900" : "gray.500"}>
                      {selectedCity ? (
                        <Text fontSize="16px">{selectedCity.label}</Text>
                      ) : (
                        <Text fontSize="16px">Выберите город</Text>
                      )}
                    </Box>
                    <Icon 
                      as={FaChevronDown} 
                      color="gray.400" 
                      transition="transform 0.2s" 
                      transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"} 
                    />
                  </Box>
                  
                  {errors.city && (
                    <Text color="red.500" fontSize="12px" mt={1}>
                      {errors.city}
                    </Text>
                  )}
                  
                  {isOpen && (
                    <Box
                      ref={dropdownRef}
                      position="absolute"
                      {...(dropdownPosition === "top" 
                        ? { bottom: "100%", mb: 2 } 
                        : { top: "100%", mt: 2 }
                      )}
                      left={0}
                      right={0}
                      bg="white"
                      border="1px solid"
                      borderColor="blue.200"
                      borderRadius="8px"
                      boxShadow="0 8px 25px rgba(0,0,0,0.15)"
                      zIndex={1000}
                      maxH="300px"
                      overflow="hidden"
                    >
                      {/* Search Header */}
                      <Box p={3} borderBottom="1px solid" borderColor="gray.100" bg="gray.50">
                        <HStack spacing={2} mb={2}>
                          <Icon as={FaSearch} color="gray.400" fontSize="14px" />
                          <Text fontSize="12px" color="gray.600" fontWeight="500">
                            Поиск города
                          </Text>
                          <Box ml="auto">
                            <Kbd fontSize="10px">Esc</Kbd>
                          </Box>
                        </HStack>
                        <Box position="relative">
                          <Input
                            ref={searchInputRef}
                            placeholder="Начните вводить название..."
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setHighlightedIndex(-1);
                            }}
                            h="36px"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="6px"
                            fontSize="14px"
                            _focus={{ borderColor: "blue.400", boxShadow: "none" }}
                            autoComplete="off"
                            bg="white"
                          />
                        </Box>
                      </Box>

                      {/* Cities List */}
                      <List ref={listRef} maxH="180px" overflowY="auto">
                        {filteredCities.length > 0 ? (
                          filteredCities.map((cityOption, index) => (
                            <ListItem
                              key={cityOption.value}
                              px={4}
                              py={3}
                              cursor="pointer"
                              bg={
                                highlightedIndex === index 
                                  ? "blue.100" 
                                  : form.city === cityOption.value 
                                    ? "blue.50" 
                                    : "transparent"
                              }
                              color={
                                highlightedIndex === index
                                  ? "blue.700"
                                  : form.city === cityOption.value 
                                    ? "blue.400" 
                                    : "gray.900"
                              }
                              fontWeight={
                                form.city === cityOption.value || highlightedIndex === index
                                  ? "500" 
                                  : "normal"
                              }
                              onClick={() => handleCitySelect(cityOption.value)}
                              fontSize="15px"
                              transition="all 0.15s"
                              onMouseEnter={() => setHighlightedIndex(index)}
                              borderLeft={
                                form.city === cityOption.value || highlightedIndex === index
                                  ? "3px solid"
                                  : "3px solid transparent"
                              }
                              borderColor="blue.400"
                            >
                              <Text>{cityOption.label}</Text>
                            </ListItem>
                          ))
                        ) : (
                          <ListItem px={4} py={8} color="gray.500" textAlign="center">
                            <VStack spacing={2}>
                              <Text fontSize="24px">🔍</Text>
                              <Text fontSize="14px">Город не найден</Text>
                              <Text fontSize="12px" color="gray.400">
                                Попробуйте изменить запрос
                              </Text>
                            </VStack>
                          </ListItem>
                        )}
                      </List>
                    </Box>
                  )}
                </Box>
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                bg="#FFD700"
                color="black"
                w="100%"
                h="48px"
                borderRadius="8px"
                fontWeight="600"
                fontSize="16px"
                isLoading={isSubmitting}
                loadingText="Отправляем..."
                _hover={{
                  bg: "#FFC700",
                  transform: "translateY(-1px)",
                }}
                _active={{
                  transform: "translateY(0px)",
                }}
                transition="all 0.2s"
              >
                Отправить заявку
              </Button>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default SupportForm;