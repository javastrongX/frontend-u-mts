
import { VStack, Box, Text, HStack, Input } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const PriceYearInputs = ({
  priceFrom,
  setPriceFrom,
  priceTo,
  setPriceTo,
  yearFrom,
  setYearFrom,
  yearTo,
  setYearTo,
  activeTab,
}) => {
  const { t } = useTranslation();
  const inputStyles = {
    w: "100%",
    bg: "white",
    border: "1px",
    borderColor: "gray.200",
    borderRadius: "lg",
    size: "sm",
    _focus: {
      borderColor: "yellow.400",
      boxShadow: "0 0 0 1px var(--chakra-colors-yellow-400)"
    }
  };

  const formatInputNumber = (value) => {
    if (!value) return '';

    // Faqat raqamlarni qoldirish
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';

    // Raqamga aylantirish
    let number = parseInt(numbers, 10);
    if (isNaN(number)) return '';

    // Min-max cheklovlar
    if (number < 0) number = 0;
    if (number > 999_999_999) number = 999_999_999;

    // Formatlash (UZ style: probel bilan ajratilgan)
    return number.toLocaleString('uz-UZ');
  };

  return (
    <VStack spacing={4} mb={6}>
      {/* Price */}
      <Box w="100%" display={[0, 1, 3].includes(activeTab) ? 'block' : 'none'}>
        <Text color="gray.700" mb={2} fontSize="sm">{t("adsfilterblock.category_label_price", "Цена")}</Text>
        <HStack>
          <Input
            type='text'
            inputMode='numeric'
            placeholder={t("adsfilterblock.from", "от")}
            value={priceFrom}
            onChange={(e) => {
              const raw = e.target.value.replace(/\s/g, '');
              setPriceFrom(formatInputNumber(raw));
            }}
            {...inputStyles}
          />
          <Input
            type='text'
            inputMode='numeric'
            placeholder={t("adsfilterblock.to", "до")}
            value={priceTo}
            onChange={(e) => {
              const raw = e.target.value.replace(/\s/g, '');
              setPriceTo(formatInputNumber(raw));
            }}
            {...inputStyles}
          />
        </HStack>
      </Box>
      
      {/* Year */}
      <Box w="100%" display={activeTab === 1 ? 'block' : 'none'}>
        <Text color="gray.700" mb={2} fontSize="sm">{t("adsfilterblock.category_label_year_release", "Год выпуска")}</Text>
        <HStack>
          <Input
            placeholder={t("adsfilterblock.from", "от")}
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
            {...inputStyles}
          />
          <Input
            placeholder={t("adsfilterblock.to", "до")}
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
            {...inputStyles}
          />
        </HStack>
      </Box>
    </VStack>
  );
};

export default PriceYearInputs;