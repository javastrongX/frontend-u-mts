import { 
  Badge, 
  Box, 
  Card, 
  CardBody, 
  Heading, 
  ScaleFade, 
  SimpleGrid, 
  Text, 
  VStack,
  useColorModeValue,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiClock, FiSettings, FiTool, FiTruck, FiUser } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useMemo, useCallback } from "react";
import PropTypes from 'prop-types';

// Constants
const ORDER_TYPES = {
  PURCHASE: 'purchase',
  RENT: 'rent',
  PARTS: 'parts',
  REPAIR: 'repair',
  DRIVER: 'driver'
};

const ROUTE_CONTEXTS = {
  APPLICATION: "/create-ads",
  ORDER: "/order" // Add other order routes as needed
};

// Type definitions with better structure
const createTypeDefinitions = () => ({
  [ORDER_TYPES.PURCHASE]: {
    id: ORDER_TYPES.PURCHASE,
    icon: FiTruck,
    color: 'green',
    keys: {
      application: { 
        title: "ApplicationForm.select_type.options.buy.title", 
        desc: "ApplicationForm.select_type.options.buy.desc" 
      },
      order: { 
        title: "Orderform.select_type.options.buy.title", 
        desc: "Orderform.select_type.options.buy.desc" 
      }
    },
    fallback: {
      application: { 
        title: "Продажа техники", 
        desc: "Новая или б/у техника" 
      },
      order: { 
        title: "Покупка спецтехники", 
        desc: "Покупайте спецтехнику напрямую от владельцев." 
      }
    }
  },
  [ORDER_TYPES.RENT]: {
    id: ORDER_TYPES.RENT,
    icon: FiClock,
    color: 'blue',
    keys: {
      application: { 
        title: "ApplicationForm.select_type.options.rent.title", 
        desc: "ApplicationForm.select_type.options.rent.desc" 
      },
      order: { 
        title: "Orderform.select_type.options.rent.title", 
        desc: "Orderform.select_type.options.rent.desc" 
      }
    },
    fallback: {
      application: { 
        title: "Аренда", 
        desc: "Временное использование" 
      },
      order: { 
        title: "Арендовать спецтехнику", 
        desc: "Арендуйте технику для любых задач и сроков." 
      }
    }
  },
  [ORDER_TYPES.PARTS]: {
    id: ORDER_TYPES.PARTS,
    icon: FiSettings,
    color: 'purple',
    keys: {
      application: { 
        title: "ApplicationForm.select_type.options.parts.title", 
        desc: "ApplicationForm.select_type.options.parts.desc" 
      },
      order: { 
        title: "Orderform.select_type.options.parts.title", 
        desc: "Orderform.select_type.options.parts.desc" 
      }
    },
    fallback: {
      application: { 
        title: "Запасные части", 
        desc: "Оригинальные и аналоговые детали" 
      },
      order: { 
        title: "Покупка запчастей", 
        desc: "Купите оригинальные и б/у запчасти по выгодным ценам." 
      }
    }
  },
  [ORDER_TYPES.REPAIR]: {
    id: ORDER_TYPES.REPAIR,
    icon: FiTool,
    color: 'orange',
    keys: {
      application: { 
        title: "ApplicationForm.select_type.options.repair.title", 
        desc: "ApplicationForm.select_type.options.repair.desc" 
      },
      order: { 
        title: "Orderform.select_type.options.repair.title", 
        desc: "Orderform.select_type.options.repair.desc" 
      }
    },
    fallback: {
      application: { 
        title: "Ремонт", 
        desc: "Профессиональные ремонтные услуги" 
      },
      order: { 
        title: "Нужен ремонт техники", 
        desc: "Найдите специалистов для ремонта любой техники." 
      }
    }
  },
  [ORDER_TYPES.DRIVER]: {
    id: ORDER_TYPES.DRIVER,
    icon: FiUser,
    color: 'pink',
    keys: {
      application: { 
        title: "ApplicationForm.select_type.options.driver.title", 
        desc: "ApplicationForm.select_type.options.driver.desc" 
      },
      order: { 
        title: "Orderform.select_type.options.driver.title", 
        desc: "Orderform.select_type.options.driver.desc" 
      }
    },
    fallback: {
      application: { 
        title: "Водитель", 
        desc: "Квалифицированные водители" 
      },
      order: { 
        title: "Ищу водителя", 
        desc: "Найдите опытного водителя для вашей техники." 
      }
    }
  }
});

