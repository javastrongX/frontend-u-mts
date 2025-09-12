import { Badge, Card, CardBody, Divider, Flex, Heading, HStack, Icon, IconButton, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import React from "react";
import { FiEdit2, FiMail, FiMapPin, FiPhone, FiTrash2, FiUser } from "react-icons/fi";
import { LuBuilding2 as FiBuilding } from "react-icons/lu";






// Invoice card component
export const InvoiceCard = React.memo(({ invoice, onEdit, onDelete }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius={'md'}
      _hover={{
        transform: "translateY(-2px)",
        transition: "all 0.2s",
      }}
      transition="all 0.2s"
    >
      <CardBody>
        <Flex justify="space-between" align="start" mb={3}>
          <VStack align="start" spacing={1}>
            <HStack>
              <Icon
                as={invoice.type === "individual" ? FiUser : FiBuilding}
                color="#fed500"
              />
              <Heading size="sm" color="gray.800">
                {invoice.companyName}
              </Heading>
              <Badge
                colorScheme={invoice.type === "individual" ? "blue" : "green"}
                variant="subtle"
              >
                {invoice.type === "individual" ? "IP" : "YuL"}
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              {invoice.type === "individual" ? "INN" : "STIR"}: {invoice.tin}
            </Text>
          </VStack>
          <Badge colorScheme="green" variant="outline" borderRadius={'md'} px={2} py={"1px"}>
            Faol
          </Badge>
        </Flex>

        <VStack align="start" spacing={2} mb={4}>
          <HStack>
            <Icon as={FiMapPin} color="gray.500" boxSize={4} />
            <Text fontSize="sm" color="gray.600">
              {invoice.address}
            </Text>
          </HStack>
          <HStack>
            <Icon as={FiMail} color="gray.500" boxSize={4} />
            <Text fontSize="sm" color="gray.600">
              {invoice.email}
            </Text>
          </HStack>
          <HStack>
            <Icon as={FiPhone} color="gray.500" boxSize={4} />
            <Text fontSize="sm" color="gray.600">
              {invoice.phone}
            </Text>
          </HStack>
        </VStack>

        <Divider mb={3} />

        <Flex justify="space-between" align="center">
          <Text fontSize="xs" color="gray.500">
            Yaratilgan:{" "}
            {new Date(invoice.createdAt).toLocaleDateString("uz-UZ")}
          </Text>
          <HStack spacing={2}>
            <IconButton
              aria-label="Tahrirlash"
              icon={<FiEdit2 />}
              borderRadius={'full'}
              size="sm"
              variant="ghost"
              colorScheme="blue"
              color={'blue.400'}
              _hover={{
                bg: 'blue.600'
              }}
              bg={'blue.600'}
              onClick={() => onEdit(invoice)}
            />
            <IconButton
              aria-label="O'chirish"
              icon={<FiTrash2 />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              _hover={{
                bg: "red.100"
              }}
              borderRadius={'full'}
              bg={'red.100'}
              onClick={() => onDelete(invoice.id)}
            />
          </HStack>
        </Flex>
      </CardBody>
    </Card>
  );
});

InvoiceCard.displayName = "InvoiceCard";