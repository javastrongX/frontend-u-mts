import { Box } from "@chakra-ui/react";
import TypesBlock from "./TypesBlock";
import CitiesBlock from "./CitiesBlock";
import BrandsBlock from "./BrandsBlock";

const MainCategories = () => {
  return (
    <Box px={4} py={5} gap={10} display={'flex'} flexDir={'column'}>
      <TypesBlock />
      <CitiesBlock />
      <BrandsBlock />
    </Box>
  );
};

export default MainCategories;
