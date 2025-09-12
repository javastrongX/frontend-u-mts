import { Box, Select, Heading } from "@chakra-ui/react";

const CompanyFilter = ({ filters, setFilters, cities }) => (
  <Box p={4} bg="gray.50" borderRadius="md" shadow="sm">
    <Heading size="sm" mb={3}>Filtrlar</Heading>
    <Select
      placeholder="Shaharni tanlang"
      value={filters.cityId || ""}
      onChange={e => setFilters(f => ({ ...f, cityId: e.target.value }))}
      mb={2}
    >
      {cities.map(city => (
        <option key={city.id} value={city.id}>{city.title}</option>
      ))}
    </Select>
  </Box>
);

export default CompanyFilter;
