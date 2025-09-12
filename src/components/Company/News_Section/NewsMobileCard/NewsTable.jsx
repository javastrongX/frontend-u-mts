import {
  Box,
  HStack,
  IconButton,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Table,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const NewsTable = ({ formattedNews, handleEdit, confirmDelete }) => {
  const { t } = useTranslation();
  // Scrollbar styles
  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "10px",
    },
    "&::-webkit-scrollbar-track": {
      background: useColorModeValue("#f1f1f1", "#2d3748"),
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#fed500",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#ffd000",
    },
    // Firefox uchun
    scrollbarWidth: "auto",
    scrollbarColor: "#fed500 " + useColorModeValue("#f1f1f1", "#2d3748"),
  };

  return (
    <Box
      display={{ base: "none", lg: "block" }}
      overflowX="auto"
      sx={{
        ...scrollbarStyles,
        "& .chakra-tabs__tab": {
          flex: { base: "none", lg: "initial" },
        },
      }}
      bg="white"
      borderRadius="lg"
      shadow="sm"
    >
      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr borderBottom={"2px solid"} borderColor={"gray.100"}>
            <Th>{t("Business_mode.News_Section.table.photo", "Фото")}</Th>
            <Th>{t("Business_mode.News_Section.table.title", "Заголовок")}</Th>
            <Th>{t("Business_mode.News_Section.table.shortDescription", "Краткое описание")}</Th>
            <Th>{t("Business_mode.News_Section.table.tags", "Теги")}</Th>
            <Th>{t("Business_mode.News_Section.table.date", "Дата")}</Th>
            <Th>{t("Business_mode.News_Section.table.actions", "Действия")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {formattedNews.map((item) => (
            <Tr
              key={item.id}
              _hover={{ bg: "gray.50" }}
              borderBottom={"2px solid"}
              borderColor={"gray.100"}
            >
              <Td>
                <Image
                  src={item.image}
                  alt={item.title}
                  minW={"130px"}
                  minH={"80px"}
                  w="130px"
                  h="80px"
                  objectFit="cover"
                  borderRadius="md"
                  fallbackSrc="/Images/d-image.png"
                />
              </Td>
              <Td maxW="200px" minW={"200px"}>
                <Text fontSize={"sm"} fontWeight="medium" noOfLines={4}>
                  {item.title}
                </Text>
              </Td>
              <Td maxW="250px" minW={"200px"}>
                <Popover>
                  <PopoverTrigger>
                    <Text fontSize="sm" color="gray.600" noOfLines={4}>
                      {item.shortDescription}
                    </Text>
                  </PopoverTrigger>
                  <PopoverContent
                    bg={"#ffffff81"}
                    backdropFilter={"blur(10px)"}
                  >
                    <PopoverArrow />
                    <PopoverHeader pt={6}>
                      <PopoverCloseButton />
                    </PopoverHeader>
                    <PopoverBody>{item.shortDescription}</PopoverBody>
                  </PopoverContent>
                </Popover>
              </Td>
              <Td maxW="200px" minW={"180px"}>
                <Wrap spacing={1}>
                  {item.tags.slice(0, 3).map((tag) => (
                    <WrapItem key={tag}>
                      <Tooltip
                        label={tag}
                        hasArrow
                        borderRadius={"full"}
                        px={3}
                        py={1}
                      >
                        <Tag size="sm" bg="#fed500" color="black">
                          <TagLabel>{tag}</TagLabel>
                        </Tag>
                      </Tooltip>
                    </WrapItem>
                  ))}
                  {item.tags.length > 3 && (
                    <WrapItem pointerEvents={"none"}>
                      <Tag size="sm" variant="outline">
                        <TagLabel>+{item.tags.length - 3}</TagLabel>
                      </Tag>
                    </WrapItem>
                  )}
                </Wrap>
              </Td>
              <Td maxW={"200px"} minW={"140px"}>
                <Text fontSize="sm" whiteSpace={"nowrap"} color="gray.600">
                  {item.formattedDate}
                </Text>
              </Td>
              <Td minW={"140px"} maxW={"200px"}>
                <HStack spacing={2}>
                  <Tooltip
                    label={t("Business_mode.News_Section.table.edit", "Редактировать")}
                    hasArrow
                    px={4}
                    py={1}
                    borderRadius={"full"}
                  >
                    <IconButton
                      icon={<FiEdit2 />}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      bg="blue.100"
                      color="blue.400"
                      _hover={{
                        bg: "blue.100",
                        transform: "scale(1.05)",
                      }}
                      borderRadius="full"
                      onClick={() => handleEdit(item)}
                      transition="all 0.2s ease"
                      aria-label="Edit news item"
                    />
                  </Tooltip>
                  <Tooltip
                    label={t("Business_mode.News_Section.delete", "Удалить")}
                    hasArrow
                    px={4}
                    py={1}
                    borderRadius={"full"}
                  >
                    <IconButton
                      icon={<FiTrash2 />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      bg="red.100"
                      color="red.600"
                      _hover={{
                        bg: "red.100",
                        transform: "scale(1.05)",
                      }}
                      borderRadius="full"
                      onClick={() => confirmDelete(item.id)}
                      transition="all 0.2s ease"
                      aria-label="Delete news item"
                    />
                  </Tooltip>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default NewsTable;
