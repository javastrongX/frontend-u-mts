import { 
  Badge,
  Box, 
  Button, 
  Card, 
  IconButton,
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
  Image,
  Tooltip,
} from "@chakra-ui/react";
import PaginationComponent from "./profilecomponents/PaginationComponent";
import { 
  FiCalendar, 
  FiDollarSign, 
  FiEye, 
  FiMapPin, 
  FiTag, 
  FiImage,
  FiEdit3,
  FiTrash2,
  FiRotateCcw,
  FiInfo
} from "react-icons/fi";

import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";

// Applications Table Component
export const ApplicationsTable = ({ orders, onAction }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    
    const navigate = useNavigate();

    const totalItems = orders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = orders.slice(startIndex, endIndex);
    
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);
    
    const STATUS_COLORS = {
      active: "green",
      cancelled: "red",
    };
    
    const ORDER_STATUSES = {
      active: "Faol",
      cancelled: "Bekor qilingan",
    };

    const handleEditClick = useCallback((order) => {
      navigate(`/edit/${order.id}`);
    }, [navigate]);

    // Event handler'larni useCallback bilan optimize qilish
    const handleActionClick = useCallback((action, order, event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (onAction) {
        onAction(action, order);
      }
    }, []);

    const handleViewClick = useCallback((orderslug, event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      navigate(`/ads/${orderslug}`);
    }, [navigate]);

    const handlePromotionButtonClick = useCallback((order, event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      navigate(`/product/promotion/${order.id}`, { state: { order } });
    }, [navigate]);


  return (
    <Box>
      {/* Desktop Table */}
      <Card 
        borderRadius="2xl" 
        shadow="lg"
        overflow="hidden"
        display={{ base: "none", lg: "block" }}
        border="1px solid"
        borderColor="gray.100"
      >
        <CardBody p={0}>
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead bg="gray.50">
                <Tr>
                  <Th py={6} px={6} borderBottom="1px solid" borderColor="gray.200">
                    <HStack>
                      <FiImage />
                      <Text fontWeight="semibold">Foto</Text>
                    </HStack>
                  </Th>
                  <Th py={6} borderBottom="1px solid" borderColor="gray.200">
                    <HStack>
                      <Box p={1} bg="#fcefe96c" borderRadius="md">
                        <FiInfo size="14" color="#FF7F50" />
                      </Box>
                      <Text fontWeight="semibold">Nomenklatura</Text>
                    </HStack>
                  </Th>
                  <Th py={6} borderBottom="1px solid" borderColor="gray.200">
                    <HStack>
                      <Box p={1} bg="blue.50" borderRadius="md">
                        <FiTag size="14" color="#3182CE" />
                      </Box>
                      <Text fontWeight="semibold">Kategoriya</Text>
                    </HStack>
                  </Th>
                  <Th py={6} borderBottom="1px solid" borderColor="gray.200">
                    <HStack>
                      <Box p={1} bg="green.50" borderRadius="md">
                        <FiDollarSign size={"14"} color="#38A169"/>
                      </Box>
                      <Text fontWeight="semibold">Narx</Text>
                    </HStack>
                  </Th>
                  <Th py={6} borderBottom="1px solid" borderColor="gray.200">
                    <HStack>
                      <Box p={1} bg="purple.50" borderRadius="md">
                        <FiMapPin size="14" color="#805AD5"/>
                      </Box>
                      <Text fontWeight="semibold">Shahar</Text>
                    </HStack>
                  </Th>
                  <Th py={6} borderBottom="1px solid" borderColor="gray.200">
                    <HStack>
                      <Box p={1} bg="orange.100" borderRadius="md">
                        <FiCalendar size="14" color="#DD6B20"/>
                      </Box>
                      <Text fontWeight="semibold">Sana</Text>
                    </HStack>
                  </Th>
                  <Th textAlign="center" py={6} borderBottom="1px solid" borderColor="gray.200">
                    <Text fontWeight="semibold">Amallar</Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentOrders.map((order, index) => (
                  <Tr 
                    key={order.id} 
                    _hover={{ 
                      bg: "blue.50", 
                      transform: "translateY(-1px)",
                      shadow: "md"
                    }}
                    transition="all 0.2s ease"
                  >
                    <Td py={6} px={6}>
                      <Image
                        w={'200px'}
                        h={'130px'}
                        minW={'180px'}
                        minH={'110px'}
                        flexShrink={0}
                        objectFit={'cover'}
                        src={order.image || "/Images/d-image.png"}
                        alt={order.title}
                        borderRadius="xl"
                        bg="gray.100"
                        icon={<FiImage size="24" />}
                        border="2px solid"
                        borderColor="gray.200"
                        _hover={{
                          borderColor: "blue.300",
                          shadow: "lg"
                        }}
                        transition="all 0.2s ease"
                        loading="lazy"
                        onClick={(e) => handleViewClick(order.slug, e)}
                        cursor="pointer"
                      />
                    </Td>
                    <Td py={6}>
                      <VStack align="start" spacing={2}>
                        <Text 
                          fontWeight="bold" 
                          fontSize="md"
                          color="blue.400"
                          _hover={{ 
                            textDecor: 'underline'
                           }}
                          noOfLines={2}
                          lineHeight="shorter"
                          onClick={(e) => handleViewClick(order.slug, e)}
                          cursor="pointer"
                        >
                          {order.title}
                        </Text>
                        <Badge
                          colorScheme={STATUS_COLORS[order.status]}
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          {ORDER_STATUSES[order.status]}
                        </Badge>
                      </VStack>
                    </Td>
                    <Td py={6}>
                      <Text 
                        fontWeight="medium" 
                        color="gray.600"
                        bg="gray.50"
                        px={3}
                        py={1}
                        borderRadius="lg"
                        fontSize="sm"
                      >
                        {order.category}
                      </Text>
                    </Td>
                    <Td py={6}>
                      <Text 
                        fontWeight="bold" 
                        color="green.600"
                        fontSize="lg"
                        bg="green.50"
                        px={3}
                        py={2}
                        borderRadius="lg"
                        textAlign="center"
                      >
                        {order.price}
                      </Text>
                    </Td>
                    <Td py={6}>
                      <HStack spacing={2}>
                        <Box
                          p={2}
                          bg="blue.50"
                          borderRadius="lg"
                        >
                          <FiMapPin color="#3182CE" size="16" />
                        </Box>
                        <Text fontWeight="medium" color="gray.700">
                          {order.city}
                        </Text>
                      </HStack>
                    </Td>
                    <Td py={6}>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium" color="gray.700">
                          {order.date}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {order.time || "10:29"}
                        </Text>
                      </VStack>
                    </Td>
                    <Td textAlign="center" py={6}>
                      {order.status !== "cancelled" ? (
                        <Box display={'flex'} gap={2} flexDir={'column'}>
                          <Tooltip label="Reklama qilish" hasArrow>
                            <Button
                              size="sm"
                              bgGradient={"linear(135deg, yellow.400, orange.400)"}
                              color={'white'}
                              fontWeight={600}
                              variant="solid"
                              borderRadius="xl"
                              onClick={(e) => handlePromotionButtonClick(order, e)}
                              _hover={{
                                transform: "translateY(-2px)",
                                shadow: "lg"
                              }}
                              transition="all 0.2s ease"
                            >
                              Promoshinovat
                            </Button>
                          </Tooltip>
                          <HStack>
                            <Tooltip label={"Statistika"} hasArrow>
                              <IconButton
                                icon={<FaChartLine />}
                                variant="ghost"
                                bg={"orange.100"}
                                size={'sm'}
                                flex={1}
                                onClick={() => navigate(`/profile/my-applications/statistic/${order.id}`)}
                                _hover={{
                                  transform: "translateY(-1px)",
                                  shadow: "md"
                                }}
                              />
                            </Tooltip>
                            <Tooltip label="Ko'rish" hasArrow>
                              <IconButton 
                                bg={'orange.100'} 
                                icon={<FiEye />} 
                                variant="ghost"
                                flex={1}
                                onClick={(e) => handleViewClick(order.slug, e)} 
                                size={'sm'}
                                _hover={{
                                  transform: "translateY(-1px)",
                                  shadow: "md"
                                }}
                              />
                            </Tooltip>
                            <Tooltip label="Tahrirlash" hasArrow>
                              <IconButton 
                                icon={<FiEdit3 />} 
                                variant="ghost" 
                                bg={'blue.100'}
                                color={'blue.400'}
                                colorScheme="blue"
                                flex={1}
                                onClick={(e) => handleEditClick(order)}
                                size={'sm'}
                                _hover={{
                                  transform: "translateY(-1px)",
                                  shadow: "md"
                                }}
                              />
                            </Tooltip>  
                            <Tooltip label={"Bekor qilish"} hasArrow>
                              <IconButton
                                icon={<FiTrash2 />}
                                variant="ghost"
                                color={"red"}
                                bg={"red.100"}
                                flex={1}
                                colorScheme={"red"}
                                onClick={(e) => handleActionClick("cancel", order, e)}
                                size={'sm'}
                                _hover={{
                                  transform: "translateY(-1px)",
                                  shadow: "md"
                                }}
                              />
                            </Tooltip>
                          </HStack> 
                        </Box>
                      ) : (
                        <Tooltip label="Tiklash" hasArrow>
                          <Button
                            size="sm"
                            colorScheme="green"
                            bg={"linear-gradient(135deg, #56ab2f, #a3e652)"}
                            variant="solid"
                            borderRadius="xl"
                            onClick={(e) => handleActionClick("restore", order, e)}
                            _hover={{
                              transform: "translateY(-2px)",
                              shadow: "lg"
                            }}
                            transition="all 0.2s ease"
                          >
                            Tiklash
                          </Button>
                        </Tooltip>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          
          <Box p={4} bg="gray.50" borderTop="1px solid" borderColor="gray.200">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />
          </Box>
        </CardBody>
      </Card>

      {/* Mobile Cards */}
      <VStack spacing={4} display={{ base: "flex", lg: "none" }}>
        {currentOrders.map((order) => (
          <Card 
            key={order.id} 
            w="100%" 
            borderRadius="2xl" 
            shadow="lg"
            border="1px solid"
            borderColor="gray.100"
            _hover={{
              shadow: "xl",
              transform: "translateY(-2px)",
              borderColor: "blue.200"
            }}
            transition="all 0.3s ease"
          >
            <CardBody p={{base: 4, custom570: 6}}>
              <VStack align="stretch" spacing={6}>
                {/* Header with Image and Title */}
                <HStack spacing={4} align="start">
                  <Image
                    w={{base: "150px", custom570: "180px"}}
                    h={{base: "110px", custom570: "130px"}}
                    minH={{base: '110px', custom570: '130px'}}
                    minW={{base: '140px', custom570: '160px'}}
                    flexShrink={0}
                    src={order.image || "/Images/d-image.png"}
                    alt={order.title}
                    objectFit="cover"
                    borderRadius="xl"
                    bg="gray.100"
                    border="2px solid"
                    borderColor="gray.200"
                    loading="lazy"
                    onClick={(e) => handleViewClick(order.slug, e)}
                  />
                  
                  <VStack align="start" spacing={2} flex="1">
                    <Text 
                      fontWeight="bold" 
                      fontSize="lg"
                      color="gray.800"
                      noOfLines={4}
                      lineHeight="shorter"
                    >
                      {order.title}
                    </Text>
                    <Badge
                      colorScheme={STATUS_COLORS[order.status]}
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      {ORDER_STATUSES[order.status]}
                    </Badge>
                  </VStack>
                </HStack>

                <Divider />

                {/* Details Grid */}
                <SimpleGrid columns={2} spacing={4}>
                  <VStack align="start" spacing={2}>
                    <HStack spacing={2}>
                      <Box p={1} bg="blue.50" borderRadius="md">
                        <FiTag size="14" color="#3182CE" />
                      </Box>
                      <Text color="gray.500" fontSize="sm" fontWeight="medium">
                        Kategoriya
                      </Text>
                    </HStack>
                    <Text 
                      fontWeight="semibold"
                      bg="gray.50"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="sm"
                    >
                      {order.category}
                    </Text>
                  </VStack>
                  
                  <VStack align="start" spacing={2}>
                    <HStack spacing={2}>
                      <Box p={1} bg="green.50" borderRadius="md">
                        <FiDollarSign size="14" color="#38A169" />
                      </Box>
                      <Text color="gray.500" fontSize="sm" fontWeight="medium">
                        Narx
                      </Text>
                    </HStack>
                    <Text 
                      fontWeight="bold" 
                      color="green.600"
                      bg="green.50"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="sm"
                    >
                      {order.price}
                    </Text>
                  </VStack>
                  
                  <VStack align="start" spacing={2}>
                    <HStack spacing={2}>
                      <Box p={1} bg="purple.50" borderRadius="md">
                        <FiMapPin size="14" color="#805AD5" />
                      </Box>
                      <Text color="gray.500" fontSize="sm" fontWeight="medium">
                        Shahar
                      </Text>
                    </HStack>
                    <Text fontWeight="semibold">{order.city}</Text>
                  </VStack>
                  
                  <VStack align="start" spacing={2}>
                    <HStack spacing={2}>
                      <Box p={1} bg="orange.100" borderRadius="md">
                        <FiCalendar size="14" color="#DD6B20" />
                      </Box>
                      <Text color="gray.500" fontSize="sm" fontWeight="medium">
                        Sana
                      </Text>
                    </HStack>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold">{order.date}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {order.time || "10:29"}
                      </Text>
                    </VStack>
                  </VStack>
                </SimpleGrid>

                {/* Description */}
                {order.description && (
                  <Box bg="gray.50" p={4} borderRadius="xl" border="1px solid" borderColor="gray.200">
                    <Text color="gray.500" fontSize="sm" mb={2} fontWeight="medium">
                      Tavsif
                    </Text>
                    <Text fontSize="sm" color="gray.700" lineHeight="tall">
                      {order.description}
                    </Text>
                  </Box>
                )}

                {/* Actions */}
                {order.status !== "cancelled" ? (
                  <VStack spacing={3} align="stretch">
                    <Button
                      bgGradient={"linear(135deg, yellow.400, orange.400)"}
                      color={'white'}
                      fontWeight={600}
                      borderRadius="xl"
                      onClick={(e) => handlePromotionButtonClick(order, e)}
                      _hover={{
                        transform: "translateY(-1px)",
                        shadow: "md"
                      }}
                    >
                      Promoshinovat
                    </Button>
                    
                    <HStack spacing={2}>
                      <Tooltip label="Statistika" hasArrow>
                        <IconButton
                          icon={<FaChartLine />}
                          bg="orange.100"
                          color="orange.600"
                          flex="1"
                          borderRadius="xl"
                          onClick={() => navigate(`/profile/my-applications/statistic/${order.id}`)}
                          _hover={{
                            transform: "translateY(-1px)",
                            shadow: "md"
                          }}
                        />
                      </Tooltip>
                      
                      <Tooltip label="Ko'rish" hasArrow>
                        <IconButton
                          icon={<FiEye />}
                          bg="orange.100"
                          color="orange.600"
                          flex="1"
                          borderRadius="xl"
                          onClick={(e) => handleViewClick(order.slug, e)}
                          _hover={{
                            transform: "translateY(-1px)",
                            shadow: "md"
                          }}
                        />
                      </Tooltip>
                      
                      <Tooltip label="Tahrirlash" hasArrow>
                        <IconButton
                          icon={<FiEdit3 />}
                          bg="blue.100"
                          color="blue.400"
                          flex="1"
                          borderRadius="xl"
                          onClick={(e) => handleEditClick(order)}
                          _hover={{
                            transform: "translateY(-1px)",
                            shadow: "md"
                          }}
                        />
                      </Tooltip>
                      
                      <Tooltip label="Bekor qilish" hasArrow>
                        <IconButton
                          icon={<FiTrash2 />}
                          bg="red.100"
                          color="red.600"
                          flex="1"
                          borderRadius="xl"
                          onClick={(e) => handleActionClick("cancel", order, e)}
                          _hover={{
                            transform: "translateY(-1px)",
                            shadow: "md"
                          }}
                        />
                      </Tooltip>
                    </HStack>
                  </VStack>
                ) : (
                  <Button
                    colorScheme="green"
                    bg={"linear-gradient(135deg, #56ab2f, #a3e652)"}
                    leftIcon={<FiRotateCcw />}
                    borderRadius="xl"
                    onClick={(e) => handleActionClick("restore", order, e)}
                    _hover={{
                      transform: "translateY(-1px)",
                      shadow: "md"
                    }}
                  >
                    Tiklash
                  </Button>
                )}
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