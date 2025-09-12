
import { useState } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const SearchableSelect = ({
  placeholder = "Выберите опцию",
  value,
  onChange,
  options = [],
  size = "md",
  borderRadius = "md",
  disabled = false,
  isRequired = false,
  isInvalid = false,
  errorBorderColor = "red.500",
  focusBorderColor = "blue.500",
  searchPlaceholder = "Поиск...",
  noOptionsText = "Не найдено",
  maxHeight = "300px",
  minWidth = "300px",
  zIndex = 1000,
  colorScheme = "blue",
  // Chakra UI Input props
  bg,
  border,
  borderColor,
  fontSize,
  fontWeight,
  color,
  _hover,
  _focus,
  _disabled,
  _invalid,
  transition,
  ...restProps
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen: menuIsOpen, onOpen, onClose } = useDisclosure();
  
  // Qidirish filtri
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.searchKeys && option.searchKeys.some(key => 
      key.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );
  
  // Tanlangan option - value bo'sh bo'lsa ham topadi
  const selectedOption = options.find(opt => opt.value === value);
  
  // Option tanlash
  const handleSelect = (option) => {
    if (onChange) {
      onChange(option.value, option);
    }
    setSearchTerm('');
    onClose();
  };

  // Menu yopilganda qidiruvni tozalash
  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  // Focus colors
  const getFocusStyle = () => {
    if (isInvalid) {
      return {
        borderColor: errorBorderColor,
        boxShadow: `0 0 0 1px ${errorBorderColor}`
      };
    }
    
    const focusColors = {
      blue: { borderColor: 'blue.400', boxShadow: '0 0 0 1px #3182CE' },
      orange: { borderColor: 'orange.400', boxShadow: '0 0 0 1px #FF6B35' },
      green: { borderColor: 'green.400', boxShadow: '0 0 0 1px #38A169' },
      red: { borderColor: 'red.400', boxShadow: '0 0 0 1px #E53E3E' },
      purple: { borderColor: 'purple.400', boxShadow: '0 0 0 1px #805AD5' },
    };
    
    return focusColors[colorScheme] || focusColors.blue;
  };

  // Hover colors  
  const getHoverColor = () => {
    const hoverColors = {
      blue: 'blue.50',
      orange: 'orange.50', 
      green: 'green.50',
      red: 'red.50',
      purple: 'purple.50',
    };
    return hoverColors[colorScheme] || hoverColors.blue;
  };

  // Input da ko'rsatiladigan matn
  const getDisplayValue = () => {
    if (selectedOption) {
      return selectedOption.label;
    }
    return '';
  };
  const { t } = useTranslation();
  // Placeholder matnini belgilash
  const getPlaceholderText = () => {
    if (disabled && !selectedOption) {
      return t("TariffCarousel.selectCountryFirst", "Сначала выберите страну");
    }
    return placeholder;
  };

  return (
    <Menu 
      isOpen={menuIsOpen} 
      onOpen={disabled ? undefined : onOpen} 
      onClose={handleClose}
      closeOnSelect={false}
    >
      <MenuButton
        as={Box}
        w="100%"
        cursor={disabled ? "not-allowed" : "pointer"}
        opacity={disabled ? 0.6 : 1}
        onClick={disabled ? undefined : onOpen}
        {...restProps}
      >
        <InputGroup>
          <Input
            placeholder={getPlaceholderText()}
            value={getDisplayValue()}
            readOnly
            size={size}
            borderRadius={borderRadius}
            cursor={disabled ? "not-allowed" : "pointer"}
            focusBorderColor={focusBorderColor}
            isRequired={isRequired}
            isInvalid={isInvalid}
            bg={bg}
            border={border}
            borderColor={borderColor}
            fontSize={fontSize}
            fontWeight={fontWeight}
            color={selectedOption ? color : 'gray.400'} // Placeholder rang
            transition={transition}
            _hover={disabled ? {} : (_hover || {})}
            _focus={disabled ? {} : (_focus || getFocusStyle())}
            _disabled={_disabled}
            _invalid={_invalid}
            _placeholder={{
              color: 'gray.400'
            }}
          />
          <InputRightElement h={size === "lg" ? 10 : size === "sm" ? 8 : 9}>
            <FiChevronDown 
              color={disabled ? "gray.300" : "gray.400"} 
              style={{
                transform: menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}
            />
          </InputRightElement>
        </InputGroup>
      </MenuButton>
      
      {!disabled && (
        <Portal>
          <MenuList
            maxH={maxHeight}
            overflowY="auto"
            minW={minWidth}
            zIndex={zIndex}
            bg="white"
            boxShadow="xl"
            border="2px solid"
            borderColor="gray.200"
            borderRadius={borderRadius}
          >
            {/* Qidiruv input */}
            <Box p={3} borderBottom="1px solid" borderColor="gray.100">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="sm"
                  borderRadius="lg"
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  _focus={{ 
                    borderColor: `${colorScheme}.400`,
                    boxShadow: `0 0 0 1px var(--chakra-colors-${colorScheme}-400)`
                  }}
                  autoFocus
                />
              </InputGroup>
            </Box>
            
            {/* Options ro'yxati */}
            {filteredOptions.length === 0 ? (
              <Box p={4} textAlign="center" color="gray.500">
                <Text fontSize="sm">{noOptionsText}</Text>
              </Box>
            ) : (
              filteredOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  _hover={{ bg: getHoverColor() }}
                //   _focus={{ bg: getHoverColor() }}
                  py={3}
                  fontSize="sm"
                  bg={value === option.value ? getHoverColor() : 'transparent'}
                  fontWeight={value === option.value ? 'semibold' : 'normal'}
                >
                  {option.label}
                  {option.description && (
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {option.description}
                    </Text>
                  )}
                </MenuItem>
              ))
            )}
          </MenuList>
        </Portal>
      )}
    </Menu>
  );
};

// Export default ham qo'shish
export default SearchableSelect;