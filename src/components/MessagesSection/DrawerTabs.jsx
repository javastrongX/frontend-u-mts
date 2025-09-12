import { useRef } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Collapse,
  useDisclosure,
  useOutsideClick
} from '@chakra-ui/react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import DateSection from './DateSection';
import { DateSectionSkeleton } from './skeletons/Skeletons';
import { useTranslation } from 'react-i18next';

const DrawerTabs = ({
  activeTab,
  isTabLoading,
  handleTabChange,
  ordersData,
  tabsConfig
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const dropdownRef = useRef();
  const { t } = useTranslation();
  // Tashqarida bosilganda yopish
  useOutsideClick({
    ref: dropdownRef,
    handler: onClose,
  });

  const activeTabConfig = tabsConfig[activeTab];
  const ActiveIcon = activeTabConfig?.icon;

  const handleOptionSelect = (index) => {
    handleTabChange(index);
    onClose();
  };

  return (
    <Box position="relative" w="100%" mb="6">
      {/* Select Button */}
      <Button
        onClick={onToggle}
        w="100%"
        h="auto"
        p="4"
        bg="white"
        border="2px solid"
        borderColor={isOpen ? "blue.500" : "gray.200"}
        borderRadius="xl"
        _hover={{
          borderColor: "blue.300",
          transform: "translateY(-1px)",
          shadow: "md"
        }}
        _active={{
          transform: "translateY(0px)"
        }}
        transition="all 0.2s"
        justifyContent="space-between"
        alignItems="center"
        display="flex"
      >
        <HStack spacing="3">
          {ActiveIcon && (
            <Box 
              as={ActiveIcon} 
              size="20px" 
              color="blue.500"
            />
          )}
          <Text 
            fontSize="md" 
            fontWeight="600" 
            color="gray.700"
          >
            {activeTabConfig?.label}
          </Text>
        </HStack>
        
        <Box as={isOpen ? IoChevronUp : IoChevronDown} size="20px" color="gray.500" />
      </Button>

      {/* Dropdown Menu */}
      <Box ref={dropdownRef} position="relative" zIndex="dropdown">
        <Collapse in={isOpen}>
          <Box
            mt="2"
            bg="white"
            border="2px solid"
            borderColor="gray.200"
            borderRadius="xl"
            shadow="xl"
            overflow="hidden"
          >
            {tabsConfig.map((tab, index) => {
              const IconComponent = tab.icon;
              const isActive = index === activeTab;
              
              return (
                <Button
                  key={tab.key}
                  onClick={() => handleOptionSelect(index)}
                  w="100%"
                  h="auto"
                  p="4"
                  bg={isActive ? "blue.50" : "white"}
                  borderRadius="none"
                  borderBottom={index < tabsConfig.length - 1 ? "1px solid" : "none"}
                  borderBottomColor="gray.100"
                  _hover={{
                    bg: isActive ? "blue.100" : "gray.50"
                  }}
                  _active={{
                    bg: isActive ? "blue.200" : "gray.100"
                  }}
                  justifyContent="flex-start"
                  transition="all 0.2s"
                >
                  <HStack spacing="3" w="100%">
                    <Box 
                      as={IconComponent} 
                      size="18px" 
                      color={isActive ? "blue.500" : "gray.500"}
                    />
                    <Text 
                      fontSize="sm" 
                      fontWeight={isActive ? "600" : "500"}
                      color={isActive ? "blue.700" : "gray.700"}
                    >
                      {tab.label}
                    </Text>
                    {isActive && (
                      <Box
                        ml="auto"
                        w="2"
                        h="2"
                        bg="blue.500"
                        borderRadius="full"
                      />
                    )}
                  </HStack>
                </Button>
              );
            })}
          </Box>
        </Collapse>
      </Box>

      {/* Content Area */}
      <Box mt="6">
        {activeTab === 0 ? (
          // Birinchi tab uchun - orders data
          isTabLoading ? (
            <VStack spacing="6" align="stretch">
              {[1, 2, 3].map((item) => (
                <DateSectionSkeleton key={item} />
              ))}
            </VStack>
          ) : (
            <VStack spacing="6" align="stretch">
              {Object.entries(ordersData).map(([date, orders]) => (
                <DateSection key={date} date={date} orders={orders} />
              ))}
            </VStack>
          )
        ) : (
          // Boshqa tablar uchun - placeholder content
          isTabLoading ? (
            <Box
              bg="white"
              borderRadius="xl"
              border="2px dashed"
              borderColor="gray.200"
              p="20"
            >
              <VStack spacing="4">
                <Box as={activeTabConfig.icon} size="48px" color="gray.400" />
                <Text color="gray.500">Loading...</Text>
              </VStack>
            </Box>
          ) : (
            <Box
              textAlign="center"
              py="20"
              color="gray.500"
              bg="white"
              borderRadius="xl"
              border="2px dashed"
              borderColor="gray.200"
            >
              <Box as={activeTabConfig.icon} size="48px" mx="auto" mb="4" color="gray.400" />
              <Text fontSize="lg" fontWeight="600" mb="2" color="gray.600">
                {activeTabConfig.label}
              </Text>
              <Text color="gray.500">
                {t("DrawerTabs.no_data", "У вас пока нет сообщений.")}
              </Text>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default DrawerTabs;