import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Category from "./Category";
import { FaBars } from "react-icons/fa6";
import SideDrawer from "../Drawer/SideDrawer";

const FilterBlock = () => {
  const { t } = useTranslation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  // Test uchun statik kategoriyalar
  const categories = [
    { name: t("filter_block.sell_special_tech", "Продажа спецтехники"), link: "/ads?category_id=1" },
    { name: t("filter_block.rent", "Аренда спецтехники"), link: "/ads?category_id=2" },
    { name: t("filter_block.spare_parts", "Запчасти"), link: "/ads?category_id=3" },
    { name: t("filter_block.repair", "Ремонт"), link: "/ads?category_id=4" },
    { name: t("filter_block.drivers", "Водители"), link: "/ads?category_id=5" },
  ];

  return (
    <Flex
      flexDir="column"
      align={{ base: "center", custom900: "flex-start" }}
      w={"100%"}
      right={0}
      left={0}
      bg={{ base: "black.0", custom900: "black.40" }}
      p={{ base: 2, custom900: 3 }}
      borderRadius="xl"
      mt={{ base: 0, custom900: 8 }}
      position={{ base: "fixed", custom900: "relative" }}
      top={{ base: 0 }}
      zIndex={{ base: 1000, custom900: 0 }}
      boxShadow={{ base: "md", custom900: "none" }}
    >
      {/* Katta ekran uchun kategoriya tugmalari */}
      <HStack
        spacing={{ base: 2, custom900: 4 }}
        flexWrap="wrap"
        display={{ base: "none", custom900: "flex" }}
        mb={4}
        w="100%"
        justify={{ custom900: "flex-start" }}
      >
        {categories.map((item, index) => (
          <Button
            key={index}
            as="a"
            href={item.link}
            fontSize="sm"
            fontWeight="500"
            bg="orange.100"
            _hover={{ bg: "orange.50" }}
            borderRadius="md"
            px={4}
            py={2}
            whiteSpace="nowrap"
          >
            {item.name}
          </Button>
        ))}
      </HStack>

      {/* Mobil uchun ikonka va Category input */}
      <HStack w="100%" spacing={4} mb={4}>
        <Box
          bg="orange.50"
          p={3}
          borderRadius="md"
          display={{ base: "inline-flex", custom900: "none" }}
          cursor="pointer"
          _hover={{ bg: "orange.100" }}
          onClick={onOpen}
        >
          <Icon
            as={FaBars}
            display={{
              base: "block",
              custom900: "none",
            }}
          />
        </Box>
        <SideDrawer isOpen={isOpen} onClose={onClose} />
        <Category />
      </HStack>

      {/* Mobil uchun scrollable kategoriya tugmalari */}
      <Box overflowX="auto" w="100%">
        <HStack
          spacing={4}
          flexWrap="nowrap"
          width="max-content"
          display={{ base: "flex", custom900: "none" }}
          pb={2}
        >
          {categories.map((item, index) => (
            <Button
              key={index}
              as="a"
              href={item.link}
              fontSize="sm"
              fontWeight="600"
              bg="orange.100"
              _hover={{ bg: "orange.50" }}
              whiteSpace="nowrap"
              borderRadius="md"
              px={4}
              py={2}
            >
              {item.name}
            </Button>
          ))}
        </HStack>
      </Box>
    </Flex>
  );
};

export default FilterBlock;
