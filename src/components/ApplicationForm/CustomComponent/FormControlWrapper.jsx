import { Box, FormControl, FormErrorMessage, HStack, IconButton, Image, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import { forwardRef, memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiTrash2 } from "react-icons/fi";



// Helper component for form field with ref
export const FormFieldWithRef = forwardRef(({ children, fieldName, fieldRefs }, ref) => {
  return (
    <div
      ref={(el) => {
        fieldRefs.current[fieldName] = el;
        if (ref) {
          if (typeof ref === 'function') {
            ref(el);
          } else {
            ref.current = el;
          }
        }
      }}
    >
      {children}
    </div>
  );
});

FormFieldWithRef.displayName = 'FormFieldWithRef';

export const OptimizedInput = memo(({ 
  placeholder,
  value,
  onChange,
  size,
  fieldName,
  getInputStyles,
  t,
  ...props 
}) => {
  const inputStyles = useMemo(() => 
    getInputStyles(fieldName)
  , [getInputStyles, fieldName]);

  return (
    <InputGroup>
      {fieldName === "experience" && (
        <InputRightElement pointerEvents={'none'} mr={2}>{t("ApplicationForm.form.year", "лет")}</InputRightElement>
      )}
      <Input
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        size={size}
        borderRadius={{ base: "lg", md: "xl" }}
        bg="gray.50"
        border="2px solid"
        fontSize={{ base: "sm", md: "md" }}
        transition="all 0.2s"
        {...inputStyles}
        {...props}
      />
    </InputGroup>
  );
});

OptimizedInput.displayName = 'OptimizedInput';


export const FormControlWrapper = ({
  fieldName,
  label,
  Icon: Icon,
  hasError,
  children,
  fieldRefs,
  iconSize,
  ...props
}) => {
  const { t } = useTranslation();
  
  return (
    <FormFieldWithRef fieldName={fieldName} fieldRefs={fieldRefs}>
      <FormControl isInvalid={hasError(fieldName)} {...props}>
        {/* FormLabel o'rniga Text ishlatdim */}
        <Box
          fontWeight="bold"
          color="gray.700"
          mb={3}
          fontSize={{ base: "sm", md: "md" }}
          display="flex"
        >
          <HStack spacing={{ base: 2, md: 3 }}>
            {Icon && <Icon color="#3182CE" size={iconSize} />}
            <Text>
              {label}
            </Text>
          </HStack>
        </Box>
        {children}
        {hasError(fieldName) && (
          <FormErrorMessage>
            {t("ApplicationForm.form.field_haveTo_fill", "Это поле обязательно для заполнения.")}
          </FormErrorMessage>
        )}
      </FormControl>
    </FormFieldWithRef>
  );
};


// Phone Input Component
export const PhoneInput = ({ 
  value, 
  onChanged, 
  onRemove, 
  placeholder, 
  inputSize, 
  getInputStyles, 
  showRemove = false,
  index,
  fieldRefs,
  id
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const handlePhoneChange = (e) => {
    // Foydalanuvchi kiritgan qiymat
    let inputValue = e.target.value;
    onChanged(inputValue);
  };


  return (
    <FormFieldWithRef fieldName={"phone"} fieldRefs={fieldRefs}>
        <HStack spacing={2} w={{base: "100%", md: "50%"}}>
          <Input
            placeholder={placeholder}
            value={value || ""}
            size={inputSize}
            onChange={handlePhoneChange}
            borderRadius={{ base: "lg", md: "xl" }}
            bg="gray.50"
            border="2px solid"
            fontSize={{ base: "sm", md: "md" }}
            transition="all 0.2s"
            flex={1}
            id={id}
            {...getInputStyles(`phone_${index}`)}
          />
          {showRemove && (
            <IconButton
              icon={isHovered ? <Image src="/bin.png" h={4} /> : <FiTrash2 />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              bg="red.100"
              onClick={onRemove}
              aria-label="Remove phone number"
              _hover={{ bg: "red.200" }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          )}
      </HStack>
    </FormFieldWithRef>
  );
};


// Badge Info Component
export const BadgeInfo = ({ icon: Icon, text, iconColor = "#3182CE", iconSize = 16 }) => (
  <HStack spacing={2}>
    <Icon color={iconColor} size={iconSize} />
    <Text fontSize="xs" color="gray.600">{text}</Text>
  </HStack>
);