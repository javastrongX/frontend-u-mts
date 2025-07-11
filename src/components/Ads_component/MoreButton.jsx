import React, { useState, useMemo } from 'react';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Input,
  Box,
  Text,
  Checkbox
} from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const MoreButton = ({ items, category, label, selectedFilters, onToggle }) => {
  const [localSearch, setLocalSearch] = useState("");

  // Safe check for items and hidden array
  if (!items || !items.hidden || !Array.isArray(items.hidden) || items.hidden.length === 0) {
    return null; // Don't render if no hidden items
  }

  const { t } = useTranslation();

  // Safe check for selectedFilters - provide fallback empty array
  const categorySelectedFilters = selectedFilters?.[category] || [];

  // Filter qilingan elementlar
  const filteredItems = useMemo(() =>
    items.hidden.filter(item =>
      item.toLowerCase().includes(localSearch.toLowerCase())
    ),
    [items.hidden, localSearch]
  );

  // Harf bo'yicha guruhlash
  const groupedItems = useMemo(() =>
    filteredItems.reduce((groups, item) => {
      const firstLetter = item[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(item);
      return groups;
    }, {}),
    [filteredItems]
  );

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button
          size="sm"
          variant="outline"
          rightIcon={<FaChevronDown />}
          colorScheme="blue"
          color="blue.400"
          fontSize="sm"
          fontWeight="500"
          borderColor="gray.300"
          bg="white"
          _hover={{ borderColor: "blue.400" }}
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent w="400px" maxH="400px" overflowY="auto" zIndex="999">
        <PopoverBody p={4}>
          <VStack align="stretch" spacing={3}>
            {/* Search input */}
            <Input
              placeholder={t("Orderform.form.searchableselect.input_placeholder", "Поиск...")}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              size="sm"
            />
            
            {/* Harflarga bo'lib chiqarish */}
            {Object.keys(groupedItems).length > 0 ? (
              Object.keys(groupedItems).sort().map(letter => (
                <Box key={letter}>
                  <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.600">
                    {letter}
                  </Text>
                  <VStack align="stretch" spacing={1}>
                    {groupedItems[letter].map(item => (
                      <Checkbox
                        key={item}
                        isChecked={categorySelectedFilters.includes(item)}
                        onChange={() => onToggle(category, item)}
                        size="sm"
                        sx={{
                          '.chakra-checkbox__control': {
                            _checked: {
                              bg: 'orange.300',
                              borderColor: 'orange.400',
                              color: 'white',
                            },
                          },
                        }}
                      >
                        <Text fontSize="sm" color="blue.400">
                          {item}
                        </Text>
                      </Checkbox>
                    ))}
                  </VStack>
                </Box>
              ))
            ) : (
              <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
                {t("Orderform.form.searchableselect.not_found", "Ничего не найдено")}
              </Text>
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default MoreButton;