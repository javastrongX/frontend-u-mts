import React, { useState, useCallback, useRef } from "react";
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  Text,
  SimpleGrid,
  FormControl,
  FormLabel,
  Collapse,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FiSearch, FiRotateCcw, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";

// Constants
const CATEGORIES = ["Logistika", "Transport", "Kuryer"];
const CITIES = ["Toshkent", "Samarqand", "Buxoro", "Andijon"];
const TRANSPORT_TYPES = ["Yuk mashinasi", "Avtomobil", "Mototsikl"];
const BRANDS = ["Kamaz", "Chevrolet", "Honda", "Isuzu", "Daewoo"];
const MODELS = ["5320", "Lacetti", "CB150", "NPR", "Nexia"];

// Debounce hook
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef();
  
  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

// Optimized number formatting
const formatInputNumber = (value) => {
  if (!value || value === '') return '';
  const cleaned = value.replace(/\D/g, '');
  if (!cleaned) return '';
  const number = parseInt(cleaned, 10);
  if (isNaN(number) || number < 0) return '0';
  if (number > 999999999) return '999,999,999';
  return number.toLocaleString('uz-UZ');
};

// Memoized dropdown component
const FilterDropdown = React.memo(({ label, value, placeholder, options, onChange }) => (
  <FormControl>
    <FormLabel fontSize="sm" color="gray.600" fontWeight="medium">
      {label}
    </FormLabel>
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<FiChevronDown />}
        borderRadius="xl"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        textAlign="left"
        w="full"
        h="12"
        px={4}
        fontWeight="normal"
        color={value ? "gray.900" : "gray.500"}
        _hover={{ 
          bg: 'gray.50',
          borderColor: 'blue.300',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
        _active={{ 
          bg: 'gray.100',
          transform: 'translateY(0)'
        }}
        _focus={{
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
          borderColor: 'blue.400'
        }}
        transition="all 0.2s ease"
      >
        <Text isTruncated>{value || placeholder}</Text>
      </MenuButton>
      <MenuList
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="0 10px 40px rgba(0,0,0,0.1)"
        py={2}
        maxH="250px"
        overflowY="auto"
      >
        {options.map((option) => (
          <MenuItem 
            key={option} 
            onClick={() => onChange(option)}
            borderRadius="lg"
            my={1}
            _hover={{ bg: 'orange.50' }}
            _focus={{ bg: 'orange.50' }}
          >
            {option}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  </FormControl>
));

// Memoized price input component
const PriceInput = React.memo(({ label, value, placeholder, onChange }) => (
  <FormControl>
    <FormLabel fontSize="sm" color="gray.600" fontWeight="medium">
      {label}
    </FormLabel>
    <InputGroup>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const formatted = formatInputNumber(e.target.value);
          onChange(formatted);
        }}
        borderRadius="xl"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        h="12"
        _hover={{ 
          borderColor: 'blue.300',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
        _focus={{
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
          borderColor: 'blue.400',
          transform: 'translateY(-1px)'
        }}
        transition="all 0.2s ease"
      />
      <InputRightElement h="12" pr={3} pointerEvents="none">
        <Text fontSize="sm" color="gray.500">сум</Text>
      </InputRightElement>
    </InputGroup>
  </FormControl>
));

const OrdersFilter = React.memo(({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCity,
  onCityChange,
  selectedTransport,
  onTransportChange,
  selectedBrand,
  onBrandChange,
  selectedModel,
  onModelChange,
  priceFrom,
  onPriceFromChange,
  priceTo,
  onPriceToChange,
  onClearFilters
}) => {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Debounced search to prevent excessive filtering
  const debouncedSearch = useDebounce(onSearchChange, 300);
  
  const forCollapse = useBreakpointValue({
    base: true,
    custom900: false
  }, {
    fallback: 'base',
    ssr: false
  });

  const handleSearchChange = useCallback((e) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  const handleClearFilters = useCallback(() => {
    onClearFilters();
    setFiltersOpen(false);
  }, [onClearFilters]);

  return (
    <Card borderRadius="xl" shadow="sm" overflow="visible">
      <CardBody p={{base: 2, custom570: 4}} py={{base: 6, custom570: 4}}>
        <VStack spacing={4}>
          {/* Search */}
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder={t("MyOrder.orders.searchPlaceholder", "Поиск по заголовку или категории...")}
              defaultValue={searchTerm}
              onChange={handleSearchChange}
              borderRadius="xl"
              bg="gray.50"
              border="1px"
              borderColor="gray.300"
            />
          </InputGroup>
          
          {forCollapse && (
            <HStack justify="end" w="100%">
              <Button
                onClick={() => setFiltersOpen(!filtersOpen)}
                size="sm"
                variant="ghost"
                borderRadius="xl"
                rightIcon={filtersOpen ? <FiChevronUp /> : <FiChevronDown />}
                color="gray.600"
              >
                {filtersOpen 
                  ? t("MyOrder.orders.closeFilters", "Скрыть фильтры") 
                  : t("MyOrder.orders.extraFilters", "Показать фильтры")
                }
              </Button>
            </HStack>
          )}

          <Collapse in={forCollapse ? filtersOpen : true} animateOpacity style={{ width: "100%", overflow: "visible" }}>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
              spacing={4}
              w="100%"
            >
              <FilterDropdown
                label={t("MyOrder.orders.category", "Категория")}
                value={selectedCategory}
                placeholder={t("MyOrder.orders.selectCategory", "Выберите категорию")}
                options={CATEGORIES}
                onChange={onCategoryChange}
              />

              <FilterDropdown
                label={t("MyOrder.orders.city", "Город")}
                value={selectedCity}
                placeholder={t("MyOrder.orders.selectCity", "Выберите город")}
                options={CITIES}
                onChange={onCityChange}
              />

              <FilterDropdown
                label={t("MyOrder.orders.transportType", "Тип транспорта")}
                value={selectedTransport}
                placeholder={t("MyOrder.orders.selectTransport", "Выберите тип транспорта")}
                options={TRANSPORT_TYPES}
                onChange={onTransportChange}
              />

              <FilterDropdown
                label={t("MyOrder.orders.brand", "Марка")}
                value={selectedBrand}
                placeholder={t("MyOrder.orders.selectBrand", "Выберите марку")}
                options={BRANDS}
                onChange={onBrandChange}
              />

              <FilterDropdown
                label={t("MyOrder.orders.model", "Модель")}
                value={selectedModel}
                placeholder={t("MyOrder.orders.selectModel", "Выберите модель")}
                options={MODELS}
                onChange={onModelChange}
              />

              <PriceInput
                label={t("MyOrder.orders.priceFrom", "Цена от")}
                value={priceFrom}
                placeholder="0"
                onChange={onPriceFromChange}
              />

              <PriceInput
                label={t("MyOrder.orders.priceTo", "Цена до")}
                value={priceTo}
                placeholder="999,999,999"
                onChange={onPriceToChange}
              />
            </SimpleGrid>

            <HStack w="100%" justify="end" mt={6}>
              <Button
                leftIcon={<FiRotateCcw />}
                variant="ghost"
                size="md"
                onClick={handleClearFilters}
                borderRadius="xl"
                color="gray.600"
                px={6}
                _hover={{ 
                  bg: 'gray.100',
                  color: 'gray.700',
                  transform: 'translateY(-1px)'
                }}
                _active={{ transform: 'translateY(0)' }}
                transition="all 0.2s ease"
              >
                {t("MyOrder.orders.clearFilters", "Фильтры очистить")}
              </Button>
            </HStack>
          </Collapse>
        </VStack>
      </CardBody>
    </Card>
  );
});

OrdersFilter.displayName = 'OrdersFilter';

export default OrdersFilter;