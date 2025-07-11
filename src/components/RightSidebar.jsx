import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Image,
  Divider,
  Link as ChakraLink,
  Button,
  SimpleGrid,
  Tooltip,
  Icon
} from "@chakra-ui/react";
import { use, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { GiFlame } from "react-icons/gi";
import { useTranslation } from "react-i18next";

const topProducts = [
  {
    title: "Мини-экскаваторы",
    city: "г. Алматы",
    price: "Договорная",
    image: "/Images/d-image.png",
    slug: "noyot-name"
  },
  {
    title: "Hyundai R 305LC-7",
    city: "г. Шымкент",
    price: "25 000 000 ₸",
    image: "/Images/d-image.png",
    slug: "noyot-name"
  },
  {
    title: "Втулка в переднюю стрелу",
    city: "г. Шымкент",
    price: "15 069 ₸",
    image: "/Images/d-image.png",
    slug: "noyot-name"
  },
  {
    title: "Втулка в переднюю стрелу",
    city: "г. Шымкент",
    price: "15 069 ₸",
    image: "/Images/d-image.png",
    slug: "noyot-name"
  },
  {
    title: "Втулка в переднюю стрелу",
    city: "г. Шымкент",
    price: "15 069 ₸",
    image: "/Images/d-image.png",
    slug: "noyot-name"
  },
  {
    title: "Втулка в переднюю стрелу",
    city: "г. Шымкент",
    price: "15 069 ₸",
    image: "/Images/d-image.png",
    slug: "noyot-name"
  }
];

const allCategories = [
  { name: "Бульдозеры", count: 1302 },
  { name: "Грейдеры", count: 311 },
  { name: "Гусеничные экскаваторы", count: 2234 },
  { name: "Фронтальные погрузчики", count: 2666 },
  { name: "Экскаваторы-погрузчики", count: 2590 },
  { name: "Мини-экскаваторы", count: 975 },
  { name: "Компрессоры", count: 111 },
  { name: "Мини-погрузчики", count: 897 },
  { name: "Мини-тракторы", count: 27 },
  { name: "Автовышки", count: 256 },
  { name: "Буровые установки", count: 92 },
  { name: "Бурильно-крановые машины", count: 28 },
  { name: "Электростанции", count: 65 },
  { name: "Траншейные экскаваторы", count: 395 },
  { name: "Земснаряды", count: 22 },
];

const allCities = [
  { name: "г. Алматы", count: 12000 },
  { name: "г. Шымкент", count: 8300 },
  { name: "г. Астана", count: 7400 },
  { name: "г. Караганда", count: 3900 },
  { name: "г. Актобе", count: 2700 },
  { name: "г. Тараз", count: 2200 },
  { name: "г. Костанай", count: 1850 },
  { name: "г. Павлодар", count: 1600 },
  { name: "г. Уральск", count: 1500 },
];

const allBrands = [
  { name: "Caterpillar", count: 2150 },
  { name: "Komatsu", count: 1820 },
  { name: "Hitachi", count: 1390 },
  { name: "Hyundai", count: 1220 },
  { name: "JCB", count: 1110 },
  { name: "Doosan", count: 890 },
  { name: "Volvo", count: 730 },
  { name: "XCMG", count: 560 },
  { name: "Shantui", count: 420 },
];

// Reusable hook for expanding/collapsing lists
const useToggleList = (list, defaultCount = 8) => {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? list : list.slice(0, defaultCount);
  const toggle = () => setShowAll((prev) => !prev);
  const hasToggle = list.length > defaultCount;
  return { visibleItems, toggle, showAll, hasToggle };
};

export const RightSidebar = ({ vehicle }) => {
  const categories = useToggleList(allCategories);
  const cities = useToggleList(allCities);
  const brands = useToggleList(allBrands);
  const { t } = useTranslation();
  const navigate = useNavigate()

  return (
    <Box w="330px" p={4} bg="white">
      {/* Top предложения */}
      <Heading fontSize="md" mb={3} display={vehicle ? 'none' : 'block'}>
        {t("rightsidebar.top_offers" ,"Топ предложения")}{" "}
        <Text onClick={() => navigate("/")} as="span" color="blue.400" ml={2} cursor={'pointer'}>
          {t("hot_offers.iwannaCome" ,"Хочу сюда!")}{" "}
          <Tooltip
            hasArrow
            label={t("hot_offers.hot_offer", "Горячее предложения")}
            bg="rgba(255, 255, 255, 0.4)"
            color="p.black"
            p={2}
            boxShadow="lg"
            borderRadius="xl"
            sx={{
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <Icon fontSize={"18px"} cursor={'pointer'} color={'orange.200'} as={GiFlame} />
          </Tooltip>
        </Text>
      </Heading>

      <VStack align="stretch" spacing={4} display={vehicle ? 'none' : 'flex'}>
        {topProducts.map((item, idx) => (
          <HStack key={idx} align="start">
            <HStack
              as={Link}
              to={`/${item.slug}`}
              w={"100%"}
              spacing={3}
              align="start"
            >
              <Image
                src={item.image}
                alt={item.title}
                boxSize="60px"
                objectFit="cover"
                borderRadius="md"
              />
              <Box w="100%">
                <HStack justify="space-between">
                  <Box maxW="70%" isTruncated>
                    <Text
                      fontWeight="bold"
                      fontSize="sm"
                      color="blue.400"
                      isTruncated
                    >
                      {item.title}
                    </Text>
                  </Box>
                  <Text fontSize="xs" fontWeight="semibold" flexShrink={0}>
                    {item.price}
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.600">
                  {item.city}
                </Text>
              </Box>
            </HStack>
          </HStack>
        ))}
      </VStack>

      <Divider my={5} display={vehicle ? 'none' : 'block'} />

      {/* Категории */}
      <Heading fontSize="md" mb={3}>{t("rightsidebar.type_special_equipment", "Типы спецтехники")}</Heading>
      <CategoryList {...categories} type="category" />

      <Divider my={5} />

      {/* Города */}
      <Heading fontSize="md" mb={3}>{t("rightsidebar.city_special_equipment", "Спецтехника в городах")}</Heading>
      <CategoryList {...cities} type="city" />

      <Divider my={5} />

      {/* Бренды */}
      <Heading fontSize="md" mb={3}>{t("rightsidebar.brand_special_equipment", "Марки спецтехники")}</Heading>
      <CategoryList {...brands} type="brand" />
    </Box>
  );
};

// Reusable list component
const CategoryList = ({ visibleItems, toggle, showAll, hasToggle, type }) => {
  const isGrid = type === "city" || type === "brand";
  const { t } = useTranslation();
  const content = visibleItems.map((item, i) => (
    <ChakraLink
      as={Link}
      to={`/${type}/${encodeURIComponent(item.name)}`}
      fontSize="sm"
      color="blue.400"
      _hover={{ textDecoration: "underline" }}
      key={i}
    >
      {item.name}{" "}
      <Text as="span" color="gray.600">
        ({item.count})
      </Text>
    </ChakraLink>
  ));

  return (
    <>
      {isGrid ? (
        <SimpleGrid columns={2} spacing={2}>
          {content}
        </SimpleGrid>
      ) : (
        <VStack align="stretch" spacing={2}>
          {content}
        </VStack>
      )}

      {hasToggle && (
        <Button
          onClick={toggle}
          size="sm"
          variant="link"
          color="gray.500"
          _hover={{ color: "blue.400", textDecoration: "underline" }}
          mt={2}
          alignSelf="flex-start"
        >
          {showAll ? t("rightsidebar.hide", "Скрыть") : t("rightsidebar.more", "ещё")}
        </Button>
      )}
    </>
  );
};
