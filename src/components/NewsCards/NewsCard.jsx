import { Box, Image, Text, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewsCard = ({ image, title, subtitle, description, slug }) => {
  const [imgSrc, setImgSrc] = useState(image || "/Images/d-image.png");
  const navigate = useNavigate()
  return (
    <Box
      bg="black.0"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      maxW="sm"
      _hover={{ boxShadow: "md", transform: "scale(1.05)" }}
      transition={'0.2s all'}
      cursor="pointer"
      onClick={() => navigate(slug)}
    >
      <Box position="relative">
        <Image src={imgSrc} alt={title} objectFit="cover" h="160px" w="full" />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          w="full"
          bg="linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))"
          color="black.0"
          px={3}
          py={2}
          onError={() => setImgSrc("/Images/d-image.png")}
        >
          <Heading size="sm">{title}</Heading>
          <Text fontSize="xs">{subtitle}</Text>
        </Box>
      </Box>
      <Box px={3} py={2}>
        <Text fontSize="sm" noOfLines={2}>{description}</Text>
      </Box>
    </Box>
  );
};

export default NewsCard;
