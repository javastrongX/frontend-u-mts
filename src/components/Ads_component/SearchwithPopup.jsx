import { useState, useEffect } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { IoMdSearch } from "react-icons/io";
import { useTranslation } from "react-i18next";



export default function SearchWithPopup({ data, search, setSearch }) {
//   const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (search.trim().length > 0) {
      const filtered = data.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      );
      setResults(filtered);
      setShowPopup(true);
    } else {
      setResults([]);
      setShowPopup(false);
    }
  }, [search]);

  const handleSelect = (item) => {
    setSearch(item);
    setShowPopup(false);
  };

  return (
    <Box position="relative" maxW="lg" w="100%">
      <InputGroup>
        <InputLeftElement fontSize={'20px'} color={'black.60'} pointerEvents="none">
          <IoMdSearch />
        </InputLeftElement>
        <Input
          placeholder={t("search.placeholder", "Что нужно найти?")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="white"
          border="1px"
          borderColor="gray.300"
          borderRadius="lg"
          _focus={{
            ring: 2,
            ringColor: "orange.50",
            borderColor: "transparent"
            }}
        />
      </InputGroup>

      {/* Popup result list */}
      {showPopup && results.length > 0 && (
        <Box
          position="absolute"
          bg="white"
          mt="1"
          w="100%"
          boxShadow="md"
          borderRadius="md"
          zIndex="999"
        >
          <List spacing={0}>
            {results.map((item, index) => (
              <ListItem
                key={index}
                px="4"
                py="2"
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => handleSelect(item)}
              >
                <Text>{item}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}
