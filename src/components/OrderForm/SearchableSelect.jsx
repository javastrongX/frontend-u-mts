import { Box, Input, InputGroup, InputLeftElement, 
  Menu, MenuButton, MenuItem, MenuList, Portal, Text, 
  useDisclosure, Checkbox, Flex, Tag, TagLabel, 
  TagCloseButton, Wrap, WrapItem, useBreakpointValue } from "@chakra-ui/react";
import { useState, useId } from "react";
import { useTranslation } from "react-i18next";
import { FiChevronDown, FiSearch } from "react-icons/fi";

// Custom Searchable Select Component
export const SearchableSelect = ({
  placeholder,
  value,
  onChange,
  options = [],
  size = "md",
  borderRadius = "md",
  bg = "white",
  border = "1px solid",
  borderColor = "gray.200",
  fontSize = "md",
  _focus = {},
  _hover = {},
  transition = "all 0.2s",
  multipleSelect = false,
  isInvalid = false,
  isDisabled = false,
  id,
  name,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen: menuIsOpen, onOpen, onClose } = useDisclosure();
  
  // Unique ID va name yaratish
  const generatedId = useId();
  const inputId = id || generatedId;
  const inputName = name || `searchable-select-${generatedId}`;
  const searchInputId = `${inputId}-search`;
  const menuId = `${inputId}-menu`;

  const displayCount = useBreakpointValue({ base: 3, md: 5, lg: 7 });
  
  // Options mavjudligini tekshirish
  const filteredOptions = (options || []).filter(option =>
    option.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSingleSelect = (option) => {
    if (isDisabled) return;
    onChange(option.value);
    setSearchTerm('');
    onClose();
  };

  const handleMultipleSelect = (option) => {
    if (isDisabled) return;
    const currentValues = Array.isArray(value) ? value : [];
    const isSelected = currentValues.includes(option.value);
    
    if (isSelected) {
      onChange(currentValues.filter(v => v !== option.value));
    } else {
      onChange([...currentValues, option.value]);
    }
  };

  const handleRemoveTag = (valueToRemove) => {
    if (isDisabled) return;
    const currentValues = Array.isArray(value) ? value : [];
    onChange(currentValues.filter(v => v !== valueToRemove));
  };

  const getSelectedOptions = () => {
    if (multipleSelect) {
      const selectedValues = Array.isArray(value) ? value : [];
      return (options || []).filter(opt => selectedValues.includes(opt.value));
    } else {
      return (options || []).find(opt => opt.value === value);
    }
  };

  const getDisplayText = () => {
    if (multipleSelect) {
      const selectedOptions = getSelectedOptions();
      if (selectedOptions.length === 0) return '';
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${t('Orderform.form.searchableselect.selected', 'Выбрано')}: ${selectedOptions.length}`;
    } else {
      const selectedOption = getSelectedOptions();
      return selectedOption ? selectedOption.label : '';
    }
  };

  const selectedOptions = getSelectedOptions();
  const displayText = getDisplayText();

  // Validation va disabled holatlar uchun style
  const inputStyles = {
    borderColor: isInvalid ? "red.300" : borderColor,
    bg: isDisabled ? "gray.100" : bg,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.6 : 1,
    _focus: isDisabled ? {} : {
      borderColor: isInvalid ? "red.400" : "blue.400",
      boxShadow: `0 0 0 3px ${isInvalid ? "rgba(245, 101, 101, 0.1)" : "rgba(66, 153, 225, 0.1)"}`,
      ..._focus
    },
    _hover: isDisabled ? {} : {
      borderColor: isInvalid ? "red.300" : "gray.300",
      ..._hover
    }
  };

  return (
    <Menu 
      isOpen={menuIsOpen && !isDisabled} 
      onOpen={isDisabled ? undefined : onOpen} 
      onClose={onClose} 
      closeOnSelect={!multipleSelect}
    >
      <MenuButton
        as={Box}
        w="100%"
        cursor={isDisabled ? "not-allowed" : "pointer"}
        onClick={isDisabled ? undefined : onOpen}
      >
        <Box>
          <InputGroup>
            <Input
              id={inputId} // Unique ID
              name={inputName} // Form field name (avtomatik yaratilgan yoki berilgan)
              placeholder={displayText || placeholder}
              value={displayText}
              readOnly
              pl={4}
              pr={10}
              size={size}
              borderRadius={borderRadius}
              border={border}
              fontSize={fontSize}
              transition={transition}
              isDisabled={isDisabled}
              aria-expanded={menuIsOpen}
              aria-haspopup="listbox"
              role="combobox"
              {...inputStyles}
            />
            <InputLeftElement 
              pointerEvents="none" 
              right={2} 
              left="auto"
              zIndex={2}
            >
              <FiChevronDown 
                color={isDisabled ? "gray.400" : "gray.600"} 
                style={{
                  transform: menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
            </InputLeftElement>
          </InputGroup>
        </Box>
      </MenuButton>

      {multipleSelect && Array.isArray(selectedOptions) && selectedOptions.length > 0 && (
        <Wrap mt={2} spacing={1}>
          {selectedOptions.slice(0, displayCount).map((option) => (
            <WrapItem key={option.value}>
              <Tag
                size="sm"
                borderRadius="full"
                variant="solid"
                colorScheme="blue"
              >
                <TagLabel>{option.label}</TagLabel>
                {!isDisabled && (
                  <TagCloseButton
                    aria-label={`Remove ${option.label}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(option.value);
                    }}
                  />
                )}
              </Tag>
            </WrapItem>
          ))}

          {selectedOptions.length > displayCount && (
            <WrapItem>
              <Tag
                size="sm"
                borderRadius="full"
                variant="solid"
                colorScheme="gray"
                pointerEvents={'none'}
              >
                <TagLabel>+{selectedOptions.length - displayCount}</TagLabel>
              </Tag>
            </WrapItem>
          )}
        </Wrap>
      )}

      <Portal>
        <MenuList
          id={menuId} // Unique menu ID
          maxH="300px"
          overflowY="auto"
          w="full"
          minW="300px"
          zIndex={1000}
          bg="white"
          boxShadow="xl"
          border="2px solid"
          borderColor="gray.200"
          borderRadius="xl"
          maxW="500px"
          role="listbox"
        >
          <Box p={3} borderBottom="1px solid" borderColor="gray.100">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.400" />
              </InputLeftElement>
              <Input
                id={searchInputId} // Unique search input ID
                placeholder={t('Orderform.form.searchableselect.input_placeholder', 'Поиск...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="sm"
                borderRadius="lg"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                _focus={{ borderColor: 'blue.400' }}
                autoFocus
                aria-label="Search options"
              />
            </InputGroup>
          </Box>
          
          {filteredOptions.length === 0 ? (
            <Box p={4} textAlign="center" color="gray.500">
              <Text fontSize="sm">
                {searchTerm 
                  ? t('Orderform.form.searchableselect.not_found', 'Не найдено')
                  : t('Orderform.form.searchableselect.no_options', 'Нет вариантов')
                }
              </Text>
            </Box>
          ) : (
            filteredOptions.map((option, index) => {
              const isSelected = multipleSelect 
                ? Array.isArray(value) && value.includes(option.value)
                : value === option.value;
                
              return (
                <MenuItem
                  key={option.value}
                  id={`${inputId}-option-${index}`} // Unique option ID
                  onClick={() => multipleSelect 
                    ? handleMultipleSelect(option) 
                    : handleSingleSelect(option)
                  }
                  _hover={{ bg: 'blue.50' }}
                  _focus={{ bg: 'blue.50' }}
                  py={3}
                  fontSize="sm"
                  bg={isSelected ? 'blue.50' : 'transparent'}
                  fontWeight={isSelected ? 'medium' : 'normal'}
                  role="option"
                  aria-selected={isSelected}
                >
                  {multipleSelect ? (
                    <Flex align="center" w="100%">
                      <Checkbox
                        id={`${inputId}-checkbox-${index}`} // Unique checkbox ID
                        isChecked={isSelected}
                        mr={3}
                        colorScheme="blue"
                        pointerEvents="none"
                      />
                      <Text>{option.label}</Text>
                    </Flex>
                  ) : (
                    <Text>{option.label}</Text>
                  )}
                </MenuItem>
              );
            })
          )}
        </MenuList>
      </Portal>
    </Menu>
  );
};