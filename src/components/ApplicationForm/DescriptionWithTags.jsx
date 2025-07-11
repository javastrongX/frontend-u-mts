import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  VStack,
  Text,
  Textarea,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  useColorModeValue
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const DescriptionWithTags = ({ 
  selectedTab,
  value, 
  onChange, 
  placeholder, 
  hasError, 
  fieldName,
  fieldRefs,
  getInputStyles,
  ...textareaProps 
}) => {
  const { t } = useTranslation();
  const [selectedTags, setSelectedTags] = useState([]);

  const tagBg = useColorModeValue("gray.100", "gray.700");
  const tagHoverBg = useColorModeValue("blue.50", "blue.800");
  const tagActiveBg = useColorModeValue("blue.100", "blue.700");
  const selectedTagBg = useColorModeValue("blue.500", "blue.600");

  const tagsByTab = useMemo(() => ({
    driver: [
      "cashless_payment", 
      "ready_to_work", 
      "works_on_holidays", 
      "full_documentation"
    ],
    repair: [
      "cashless_payment", 
      "ready_to_work", 
      "works_on_holidays", 
      "hotline", 
      "full_documentation"
    ],
    parts: [
      "same_day_delivery", 
      "free_delivery", 
      "cashless_payment", 
      "no_middleman", 
      "seasonal_discounts", 
      "ordered_day_delivery", 
      "wide_selection", 
      "original_parts", 
      "new_parts", 
      "used_parts", 
      "incash_parts", 
      "parts_on_order", 
      "sale", 
      "credit", 
      "on_order", 
      "in_cash", 
      "installmentInstallment_payment", 
      "delivery_help", 
      "installment_payment", 
      "warranty", 
      "factory_warranty", 
      "parts_warehouse", 
      "delivery_uz", 
      "full_documentation"
    ],
    rent: [
      "with_operator", 
      "without_operator", 
      "fuel_included", 
      "fuel_extra", 
      "long_term_rent", 
      "short_term_rent", 
      "customer_delivery", 
      "low_hours_machine", 
      "available_now", 
      "experienced_crew", 
      "cashless_payment", 
      "owner", 
      "ready_to_work", 
      "no_middleman", 
      "works_on_holidays", 
      "long_term_discount", 
      "good_condition", 
      "engine_ok", 
      "price_with_vat", 
      "price_without_vat", 
      "full_documentation", 
      "qualified_operator", 
      "official_service"
    ],
    purchase: [
      "same_day_delivery", 
      "report_documents", 
      "with_operator", 
      "without_operator", 
      "low_hours_machine", 
      "cashless_payment", 
      "owner", 
      "ready_to_work", 
      "no_middleman", 
      "seasonal_discounts", 
      "wide_selection", 
      "original_parts", 
      "good_condition", 
      "engine_ok", 
      "price_with_vat", 
      "price_without_vat", 
      "on_order", 
      "in_cash", 
      "installment_payment", 
      "delivery_help", 
      "free_delivery", 
      "no_expenditure_needed", 
      "official_service", 
      "ready_to_use", 
      "leasing_available", 
      "installmentInstallment_payment", 
      "warranty", 
      "factory_warranty", 
      "support_service_team", 
      "free_training", 
      "delivery_uz", 
      "full_equipment", 
      "full_documentation"
    ]
  }), []);

  const predefinedTags = useMemo(() => 
    tagsByTab[selectedTab] || [], 
    [selectedTab, tagsByTab]
  );

  const translatedTags = useMemo(() => 
    predefinedTags.map(key => t(`DescriptionwithTags.${selectedTab}.${key}`)),
    [predefinedTags, t]
  );

  // Memoized function to parse tags from value
  const parseTagsFromValue = useCallback((value) => {
    if (!value) return [];
    return value.split(',').map(tag => tag.trim()).filter(tag => tag);
  }, []);

  // Update selected tags when value or translatedTags change
  useEffect(() => {
    const valueTags = parseTagsFromValue(value);
    const matchingTags = translatedTags.filter(label => valueTags.includes(label));
    
    // Only update if there's a difference to prevent infinite re-renders
    setSelectedTags(prevTags => {
      const isSame = prevTags.length === matchingTags.length && 
                   prevTags.every(tag => matchingTags.includes(tag));
      return isSame ? prevTags : matchingTags;
    });
  }, [value, translatedTags, parseTagsFromValue]);

  const handleTagClick = useCallback((tagLabel) => {
    const isSelected = selectedTags.includes(tagLabel);
    
    if (isSelected) {
      // Remove tag
      const newSelectedTags = selectedTags.filter(tag => tag !== tagLabel);
      setSelectedTags(newSelectedTags);
      
      const currentTags = parseTagsFromValue(value);
      const filteredTags = currentTags.filter(tag => tag !== tagLabel);
      const newValue = filteredTags.join(', ');
      onChange(newValue);
    } else {
      // Add tag
      const newSelectedTags = [...selectedTags, tagLabel];
      setSelectedTags(newSelectedTags);
      
      const newValue = value ? (value.trim() + ', ' + tagLabel) : tagLabel;
      onChange(newValue);
    }
  }, [selectedTags, value, onChange, parseTagsFromValue]);

  const handleTextareaChange = useCallback((e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Update selected tags based on textarea content
    const valueTags = parseTagsFromValue(newValue);
    const matchingTags = translatedTags.filter(label => valueTags.includes(label));
    setSelectedTags(matchingTags);
  }, [onChange, parseTagsFromValue, translatedTags]);

  return (
    <VStack spacing={4} align="stretch">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={handleTextareaChange}
        {...textareaProps}
        {...getInputStyles(fieldName)}
      />

      <Box>
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="medium"
          color="gray.600"
          mb={3}
        >
          {t("DescriptionwithTags.quick_tags", "Быстрые теги (нажмите для добавления/удаления):")}
        </Text>

        <Wrap spacing={2}>
          {translatedTags.map((tagLabel, index) => {
            const isSelected = selectedTags.includes(tagLabel);
            return (
              <WrapItem key={`${selectedTab}-${index}`}>
                <Tag
                  size={{ base: "sm", md: "md" }}
                  bg={isSelected ? selectedTagBg : tagBg}
                  color={isSelected ? "white" : "gray.700"}
                  borderRadius="full"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    bg: isSelected ? selectedTagBg : tagHoverBg,
                    borderColor: "blue.300",
                    transform: "translateY(-1px)",
                    boxShadow: "sm"
                  }}
                  _active={{
                    bg: isSelected ? selectedTagBg : tagActiveBg,
                    transform: "translateY(0)"
                  }}
                  onClick={() => handleTagClick(tagLabel)}
                  border="1px solid"
                  borderColor={isSelected ? "blue.500" : "gray.200"}
                  boxShadow={isSelected ? "md" : "none"}
                >
                  <TagLabel fontSize={{ base: "xs", md: "sm" }}>
                    {tagLabel}
                  </TagLabel>
                </Tag>
              </WrapItem>
            );
          })}
        </Wrap>
      </Box>
    </VStack>
  );
};

export default DescriptionWithTags;