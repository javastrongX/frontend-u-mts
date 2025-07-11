import { Box, Heading, SimpleGrid, Link, Text } from "@chakra-ui/react";

const CategoryBlock = ({ title, items }) => {
  return (
    <Box>
      <Heading as="h3" fontSize="22px" mb={4}>{title}</Heading>
      <SimpleGrid columns={[2, 3, 4, 5]} spacing={3} whiteSpace={'nowrap'}>
        {items.map((item, index) => (
          <Link key={index} _hover={{color: 'orange.200'}} href={item.href} color="blue.400" fontSize="12px">
            {item.label}{" "}
            <Text as="span" color="gray.500">
              ({item.count})
            </Text>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CategoryBlock;
