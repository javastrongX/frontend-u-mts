
import { Button } from '@chakra-ui/react';

const FilterButtons = ({ visibleItems, selectedList, category, onToggle }) => {
  const selected = selectedList[0];
  const filteredItems = visibleItems.filter(item => item !== selected);
  const orderedItems = selected ? [selected, ...filteredItems] : visibleItems;

  return orderedItems.map((item) => (
    <Button
      key={item}
      onClick={() => onToggle(category, item)}
      size="sm"
      px={3}
      py={1}
      borderRadius="md"
      fontWeight="500"
      fontSize="sm"
      border="1px"
      bg={selected === item ? "yellow.400" : "white"}
      borderColor={selected === item ? "yellow.400" : "gray.300"}
      color={selected === item ? "black" : "gray.700"}
      _hover={{
        borderColor: selected === item ? "yellow.5" : "yellow.400"
      }}
    >
      {item}
    </Button>
  ));
};

export default FilterButtons;
