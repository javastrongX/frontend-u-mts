import React, { useState, useRef } from "react";
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
  Select,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";

// Regionlar (siz so‘ragan flagli select uchun)
const countries = [
  { value: "kz", label: "Казахстан", flag: "🇰🇿" },
  { value: "uz", label: "Узбекистан", flag: "🇺🇿" },
  { value: "ru", label: "Россия", flag: "🇷🇺" },
  { value: "kg", label: "Кыргызстан", flag: "🇰🇬" },
  { value: "tj", label: "Таджикистан", flag: "🇹🇯" },
  { value: "tm", label: "Туркменистан", flag: "🇹🇲" },
  { value: "az", label: "Азербайджан", flag: "🇦🇿" },
  { value: "am", label: "Армения", flag: "🇦🇲" },
  { value: "ge", label: "Грузия", flag: "🇬🇪" },
  { value: "by", label: "Беларусь", flag: "🇧🇾" },
  { value: "ua", label: "Украина", flag: "🇺🇦" },
  { value: "tr", label: "Турция", flag: "🇹🇷" },
];

const ContactSection = () => {
  // Form holati
  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  // Country select uchun
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selectRef = useRef();
  const { t } = useTranslation();

  useOutsideClick({
    ref: selectRef,
    handler: onClose,
  });

  // Select uchun filtrlangan countrylar
  const filteredCountries = countries.filter((country) =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedCountry = countries.find((c) => c.value === form.country);

  const handleInputChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCountrySelect = (selectedValue) => {
    setForm((prev) => ({
      ...prev,
      country: selectedValue,
    }));
    setSearchTerm("");
    onClose();
    setErrors((prev) => ({ ...prev, country: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Oddiy validatsiya
    let newErrors = {};
    if (!form.name) newErrors.name = "Ism majburiy";
    if (!form.phone) newErrors.phone = "Telefon raqam majburiy";
    if (!form.country) newErrors.country = "Hudud tanlang";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Yuborish logikasi
      alert("So‘rovingiz yuborildi!");
      setForm({ name: "", phone: "", country: "" });
    }
  };

  return (
    <Box bg="orange.250" py={{ base: 8, custom900: 16 }} px={6}>
      <Flex
        maxW="75rem"
        mx="auto"
        align="center"
        justify="space-between"
        direction={{ base: "column", custom900: "row" }}
        gap={8}
      >
        {/* Chap blok */}
        <Box flex="1" ml={3} minW="260px">
          <Text fontWeight="bold" fontSize={{base: '24px', custom900: '40px'}} textAlign={{base: "center", custom900: "left"}} mb={4}>
            {t('contact_form.title')}
          </Text>
          <Text fontSize={{base: '14px', custom900: '16px'}} textAlign={{base: "center", custom900: "left"}} mb={2}>
            {t("contact_form.about_us_1")}
          </Text>
          <Text fontSize={{base: '14px', custom900: '16px'}} textAlign={{base: "center", custom900: "left"}} mb={4}>
            {t("contact_form.about_us_2")}
          </Text>
          <Box display="flex" justifyContent={{base: "space-between", md: 'center', custom900: "flex-start"}} flexDirection={{base: "row", custom900: "column"}} gap={2}>
            <Box
              as="a"
              href="tel:+998947144403"
              bg="black.90"
              maxW="170px"
              textAlign={"center"}
              p={"4px"}
              borderRadius="md"
              border="1px solid #ccc"
              _hover={{ bg: "gray.100" }}
              cursor="pointer"
              fontSize={{base: '14px', custom900: '16px'}}
            >
              +998 (94) 714-4403
            </Box>

            <Box
              as="a"
              href="mailto:info@tservice.kz"
              bg="black.90"
              maxW="150px"
              textAlign={"center"}
              p={"4px"}
              borderRadius="md"
              border="1px solid #ccc"
              _hover={{ bg: "gray.100" }}
              cursor="pointer"
              fontSize={{base: '14px', custom900: '16px'}}
            >
              info@tservice.uz
            </Box>
          </Box>
          <Text mt={2} textAlign={{base: "center", custom900: "left"}} fontWeight={{base: "bold", custom900: "medium"}}>
            {t("contact_form.adress")}
          </Text>
        </Box>

        {/* O'ng blok (forma) */}
        <Box
          bg="black.0"
          borderRadius="xl"
          p={8}
          boxShadow="md"
          maxW={{base: "400px", sm: "500px", md: "600px", custom900: "500px"}}
          w="100%"
        >
          <form onSubmit={handleSubmit}>
            <FormControl mb={4} isInvalid={!!errors.name} isRequired>
              <FormLabel>{t('contact_form.name')}</FormLabel>
              <Input
                placeholder={t('contact_form.write_name')}
                name="name"
                value={form.name}
                onChange={handleInputChange}
                bg="gray.50"
              />
              {errors.name && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.name}
                </Text>
              )}
            </FormControl>
            <FormControl mb={4} isInvalid={!!errors.phone} isRequired>
              <FormLabel>{t("contact_form.number_label")}</FormLabel>
              <InputGroup display={'flex'} alignItems={'center'}>
                <InputLeftAddon children="+998" />
                <Input
                  type="tel"
                  name="phone"
                  placeholder="901234567"
                  value={form.phone}
                  onChange={handleInputChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  bg="gray.50"
                  maxLength={9}
                  onKeyDown={(e) => {
                    const allowed = /^[0-9]$/;
                    if (!allowed.test(e.key) && e.key !== "Backspace" && e.key !== "Tab" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                      e.preventDefault();
                    }
                  }}
                  h="40px"
                  fontSize="md"
                />
              </InputGroup>
              {errors.phone && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.phone}
                </Text>
              )}
            </FormControl>

            {/* Country select */}
            <FormControl mb={6} isInvalid={!!errors.country} isRequired>
              <FormLabel>{t("contact_form.country")}</FormLabel>
              <Box position="relative" ref={selectRef}>
                <Box
                  display="flex"
                  alignItems="center"
                  bg="gray.50"
                  border="1px solid"
                  borderColor={errors.country ? "red.500" : "gray.200"}
                  borderRadius="md"
                  px={3}
                  py={2}
                  cursor="pointer"
                  onClick={onOpen}
                  _hover={{ bg: "gray.100" }}
                  minH="40px"
                  userSelect="none"
                >
                  <Box flex={1} color={selectedCountry ? "black" : "gray.500"}>
                    {selectedCountry ? (
                      <Box display="flex" alignItems="center" gap={2}>
                        <Text fontSize="lg" as="span">{selectedCountry.flag}</Text>
                        <Text as="span">{selectedCountry.label}</Text>
                      </Box>
                    ) : (
                      <Text as="span">{t("auth_register.select_country")}</Text>
                    )}
                  </Box>
                  <Icon as={FaChevronDown} color="gray.400" />
                </Box>
                {errors.country && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.country}
                  </Text>
                )}
                {isOpen && (
                  <Box
                    position="absolute"
                    top={{ base: "auto", custom900: "100%" }}
                    bottom={{ base: "100%", custom900: "auto" }}
                    left={0}
                    right={0}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    boxShadow="lg"
                    zIndex={1000}
                    maxH="250px"
                    overflow="hidden"
                  >
                    <Box p={2} borderBottom="1px solid" borderColor="gray.100">
                      <Box position="relative">
                        <Icon
                          as={FaSearch}
                          position="absolute"
                          left={3}
                          top="50%"
                          transform="translateY(-50%)"
                          color="gray.400"
                          fontSize="sm"
                        />
                        <Input
                          placeholder={t("auth_register.input_placeleholder")}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          pl={8}
                          size="sm"
                          border="1px solid"
                          borderColor="gray.200"
                          _focus={{ borderColor: "blue.1" }}
                          autoComplete="off"
                        />
                      </Box>
                    </Box>
                    <List maxH="180px" overflowY="auto">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((countryOption) => (
                          <ListItem
                            key={countryOption.value}
                            px={3}
                            py={2}
                            cursor="pointer"
                            _hover={{ bg: "gray.50" }}
                            bg={form.country === countryOption.value ? "blue.50" : "transparent"}
                            color={form.country === countryOption.value ? "blue.400" : "black"}
                            fontWeight={form.country === countryOption.value ? "500" : "normal"}
                            onClick={() => handleCountrySelect(countryOption.value)}
                            display="flex"
                            alignItems="center"
                            gap={2}
                          >
                            <Text fontSize="lg" as="span">{countryOption.flag}</Text>
                            <Text as="span">{countryOption.label}</Text>
                          </ListItem>
                        ))
                      ) : (
                        <ListItem px={3} py={4} color="gray.500" textAlign="center">
                          {t("auth_register.country_notFound")}
                        </ListItem>
                      )}
                    </List>
                  </Box>
                )}
              </Box>
            </FormControl>

            <Button
              type="submit"
              bg="orange.50"
              color="p.black"
              w="100%"
              fontWeight="bold"
              fontSize="md"
              _hover={{ border: "1px solid", borderColor: "yellow.50" }}
              _active={{
                transform: "translateY(1px)",
                boxShadow: "lg",
                bg: "orange.150",
              }}
            >
              {t("contact_form.request_btn")}
            </Button>
          </form>
        </Box>
      </Flex>
    </Box>
  );
};

export default ContactSection;
