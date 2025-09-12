import React, { useId } from 'react';
import {
  Box,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
  Icon,
  useBreakpointValue,
  HStack,
  Text
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const ConditionRadio = React.memo(({
  value,
  setValue,
  title,
  label1,
  label2,
  icon,
  value1,
  value2,
  fieldName = "condition"
}) => {
  const { t } = useTranslation();
  const iconSize = useBreakpointValue({ base: "16px", md: "20px" });
  
  const handleChange = (newValue) => {
    // Check if setValue accepts two parameters (field, value)
    if (setValue.length === 2) {
      setValue(fieldName, newValue);
    } else {
      // Direct setter function
      setValue(newValue);
    }
  };
  const generateId = useId();
  return (
    <Box>
      <FormLabel
        fontWeight="bold"
        color="gray.700"
        mb={3}
        fontSize={{ base: "sm", md: "md" }}
        display="flex"
        htmlFor={`radio-${generateId}`}
      >
        <HStack spacing={{ base: 2, md: 3 }}>
          {icon && (
            <Icon as={icon} color="#3182CE" boxSize={iconSize} />
          )}
          <Text>
            {title || t('adsfilterblock.condition', 'Состояние')}
          </Text>
        </HStack>
      </FormLabel>
      
      <RadioGroup value={value} onChange={handleChange}>
        <Stack direction="row" spacing={6}>
          <Radio 
            id={`radio-${generateId}`}
            value={value1 || "new"} 
            colorScheme="blue"
            _checked={{
              border: "4px solid", 
              borderColor: "blue.400",
              _hover: {borderColor: "blue.400"}
            }}
          >
            {label1 || t('adsfilterblock.new', 'Новый')}
          </Radio>
          <Radio 
            value={value2 || "used"} 
            colorScheme="blue"
            _checked={{
              border: "4px solid", 
              borderColor: "blue.400",
              _hover: {borderColor: "blue.400"}
            }}
          >
            {label2 || t('adsfilterblock.used', 'Б/У')}
          </Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
});

ConditionRadio.displayName = 'ConditionRadio';
export default ConditionRadio;