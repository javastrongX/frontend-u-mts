import React from 'react';
import {
  Card,
  CardBody,
  Image,
  Heading,
  Text,
  Flex,
  HStack,
  Box,
  IconButton,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  Icon
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';

const NewsCard = ({ item, onEdit, onDelete }) => {
  return (
    <Card 
      shadow="lg" 
      borderWidth="0" 
      borderRadius="xl" 
      overflow="hidden"
      bg="white"
      _hover={{
        transform: "translateY(-2px)",
        shadow: "xl",
        transition: "all 0.3s ease"
      }}
      transition="all 0.3s ease"
    >
      <Box position="relative">
        {/* Image with gradient overlay */}
        <Image
          src={item.image}
          alt={item.title}
          w="100%"
          h={{ base: "200px", sm: "230px", custom570: "200px" }}
          objectFit="cover"
          fallbackSrc="/Images/d-image.png"
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient="linear(to-t, blackAlpha.400, transparent)"
          borderTopRadius="xl"
        />
        
        {/* Tags overlay on image */}
        <Box position="absolute" top="3" left="3">
          <Wrap spacing={1}>
            {item.tags.slice(0, 2).map(tag => (
              <WrapItem key={tag}>
                <Tag 
                  size="sm" 
                  bg="rgba(254, 213, 0, 0.95)" 
                  color="black"
                  backdropFilter="blur(10px)"
                  borderRadius="full"
                  fontWeight="600"
                  fontSize="xs"
                >
                  <TagLabel>{tag}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
            {item.tags.length > 2 && (
              <WrapItem>
                <Tag 
                  size="sm" 
                  bg="rgba(255, 255, 255, 0.9)"
                  color="gray.700"
                  backdropFilter="blur(10px)"
                  borderRadius="full"
                  fontWeight="600"
                  fontSize="xs"
                >
                  <TagLabel>+{item.tags.length - 2}</TagLabel>
                </Tag>
              </WrapItem>
            )}
          </Wrap>
        </Box>
      </Box>

      <CardBody p="0" display="flex" flexDirection="column" minH="200px">
        {/* Content area - flex grow to push footer down */}
        <Box p={4} flex="1">
          {/* Title */}
          <Heading 
            size="md" 
            noOfLines={2} 
            color="gray.800"
            lineHeight="1.3"
            mb={3}
            fontWeight="700"
          >
            {item.title}
          </Heading>

          {/* Description */}
          <Text 
            fontSize="sm" 
            color="gray.600" 
            noOfLines={5}
            lineHeight="1.5"
          >
            {item.shortDescription}
          </Text>
        </Box>

        {/* Footer - always at bottom */}
        <Box
          px={4}
          py={2}
          borderTop="1px solid"
          borderColor="gray.100"
          bg="gray.50"
        >
          <Flex justify="space-between" align="center">
            <Text 
              fontSize="xs" 
              color="gray.500"
              fontWeight="500"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Icon as={FiClock} />
              {item.formattedDate}
            </Text>
            
            <HStack spacing={2}>
              <IconButton
                icon={<FiEdit2 />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
                bg="blue.100"
                color="blue.400"
                _hover={{
                  bg: "blue.100",
                  transform: "scale(1.05)"
                }}
                borderRadius="full"
                onClick={() => onEdit(item)}
                transition="all 0.2s ease"
                aria-label="Edit news item"
              />
              <IconButton
                icon={<FiTrash2 />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                bg="red.100"
                color="red.600"
                _hover={{
                  bg: "red.100",
                  transform: "scale(1.05)"
                }}
                borderRadius="full"
                onClick={() => onDelete(item.id)}
                transition="all 0.2s ease"
                aria-label="Delete news item"
              />
            </HStack>
          </Flex>
        </Box>
      </CardBody>
    </Card>
  );
};

export default NewsCard;