import { Button, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

const parseQuery = (queryString) => {
  const params = new URLSearchParams(queryString);
  return Object.fromEntries(params.entries());
};

const isActiveLink = (link) => {
  const url = new URL(link, window.location.origin);
  const currentPath = window.location.pathname;
  const currentQuery = parseQuery(window.location.search);
  const linkPath = url.pathname;
  const linkQuery = parseQuery(url.search);
  
  // Path mos kelmasa, aktiv emas
  if (currentPath !== linkPath) return false;
  
  // Maxsus holat: /ads sahifasi uchun faqat path tekshirish
  if (linkPath === '/ads') {
    return true; // /ads sahifasida har qanday query parameter bilan aktiv
  } else if (linkPath === '/applications') {
    return true
  }
  
  // Agar link query parametrlari bo'lmasa, faqat path tekshiriladi
  const linkKeys = Object.keys(linkQuery);
  if (!linkKeys.length) return true;
  
  // Boshqa hollarda barcha query parametrlar mos kelishi kerak
  return linkKeys.every((key) => currentQuery[key] === linkQuery[key]);
};

const RenderButton = ({ btn, link, bg, border, ...props }) => (
  <Button
    as="a"
    href={link}
    gap={1}
    bg={bg}
    w="200px"
    borderWidth={border ? "1px" : undefined}
    borderStyle={border ? "solid" : undefined}
    borderColor={border ? "orange.50" : undefined}
    _hover={border ? { bg: "orange.50" } : undefined}
    {...props}
  >
    <Icon as={FiPlus} />
    <Text fontSize="sm" fontWeight="500">
      {btn}
    </Text>
  </Button>
);

const SecondNav = ({
  arrSecondNav = [],
  arrBtn = [],
}) => (
  <HStack
    w="100%"
    justifyContent="space-between"
    bg="black.0"
    px={4}
    display={{ base: "none", custom900: "flex" }}
  >
    <HStack spacing={4}>
      {arrSecondNav.map((item, idx) => (
        <Text
          key={idx}
          as="a"
          href={item.link}
          
          fontSize="sm"
          fontWeight="500"
          color={isActiveLink(item.link) ? "orange.50" : "p.black"}
          _hover={{ color: "orange.50" }}
        >
          {item.name}
        </Text>
      ))}
    </HStack>
    <Flex gap={2} alignItems="center">
      {arrBtn.slice(0, 2).map((btnItem, idx) =>
        btnItem ? (
          <RenderButton
            key={idx}
            btn={btnItem.btn}
            link={btnItem.link}
            bg={idx === 0 ? "orange.50" : "orange.100"}
            border={idx === 1}
          />
        ) : null
      )}
    </Flex>
  </HStack>
);

export default SecondNav;