// Optimized Order Type Selector
export const OrderTypeSelector = ({ 
  selectedType, 
  onTypeChange, 
  disabled = false,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Memoized type definitions
  const typeDefinitions = useMemo(() => createTypeDefinitions(), []);

  // Determine context with better error handling
  const context = useMemo(() => {
    const isApplication = location.pathname === ROUTE_CONTEXTS.APPLICATION;
    return isApplication ? 'application' : 'order';
  }, [location.pathname]);

  // Create types array with memoization
  const types = useMemo(() => {
    try {
      return Object.values(typeDefinitions).map(type => ({
        ...type,
        label: t(type.keys[context].title, type.fallback[context].title),
        desc: t(type.keys[context].desc, type.fallback[context].desc),
        active: true
      }));
    } catch (error) {
      console.error('Error creating types array:', error);
      return [];
    }
  }, [typeDefinitions, context, t]);

  // Optimized click handler with error handling
  const handleTypeSelect = useCallback((typeId) => {
    if (disabled) return;
    
    try {
      if (Object.values(ORDER_TYPES).includes(typeId)) {
        onTypeChange(typeId);
      } else {
        console.warn(`Invalid type selected: ${typeId}`);
      }
    } catch (error) {
      console.error('Error handling type selection:', error);
    }
  }, [disabled, onTypeChange]);

  // Validate selectedType
  const isValidSelectedType = useMemo(() => {
    return !selectedType || Object.values(ORDER_TYPES).includes(selectedType);
  }, [selectedType]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event, typeId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTypeSelect(typeId);
    }
  }, [handleTypeSelect]);

  // Show error if types failed to load
  if (types.length === 0) {
    return (
      <Alert status="error" mb={8}>
        <AlertIcon />
        {t("OrderTypeSelector.error_load_failed", "Не удалось загрузить типы заказов")}
      </Alert>
    );
  }

  // Show warning for invalid selectedType
  if (!isValidSelectedType) {
    console.warn(`Invalid selectedType: ${selectedType}. Expected one of: ${Object.values(ORDER_TYPES).join(', ')}`);
  }

  return (
    <Box mb={8}>
      <VStack align="start" spacing={4} mb={6}>
        <Heading size="md" color="gray.800">
          {t("ApplicationForm.select_type.title", "Выберите тип заказа")}
        </Heading>
        <Text color="gray.600" fontSize="sm">
          {t("ApplicationForm.select_type.subtitle", "Укажите нужный вид услуги")}
        </Text>
      </VStack>
      
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
        {types.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          const isDisabled = disabled || !type.active;
          
          return (
            <ScaleFade key={type.id} in={true}>
              <Card
                cursor={isDisabled ? "not-allowed" : "pointer"}
                onClick={() => handleTypeSelect(type.id)}
                onKeyDown={(e) => handleKeyDown(e, type.id)}
                tabIndex={isDisabled ? -1 : 0}
                bg={isSelected ? (type.id === ORDER_TYPES.REPAIR ? `${type.color}.100` : `${type.color}.50`) : cardBg}
                border="2px solid"
                borderColor={isSelected ? `${type.color}.400` : borderColor}
                borderRadius="xl"
                overflow="hidden"
                position="relative"
                opacity={isDisabled ? 0.6 : 1}
                _hover={!isDisabled ? {
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                  borderColor: `${type.color}.400`
                } : {}}
                _focus={{
                  outline: 'none',
                  boxShadow: `0 0 0 3px ${type.color === 'orange' ? '#FBD38D' : `var(--chakra-colors-${type.color}-200)`}`,
                  borderColor: `${type.color}.400`
                }}
                _active={!isDisabled ? {
                  transform: 'translateY(0)'
                } : {}}
                transition="all 0.3s"
                role="button"
                aria-pressed={isSelected}
                aria-label={`${t("ApplicationForm.select_type.select", "Выбрать")} ${type.label}`}
              >
                {isSelected && (
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    height="3px"
                    bg={`${type.color}.400`}
                  />
                )}
                
                <CardBody p={6}>
                  <VStack spacing={4}>
                    <Box
                      p={4}
                      bg={isSelected ? `${type.color}.400` : 'gray.100'}
                      borderRadius="full"
                      color={isSelected ? 'white' : 'gray.600'}
                      transition="all 0.3s"
                    >
                      <IconComponent size={28} />
                    </Box>
                    <VStack spacing={2}>
                      <Text
                        fontWeight="bold"
                        color={isSelected ? `${type.color}.700` : 'gray.800'}
                        textAlign="center"
                      >
                        {type.label}
                      </Text>
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        textAlign="center"
                      >
                        {type.desc}
                      </Text>
                    </VStack>
                    {isSelected && (
                      <Badge colorScheme={type.color} borderRadius="full" px={3}>
                        {t("ApplicationForm.select_type.selected", "Выбрано")}
                      </Badge>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </ScaleFade>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

// PropTypes for type safety
OrderTypeSelector.propTypes = {
  selectedType: PropTypes.oneOf(Object.values(ORDER_TYPES)),
  onTypeChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  showError: PropTypes.bool,
  errorMessage: PropTypes.string
};

// Default props
OrderTypeSelector.defaultProps = {
  selectedType: null,
  disabled: false,
  showError: false,
  errorMessage: null
};

// Export constants for use in parent components
export { ORDER_TYPES, ROUTE_CONTEXTS };