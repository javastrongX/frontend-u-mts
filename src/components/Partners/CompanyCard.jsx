import { Box, Text, Heading, Stack, Badge, Avatar, Wrap, WrapItem } from "@chakra-ui/react";

const CompanyCard = ({ company }) => (
  <Box
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    bg="white"
    shadow="md"
    transition="all 0.2s"
    _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
    p={5}
    h="100%"
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
  >
    <Stack spacing={3}>
      <Stack direction="row" align="center" spacing={3}>
        <Avatar src={company.avatar} name={company.name} size="lg" />
        <Box>
          <Heading size="md">{company.name}</Heading>
          <Text color="gray.500" fontSize="sm">{company.city?.title}</Text>
        </Box>
      </Stack>
      {company.specializations && company.specializations.length > 0 && (
        <Wrap mt={2}>
          {company.specializations.slice(0, 4).map(spec => (
            <WrapItem key={spec.id}>
              <Badge colorScheme="blue" fontSize="0.8em">{spec.title}</Badge>
            </WrapItem>
          ))}
          {company.specializations.length > 4 && (
            <WrapItem>
              <Badge colorScheme="gray" fontSize="0.8em">
                +{company.specializations.length - 4} boshqalar
              </Badge>
            </WrapItem>
          )}
        </Wrap>
      )}
      {company.is_official && (
        <Badge colorScheme="green" mt={2}>Rasmiy hamkor</Badge>
      )}
    </Stack>
    <Text color="gray.400" fontSize="xs" mt={4}>
      {new Date(company.created_at).toLocaleDateString("ru-RU")}
    </Text>
  </Box>
);

export default CompanyCard;
