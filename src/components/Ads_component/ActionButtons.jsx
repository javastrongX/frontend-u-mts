
import { Flex, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaTimes } from 'react-icons/fa';

const ActionButtons = ({ onReset, totalAds }) => {
  const { t } = useTranslation();
  return (
    <Flex justify={'center'} ml={{base: 2, custom900: 20}} gap={{base: 2, custom900: 10}} mt={{base: 4, custom900: 6, xl: 8}} mb={2} align="center" flexWrap="wrap">
      <Button
        onClick={onReset}
        variant="link"
        color="blue.400"
        fontSize={{base: "xs", custom900: "sm"}}
        fontWeight="medium"
        rightIcon={<FaTimes />}
        _hover={{ color: "blue.650" }}
      >
        {t("adsfilterblock.reset", "Сбросить")}
      </Button>
      <Button
        bg="orange.50"
        color="p.black"
        fontWeight="medium"
        fontSize={{base: "xs", custom900: 'sm'}}
        px={6}
        py={2}
        borderRadius="lg"
        leftIcon={<FaSearch />}
        _hover={{ bg: "orange.150" }}
      >
        {t("adsfilterblock.show_announcement", "Показать объявления")} ({totalAds})
      </Button>
    </Flex>
  );
};

export default ActionButtons;
