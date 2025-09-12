import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Icon,
  HStack,
  VStack,
  useColorModeValue,
  Flex,
  Badge,
  Portal
} from '@chakra-ui/react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

const SelectableCurrency = ({ 
  defaultCurrency, 
  onCurrencyChange,
  size = 'md',
  variant = 'outline',
  CURRENCIES = []
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);

  // Memoized selected currency object
  const currentCurrency = useMemo(() => 
    CURRENCIES.find(currency => currency.id === selectedCurrency),
    [selectedCurrency]
  );

  // Optimized change handler
  const handleCurrencyChange = useCallback((currencyId) => {
    setSelectedCurrency(currencyId);
    onCurrencyChange?.(currencyId);
  }, [onCurrencyChange]);

  // Theme colors
  const menuBg = useColorModeValue('white', 'gray.800');
  const menuBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');

  return (
    <Box>
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              border={'none'}
              colorScheme='black'
              as={Button}
              rightIcon={
                <Icon 
                  as={FaChevronDown} 
                  transition="transform 0.2s"
                  transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                />
              }
              variant={variant}
              size={size}
              _active={{
                transform: 'translateY(0px)',
              }}
              transition="all 0.2s"
            >
              <HStack spacing={2}>
                <Text fontSize="lg">{currentCurrency?.flag}</Text>
                <VStack spacing={0} align="start">
                  <Text fontWeight="semibold" fontSize="sm">
                    {currentCurrency?.code}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {currentCurrency?.symbol}
                  </Text>
                </VStack>
              </HStack>
            </MenuButton>
            <Portal>
                <MenuList
                bg={menuBg}
                borderColor={menuBorder}
                boxShadow="xl"
                minW="250px"
                py={2}
                >
                {CURRENCIES.map((currency) => {
                    const isSelected = currency.id === selectedCurrency;
                    
                    return (
                    <MenuItem
                        key={currency.id}
                        onClick={() => handleCurrencyChange(currency.id)}
                        bg={isSelected ? selectedBg : 'transparent'}
                        _hover={{
                        bg: isSelected ? selectedBg : hoverBg,
                        transform: 'translateX(4px)',
                        }}
                        _focus={{
                        bg: isSelected ? selectedBg : hoverBg,
                        }}
                        transition="all 0.2s"
                        position="relative"
                    >
                        <Flex align="center" justify="space-between" width="100%">
                        <HStack spacing={3}>
                            <Text fontSize="xl">{currency.flag}</Text>
                            <VStack spacing={0} align="start">
                            <HStack>
                                <Text fontWeight="semibold">
                                {currency.code}
                                </Text>
                                <Badge 
                                colorScheme={currency.color} 
                                size="sm"
                                variant="subtle"
                                borderRadius={'md'}
                                >
                                {currency.symbol}
                                </Badge>
                            </HStack>
                            <Text fontSize="sm" color="gray.500">
                                {currency.name}
                            </Text>
                            </VStack>
                        </HStack>
                        
                        {isSelected && (
                            <Icon 
                            as={FaCheck} 
                            color="blue.500"
                            w={4} 
                            h={4}
                            />
                        )}
                        </Flex>
                    </MenuItem>
                    );
                })}
                </MenuList>
                
            </Portal>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default SelectableCurrency