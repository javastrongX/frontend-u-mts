import {
  FormControl,
  FormLabel,
  Text,
  HStack,
  ScaleFade,
  useBreakpointValue
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiSettings, FiPackage } from 'react-icons/fi';
import { TbEngine, TbTool } from 'react-icons/tb';
import { SearchableSelect } from './SearchableSelect';
import { useId } from 'react';


export const OptimizedForm = ({ 
  selectedType, 
  formData, 
  handleInputChange, 
  techTypes, 
  availableMarka, 
  availableModel, 
}) => {
  const iconSize = useBreakpointValue({ base: 16, md: 20 });
  const inputSize = useBreakpointValue({ base: "md", md: "lg" });

  const { t } = useTranslation();

  // Helper functions
  const getTechTypeLabel = (type) => {
    const labels = {
      driver: t("Orderform.form.driver_title", "На какую технику нужен водителя?"),
      parts: t("Orderform.form.spare_parts_title", "Для какой техники вы ищете запчасти?"),
      repair: t("Orderform.form.repair_title", "Какую технику необходимо отремонтировать?"),
      rent: `${t("Orderform.form.order_type", "Какой тип техники вы хотите")} ${t("Orderform.form.rent", "арендовать?")}`,
      purchase: `${t("Orderform.form.order_type", "Какой тип техники вы хотите")} ${t("Orderform.form.sell", "купить?")}`
    };
    return labels[type] || t("Orderform.form.select_type", "Выберите тип");
  };

  const getModelLabel = (type) => {
    return type === 'parts'
      ? `${t("Orderform.form.select_model", "Выберите модель")}:`
      : `${t("Orderform.form.select_specialization", "Выберите специализацию")}:`;
  };

  const getModelPlaceholder = (type) => {
    return type === 'parts'
      ? t("Orderform.form.select_model", "Выберите модель")
      : t("Orderform.form.select_specialization", "Выберите специализацию");
  };

  const shouldShowField = (fieldName) => {
    const visibility = {
      techType: ['purchase', 'rent', 'driver', 'repair', 'parts'],
      marka: ['repair', 'parts'],
      model: ['repair', 'parts']
    };
    return visibility[fieldName]?.includes(selectedType) || false;
  };

  if (!["purchase", 'rent', 'parts', 'repair', 'driver'].includes(selectedType)) {
    return null;
  }

  const generatedId = useId();
  const inputId = generatedId;
  const inputName = `searchable-select-${generatedId}`;

  return (
    <>
      {/* Tech Type Field */}
      {shouldShowField('techType') && (
        <ScaleFade in={true} delay={0.1}>
          <FormControl isRequired>
            <FormLabel
              fontWeight="bold"
              color="gray.700"
              mb={3}
              display="flex"
              flexDir="row"
              alignItems="flex-start"
              fontSize={{ base: "sm", md: "md" }}
              htmlFor={inputId}
            >
              <HStack spacing={{ base: 2, md: 3 }}>
                <FiSettings color="#3182CE" size={iconSize} />
                <Text>{getTechTypeLabel(selectedType)}</Text>
              </HStack>
            </FormLabel>
            <SearchableSelect
              placeholder={t("Orderform.form.select_type", "Выберите тип")}
              value={formData.techType}
              onChange={(value) => handleInputChange("techType", value)}
              options={techTypes}
              size={inputSize}
              borderRadius={{ base: "lg", md: "xl" }}
              bg="gray.50"
              border="2px solid"
              borderColor="gray.200"
              fontSize={{ base: "sm", md: "md" }}
              _focus={{ borderColor: "blue.400", bg: "white" }}
              _hover={{ borderColor: "gray.300" }}
              transition="all 0.2s"
              id={inputId}
              name={inputName}
            />
          </FormControl>
        </ScaleFade>
      )}

      {/* Marka Field */}
      {shouldShowField('marka') && (
        <ScaleFade in={true} delay={0.1}>
          <FormControl isRequired>
            <FormLabel
              fontWeight="bold"
              color="gray.700"
              mb={3}
              display="flex"
              flexDir="row"
              alignItems="flex-start"
              fontSize={{ base: "sm", md: "md" }}
              htmlFor={`${inputId}-2`}
            >
              <HStack spacing={{ base: 2, md: 3 }}>
                <FiPackage color="#3182CE" size={iconSize} />
                <Text>{t("Orderform.form.select_marka", "Выберите марку")}</Text>
              </HStack>
            </FormLabel>
            <SearchableSelect
              placeholder={t("Orderform.form.select_marka", "Выберите марку")}
              value={formData.marka}
              onChange={(value) => handleInputChange("marka", value)}
              options={availableMarka}
              size={inputSize}
              borderRadius={{ base: "lg", md: "xl" }}
              bg="gray.50"
              border="2px solid"
              borderColor="gray.200"
              fontSize={{ base: "sm", md: "md" }}
              _focus={{ borderColor: "blue.400", bg: "white" }}
              _hover={{ borderColor: "gray.300" }}
              transition="all 0.2s"
              id={`${inputId}-2`}
              name={inputName}
            />
          </FormControl>
        </ScaleFade>
      )}

      {/* Model/Specialization Field */}
      {shouldShowField('model') && (
        <ScaleFade in={true} delay={0.1}>
          <FormControl isRequired>
            <FormLabel
              fontWeight="bold"
              color="gray.700"
              mb={3}
              display="flex"
              flexDir="row"
              alignItems="flex-start"
              fontSize={{ base: "sm", md: "md" }}
              htmlFor={`${inputId}-3`}
            >
              <HStack spacing={{ base: 2, md: 3 }}>
                {selectedType === 'parts' ? (
                  <TbEngine color="#3182CE" size={iconSize} />
                ) : (
                  <TbTool color="#3182CE" size={iconSize} />
                )}
                <Text>{getModelLabel(selectedType)}</Text>
              </HStack>
            </FormLabel>
            <SearchableSelect
              placeholder={getModelPlaceholder(selectedType)}
              value={formData.model}
              onChange={(value) => handleInputChange("model", value)}
              options={availableModel}
              size={inputSize}
              borderRadius={{ base: "lg", md: "xl" }}
              bg="gray.50"
              border="2px solid"
              borderColor="gray.200"
              fontSize={{ base: "sm", md: "md" }}
              _focus={{ borderColor: "blue.400", bg: "white" }}
              _hover={{ borderColor: "gray.300" }}
              transition="all 0.2s"
              id={`${inputId}-3`}
              name={inputName}
            />
          </FormControl>
        </ScaleFade>
      )}
    </>
  );
};