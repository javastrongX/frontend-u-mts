import { Box, Text, Heading } from "@chakra-ui/react";

const PromoBlock = () => (
  <Box
    p={6}
    bgGradient="linear(to-br, blue.400, teal.400)"
    color="white"
    borderRadius="xl"
    shadow="lg"
    display={{ base: "none", xl: "block" }}
  >
    <Heading size="md" mb={2}>Reklama</Heading>
    <Text fontSize="sm">
      Sizning reklamangiz shu yerda bo‘lishi mumkin!
    </Text>
  </Box>
);

export default PromoBlock;
