
import { Flex, Button } from '@chakra-ui/react';

const TabNavigation = ({ tabLabels, activeTab, onTabChange, onPageChange = () => {} }) => {
  return (
    <Flex wrap="wrap" gap={2} mb={6}>
      {tabLabels.map((label, index) => (
        <Button
          key={label}
          onClick={() => {onTabChange(index), onPageChange(1)}}
          p={2}
          fontSize="14px"
          borderRadius="lg"
          fontWeight="medium"
          bg={activeTab === index ? "orange.50" : "white"}
          color={activeTab === index ? "black" : "gray.700"}
          border="none"
          _hover={{
            bg: activeTab === index ? "orange.150" : "orange.50"
          }}
          boxShadow={activeTab === index ? "sm" : "none"}
        >
          {label}
        </Button>
      ))}
    </Flex>
  );
};

export default TabNavigation;
