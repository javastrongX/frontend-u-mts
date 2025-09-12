import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MdOutlineSearch } from "react-icons/md";
import { useEffect, useState } from "react";
// import axios from "axios";

const Category = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);

  // Test uchun mock ma'lumotlar
  const mockData = [
    { name: "Ekskavator", link: "/ads/12" },
    { name: "Buldozer", link: "/ads/13" },
    { name: "Traktor", link: "/ads/14" },
    { name: "Yuk mashinasi", link: "/ads/15" },
  ];

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (timer) clearTimeout(timer);

    const newTimer = setTimeout(() => {
      setLoading(true);

      // --- Real API ---
      // axios
      //   .get(`/api/search?q=${query}`)
      //   .then((res) => {
      //     setSuggestions(res.data); // Masalan: [{ name: "Ekskavator", link: "/ads/12" }, ...]
      //   })
      //   .catch((err) => {
      //     console.error("Qidiruvda xatolik:", err);
      //   })
      //   .finally(() => {
      //     setLoading(false);
      //   });

      // --- Mock test uchun ishlatish ---
      const filtered = mockData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setLoading(false);
    }, 400);

    setTimer(newTimer);
  }, [query]);

  const handleSuggestionClick = (item) => {
    window.location.href = item.link;
  };
  return (

      <Box w="100%" maxW={{base: "100%", custom900: "500px"}} position="relative">
        <InputGroup w="100%" mt={{base: 0, custom900: 3}}>
          <InputLeftElement pointerEvents="none" fontSize="20px">
            <Icon as={MdOutlineSearch} color="black.60" />
          </InputLeftElement>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            bg={'black.0'}
            borderColor="black.20"
            _focus={{ borderColor: "orange.50", boxShadow: "0 0 0 1px orange.50" }}
            _focusVisible={{ outline: "none" }}
            _hover={{ borderColor: "black.60" }}
          />
          {loading && <Spinner size="sm" position="absolute" top="14px" right="10px" />}
        </InputGroup>

        {suggestions.length > 0 && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            zIndex={20}
            mt={1}
            borderRadius="md"
            boxShadow="md"
          >
            <List spacing={0}>
              {suggestions.map((item, idx) => (
                <ListItem
                  key={idx}
                  px={4}
                  py={2}
                  _hover={{ bg: "black.10", cursor: "pointer" }}
                  onClick={() => handleSuggestionClick(item)}
                >
                  {item.name}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>

  )
}

export default Category