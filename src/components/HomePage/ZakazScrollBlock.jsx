import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  HStack,
  VStack,
  useBreakpointValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Mock zakazlar
const mockOrders = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `Куплю Колесные экскаваторы`,
  price: "Договорная",
  city: "Шымкент",
  date: "18 Май",
  link: "12452-ekskavatory-pogruzciki",
}));

const ZakazScrollBlock = () => {
  const isMobile = useBreakpointValue({ base: true, custom900: false });
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Show 6 orders + 1 view all button = 7 items total for custom900+
  const visibleOrders = mockOrders.slice(0, 7);

  return (
    <Box
      bg="black.0"
      p={{ base: 3, md: 4 }}
      borderRadius="md"
      boxShadow="sm"
      w="100%"
      mt={5}
    >
      {/* Header */}
      <Flex
        align="center"
        justify={{base: 'space-between', custom900: "flex-start"}}
        mb={{ base: 4, md: 6 }}
        flexDirection={{ base: "row", custom900: "row" }}
        gap={2}
      >
        <Text fontWeight="bold" fontSize={{base: "16px", custom900: '22px'}}>
          {t("order_sparePart.zakaz")}
        </Text>
        <Text
          display={{base: 'block', custom900: 'none'}}
          onClick={() => navigate("/applications/create")}
          _hover={{ color: "blue.650", bg: "blue.600" }}
          color={"blue.650"}
          bg={"blue.600"}
          fontSize={"12px"}
          p={'2px'}
          borderRadius={"6px"}
          ml={4}
        >
          {t("order_sparePart.place_order")}
        </Text>
      </Flex>

      {isMobile ? (
        // Mobile: horizontal scroll with flex nowrap
      <Flex
        direction="row"
        gap={4}
        overflowX="auto"
        pb={2}
        sx={{
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {mockOrders.slice(0, 10).map((order) => (
          <Box
            key={order.id}
            minW="300px"
            maxW="300px"
            p={3}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            bg="black.0"
            flexShrink={0}
            cursor="pointer"
            onClick={() => navigate(`/order-details/product/${order.link}`)}
          >
            <VStack align="start" spacing={1}>
              <Text
                color="blue.400"
                fontWeight="semibold"
                fontSize="md"
                _hover={{ textDecoration: "underline" }}
                noOfLines={2}
              >
                {order.title}
              </Text>
              <Text fontWeight="bold" fontSize="sm">
                {order.price}
              </Text>
              <Flex
                justify="space-between"
                align="center"
                fontSize="xs"
                color="gray.500"
                w="100%"
              >
                <HStack spacing={1}>
                  <Icon as={FaMapMarkerAlt} />
                  <Text>{order.city}</Text>
                </HStack>
                <Text>{order.date}</Text>
              </Flex>
            </VStack>
          </Box>
        ))}

        {/* View All Button */}
        <Button
          as="a"
          href="/applications"
          bg="orange.100"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          whiteSpace={'normal'}
          py={4}
          textAlign="center"
          aria-label="Посмотреть все заказы"
          _hover={{ bg: "orange.50" }}
          fontSize="14px"
          color="gray.700"
          minW="150px"
          maxW="180px"
          h={'100%'}
          flexShrink={0}
        >
          <Icon as={FaSearch} fontSize={"xl"} color="gray.600" mb={2} />
          {t("order_sparePart.view_allOrder")}
        </Button>
      </Flex>

      ) : (
        // custom900 and above: grid 2 rows x 4 columns, 7 items total
        <SimpleGrid columns={4} spacing={4}>
          {visibleOrders.map((order) => (
            <Box
              key={order.id}
              p={3}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              bg="black.0"
              cursor="pointer"
              _hover={{boxShadow: 'lg'}}
              onClick={() => navigate(`/order-details/product/${order.link}`)}
            >
              <VStack align="start" spacing={1}>
                <Text
                  color="blue.400"
                  fontWeight="semibold"
                  fontSize="md"
                  _hover={{ textDecoration: "underline" }}
                  noOfLines={2}
                >
                  {order.title}
                </Text>
                <Text fontWeight="bold" fontSize="sm">
                  {order.price}
                </Text>
                <Flex
                  justify="space-between"
                  align="center"
                  fontSize="xs"
                  color="gray.500"
                  w="100%"
                >
                  <HStack spacing={1}>
                    <Icon as={FaMapMarkerAlt} />
                    <Text>{order.city}</Text>
                  </HStack>
                  <Text>{order.date}</Text>
                </Flex>
              </VStack>
            </Box>
          ))}

          {/* View all button as last grid item */}
          <Button
            as="a"
            href="/applications"
            bg="orange.100"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            py={4}
            whiteSpace={'wrap'}
            textAlign="center"
            aria-label="Посмотреть все заказы"
            _hover={{ bg: "orange.50" }}
            fontSize="14px"
            color="gray.700"
            h={'100%'}
          >
            <Icon as={FaSearch} fontSize={"xl"} color="gray.600" mb={2} />
            {t("order_sparePart.view_allOrder")}
          </Button>
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ZakazScrollBlock;
