
import { 
  Badge,
  Box, 
  Button, 
  Card, 
  IconButton,
  Flex,
  CardBody, 
  HStack, 
  Table, 
  TableContainer, 
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr, 
  VStack, 
  Divider,
  SimpleGrid,
  Stack
} from "@chakra-ui/react";
import PaginationComponent from "./profilecomponents/PaginationComponent";
import { 
  FiCalendar, 
  FiDollarSign, 
  FiEye, 
  FiMapPin, 
  FiTag, 
  FiUser 
} from "react-icons/fi";

import { FaChartLine } from "react-icons/fa";

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";


// Orders Table Component
export const OrdersTable = ({ orders, onAction }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    
    const navigate = useNavigate();

    const totalItems = orders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = orders.slice(startIndex, endIndex);
    
    const handleViewClick = useCallback((orderslug, event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      navigate(`/order-details/product/${orderslug}`);
    }, [navigate]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    
    const STATUS_COLORS = {
      active: "blue",
      cancelled: "red",
    };
    
    const ORDER_STATUSES = {
      active: "Faol",
      cancelled: "Bekor qilingan",
    };

  return (
    <Box>
      {/* Desktop Table */}
      <Card 
        borderRadius="2xl" 
        shadow="lg"
        overflow="hidden"
        display={{ base: "none", lg: "block" }}
      >
        <CardBody p={0}>
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead bg="gray.50">
                <Tr>
                  <Th py={6} px={6}>
                    <HStack>
                      <FiUser />
                      <Text>Buyurtma</Text>
                    </HStack>
                  </Th>
                  <Th py={6}>
                    <HStack>
                      <FiTag />
                      <Text>Kategoriya</Text>
                    </HStack>
                  </Th>
                  <Th py={6}>
                    <HStack>
                      <FiDollarSign />
                      <Text>Narx</Text>
                    </HStack>
                  </Th>
                  <Th py={6}>
                    <HStack>
                      <FiMapPin />
                      <Text>Shahar</Text>
                    </HStack>
                  </Th>
                  <Th py={6}>
                    <HStack>
                      <FiCalendar />
                      <Text>Sana</Text>
                    </HStack>
                  </Th>
                  <Th textAlign="center" py={6}>Amallar</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentOrders.map((order) => (
                  <Tr key={order.id} _hover={{ bg: "gray.50" }}>
                    <Td py={6} px={6}>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" fontSize="md" color={'blue.400'} _hover={{textDecor: "underline"}} cursor={'pointer'} onClick={() => handleViewClick(order.slug)}>
                          {order.title}
                        </Text>
                        <Badge
                          colorScheme={STATUS_COLORS[order.status]}
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                        >
                          {ORDER_STATUSES[order.status]}
                        </Badge>
                      </VStack>
                    </Td>
                    <Td py={6}>
                      <Text bg={'gray.50'} borderRadius="md" px={2} py={1} fontWeight="medium">{order.category}</Text>
                    </Td>
                    <Td py={6}>
                      <Text bg={'green.50'} px={2} py={1} textAlign={'center'} borderRadius="md" fontWeight="bold" color="green.500">
                        {order.price}
                      </Text>
                    </Td>
                    <Td py={6}>
                      <HStack>
                        <Box p={2} bg="blue.50" borderRadius="md">
                          <FiMapPin color="#3182CE" />
                        </Box>
                          <Text>{order.city}</Text>
                      </HStack>
                    </Td>
                    <Td py={6}>
                      <Text>{order.date}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {order.time || "10:29"}
                      </Text>
                    </Td>
                    <Td textAlign="center" py={6}>
                      <HStack spacing={2} justify="center">
                        <Button
                          size="sm"
                          colorScheme={order.status === "cancelled" ? "green" : "red"}
                          bg={order.status !== "cancelled" ? "linear-gradient(135deg, #ff416c, #ff4b2b)" : "linear-gradient(135deg, #56ab2f, #a3e652)"}
                          onClick={() => onAction(order.status === "cancelled" ? "restore" : "cancel", order)}
                          _hover={{
                            bg: order.status !== "cancelled" ? "linear-gradient(135deg, #ff4b2b, #ff416c)" : "linear-gradient(135deg, #a3e652, #56ab2f)"
                          }}
                        >
                          {order.status === "cancelled" ? "Tiklash" : "Bekor qilish"}
                        </Button>
                          {order.status !== 'cancelled' && (
                            <IconButton bgGradient={"linear(135deg, yellow.400, orange.400)"} size={'sm'} aria-label='Statistics' icon={<FaChartLine />} onClick={() => {
                              navigate(`/profile/my-applications/statistic/${order.id}`)
                            }} />
                          )}
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </CardBody>
      </Card>

      {/* Mobile Cards */}
      <VStack spacing={4} display={{ base: "flex", lg: "none" }}>
        {currentOrders.map((order) => (
          <Card key={order.id} w="100%" borderRadius="2xl" shadow="lg">
            <CardBody p={6}>
              <VStack align="stretch" spacing={4}>
                <Flex justify="space-between" align="start">
                  <HStack spacing={4} flex="1">
                    <VStack align="start" spacing={1} flex="1">
                      <Text fontWeight="bold" fontSize="md">
                        {order.title}
                      </Text>
                      <Badge
                        colorScheme={STATUS_COLORS[order.status]}
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                      >
                        {ORDER_STATUSES[order.status]}
                      </Badge>
                    </VStack>
                  </HStack>
                  {order.status !== 'cancelled' && (
                    <IconButton  size={'sm'} bgGradient={"linear(135deg, yellow.400, orange.400)"} aria-label='Statistics' icon={<FaChartLine />} onClick={() => {
                      navigate(`/profile/my-applications/statistic/${order.id}`)
                    }} />
                  )}
                </Flex>

                <Divider />

                <SimpleGrid columns={2} spacing={4}>
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <FiTag />
                      <Text color="gray.500" fontSize="sm">Kategoriya</Text>
                    </HStack>
                    <Text fontWeight="semibold">{order.category}</Text>
                  </VStack>
                  
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <FiDollarSign />
                      <Text color="gray.500" fontSize="sm">Narx</Text>
                    </HStack>
                    <Text fontWeight="bold" color="green.500">{order.price}</Text>
                  </VStack>
                  
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <FiMapPin />
                      <Text color="gray.500" fontSize="sm">Shahar</Text>
                    </HStack>
                    <Text fontWeight="semibold">{order.city}</Text>
                  </VStack>
                  
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <FiCalendar />
                      <Text color="gray.500" fontSize="sm">Sana</Text>
                    </HStack>
                    <Text fontWeight="semibold">{order.date}</Text>
                  </VStack>
                </SimpleGrid>

                <Box bg="gray.50" p={4} borderRadius="xl">
                  <Text color="gray.500" fontSize="sm" mb={2}>Tavsif</Text>
                  <Text fontSize="sm">{order.description}</Text>
                </Box>

                <Stack direction={{ base: "row", sm: "row" }} spacing={3}>
                  <Button
                    colorScheme={order.status === "cancelled" ? "green" : "red"}
                    bg={order.status !== "cancelled" ? "linear-gradient(135deg, #ff416c, #ff4b2b)" : "linear-gradient(135deg, #56ab2f, #a3e652)"}
                    onClick={() => onAction(order.status === "cancelled" ? "restore" : "cancel", order)}
                    flex="1"
                  >
                    {order.status === "cancelled" ? "Tiklash" : "Bekor qilish"}
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<FiEye />}
                    colorScheme="black"
                    flex="1"
                    onClick={(event) => handleViewClick(order.slug, event)}
                  >
                    Ko'rish
                  </Button>
                </Stack>
              </VStack>
            </CardBody>
          </Card>
        ))}

        <Box w="100%">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </Box>
      </VStack>
    </Box>
  );
};
