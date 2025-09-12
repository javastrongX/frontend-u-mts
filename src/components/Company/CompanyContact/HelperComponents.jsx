import React from 'react'
import { HStack, IconButton, Input, Select } from "@chakra-ui/react";
import { useCallback } from "react";
import { RiDeleteBin5Fill as DeleteIcon } from "react-icons/ri";
import { COUNTRY_CODES, SOCIAL_PLATFORMS } from "./constants/PhoneCodes_CountryCode";
import { useTranslation } from 'react-i18next';

// Memoized phone input component
export const PhoneInput = React.memo(({ phone, canDelete, onUpdate, onRemove, selectWidth, isValidPhoneNumber }) => {
  const { t } = useTranslation();
  const handleNumberChange = useCallback((e) => {
    const value = e.target.value;
    // Allow only digits and spaces
    const sanitizedValue = value.replace(/[^\d\s]/g, '');
    onUpdate(phone.id, 'number', sanitizedValue);
  }, [phone.id, onUpdate]);

  const handleCountryCodeChange = useCallback((e) => {
    onUpdate(phone.id, 'countryCode', e.target.value);
  }, [phone.id, onUpdate]);

  const handleRemove = useCallback(() => {
    onRemove(phone.id);
  }, [phone.id, onRemove]);

  return (
    <HStack spacing={2} w="full" flexWrap={{ base: "wrap", sm: "nowrap" }}>
      <Select
        value={phone.countryCode}
        onChange={handleCountryCodeChange}
        w={{ base: "full", sm: selectWidth }}
        minW={{ base: "auto", sm: "100px" }}
        size="md"
        borderColor="#fed500"
        _hover={{ borderColor: "#fed500" }}
        _focus={{ borderColor: "#fed500", boxShadow: "0 0 0 1px #fed500" }}
      >
        {COUNTRY_CODES.map(({ code, country }) => (
          <option key={code} value={code}>
            {code} ({country})
          </option>
        ))}
      </Select>
      
      <Input
        value={phone.number}
        onChange={handleNumberChange}
        placeholder={t("Business_mode.company_contact.phone", "Номер телефона")}
        flex={1}
        size="md"
        borderColor="#fed500"
        _hover={{ borderColor: "#fed500" }}
        _focus={{ borderColor: "#fed500", boxShadow: "0 0 0 1px #fed500" }}
        isInvalid={phone.number && !isValidPhoneNumber(phone.number)}
      />
      
      {canDelete && (
        <IconButton
          icon={<DeleteIcon />}
          onClick={handleRemove}
          colorScheme="red"
          variant="ghost"
          size="md"
          aria-label="Удалить телефон"
          flexShrink={0}
        />
      )}
    </HStack>
  );
});

PhoneInput.displayName = 'PhoneInput';

// Memoized social input component
export const SocialInput = React.memo(({ social, canDelete, onUpdate, onRemove, selectWidth }) => {
  const { t } = useTranslation();
  const handlePlatformChange = useCallback((e) => {
    onUpdate(social.id, 'platform', e.target.value);
  }, [social.id, onUpdate]);

  const handleUsernameChange = useCallback((e) => {
    onUpdate(social.id, 'username', e.target.value);
  }, [social.id, onUpdate]);

  const handleRemove = useCallback(() => {
    onRemove(social.id);
  }, [social.id, onRemove]);
  
  return (
    <HStack spacing={2} w="full" flexWrap={{ base: "wrap", sm: "nowrap" }}>
      <Select
        value={social.platform}
        onChange={handlePlatformChange}
        w={{ base: "full", sm: selectWidth }}
        minW={{ base: "auto", sm: "150px" }}
        size="md"
        borderColor="#fed500"
        _hover={{ borderColor: "#fed500" }}
        _focus={{ borderColor: "#fed500", boxShadow: "0 0 0 1px #fed500" }}
      >
        {SOCIAL_PLATFORMS.map(({ value, label, icon }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      
      <Input
        value={social.username}
        onChange={handleUsernameChange}
        placeholder={t("Business_mode.company_contact.nickname", "Введите ваш ник")}
        flex={1}
        size="md"
        borderColor="#fed500"
        _hover={{ borderColor: "#fed500" }}
        _focus={{ borderColor: "#fed500", boxShadow: "0 0 0 1px #fed500" }}
      />
      
      {canDelete && (
        <IconButton
          icon={<DeleteIcon />}
          onClick={handleRemove}
          colorScheme="red"
          variant="ghost"
          size="md"
          aria-label="Удалить соцсеть"
          flexShrink={0}
        />
      )}
    </HStack>
  );
});

SocialInput.displayName = 'SocialInput';

