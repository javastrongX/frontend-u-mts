import React from 'react';
import {
  Box,
  Grid,
  Select,
  Input,
  Button,
  Flex,
} from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const CATEGORY_OPTIONS = ["Продажа спецтехники", "Аренда спецтехники", "Строительные услуги"];
const CITY_OPTIONS = ["Алматы", "Нур-Султан", "Шымкент", "Атырау"];

// Функция для форматирования числа с разделителями
const formatNumber = (num) => {
  if (!num) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Функция для удаления форматирования и получения чистого числа
const parseNumber = (str) => {
  if (!str) return '';
  return str.replace(/\s/g, '');
};

// Функция для обработки ввода только чисел
const handleNumericInput = (e) => {
  const value = e.target.value;
  // Разрешаем только цифры и пробелы
  const numericValue = value.replace(/[^\d\s]/g, '');
  return numericValue;
};

function FilterSection({ filters, onChange, onClear, onSearch }) {
  const { t } = useTranslation();
  // Обработчик изменения цены с форматированием
  const handlePriceChange = (field, value) => {
    const numericValue = handleNumericInput({ target: { value } });
    const cleanValue = parseNumber(numericValue);
    
    // Форматируем для отображения
    const formattedValue = formatNumber(cleanValue);
    
    // Сохраняем чистое значение для логики фильтрации
    onChange(field, cleanValue);
    
    // Обновляем отображаемое значение
    const input = document.querySelector(`input[data-field="${field}"]`);
    if (input) {
      input.value = formattedValue;
    }
  };

  // Обработчик нажатия клавиш для цены
  const handlePriceKeyDown = (e) => {
    // Разрешаем: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Разрешаем: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Разрешаем: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    // Запрещаем все, кроме цифр
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <Box
      bg="white"
      mb={4}
      borderLeftWidth="1px"
      borderRightWidth="1px"
      borderBottomWidth="1px"
      borderColor="gray.200"
      py={4}
      pt="30px"
      px={{ base: 3, md: 4 }}
      borderBottomRadius="lg"
      boxShadow="sm"
    >
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={4}>
        <Select
          placeholder={t('UserPage.category', "Категория")}
          value={filters.category || ""}
          onChange={e => onChange('category', e.target.value)}
          _focus={{ borderColor: "#fed500", boxShadow: "0 0 0 1px #fed500" }}
          borderColor="gray.300"
        >
          {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </Select>
        <Select
          placeholder={t('UserPage.city', "Город")}
          value={filters.city || ""}
          onChange={e => onChange('city', e.target.value)}
          _focus={{ borderColor: "#fed500", boxShadow: "0 0 0 1px #fed500" }}
          borderColor="gray.300"
        >
          {CITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </Select>
      </Grid>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={4}>
        <Input
          placeholder={t('UserPage.priceFrom', "Цена от")}
          data-field="priceFrom"
          defaultValue={formatNumber(filters.priceFrom)}
          onChange={e => handlePriceChange('priceFrom', e.target.value)}
          onKeyDown={handlePriceKeyDown}
          _focus={{ borderColor: "#fed500", boxShadow: "0 0 0 1px #fed500" }}
          borderColor="gray.300"
        />
        <Input
          placeholder={t('UserPage.priceTo', "Цена до")}
          data-field="priceTo"
          defaultValue={formatNumber(filters.priceTo)}
          onChange={e => handlePriceChange('priceTo', e.target.value)}
          onKeyDown={handlePriceKeyDown}
          _focus={{ borderColor: "#fed500", boxShadow: "0 0 0 1px #fed500" }}
          borderColor="gray.300"
        />
      </Grid>
      <Flex justify="flex-end" gap={2}>
        <Button
          leftIcon={<FiX />}
          colorScheme="gray"
          variant="ghost"
          size="sm"
          borderRadius="md"
          onClick={onClear}
        >
          {t('UserPage.reset', "Сбросить")}
        </Button>
      </Flex>
    </Box>
  );
}

export default FilterSection;