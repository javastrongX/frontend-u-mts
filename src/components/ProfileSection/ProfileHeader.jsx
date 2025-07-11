import { 
  Avatar, 
  Box, 
  Button, 
  Card, 
  CardBody, 
  Flex, 
  HStack, 
  IconButton, 
  Menu, 
  MenuButton, 
  MenuDivider, 
  MenuItem, 
  MenuList, 
  Text, 
  useBreakpointValue, 
  useColorModeValue, 
  useToast, 
  VStack
} from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { 
  FiBell, 
  FiChevronDown, 
  FiLogOut, 
  FiMenu, 
  FiPlus, 
  FiSettings, 
  FiShoppingCart, 
  FiUser 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const ProfileHeader = ({ onMenuOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  
  const isMobile = useBreakpointValue({ base: true, custom900: false });
  
  // Enhanced colors with yellow-orange theme
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBg = useColorModeValue('orange.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  const handleNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return (
    <Card 
      mb={6} 
      boxShadow="xl" 
      borderRadius="2xl" 
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
    >
      <CardBody p={{base: 5, md: 6}}>
        <Flex align="center" wrap="wrap" gap={4} justify={'space-between'}>
          
          {/* Left Section - Title and Mobile Menu */}
          <HStack spacing={4} w={{base: '100%', xl: '25%'}} justify={'space-between'}>
            <HStack>
              {isMobile && (
                <IconButton
                  icon={<FiMenu />}
                  variant="ghost"
                  onClick={onMenuOpen}
                  size="lg"
                  borderRadius="xl"
                  _hover={{ bg: hoverBg }}
                  transition="all 0.2s ease"
                />
              )}
              <Button
                onClick={() => handleNavigation('/business')}
                size={{ base: 'sm', md: 'md' }}
                bg={"#fed500"}
                borderRadius="xl"
                border={"1px solid"}
                borderColor={"transparent"}
                _hover={{ bg: "orange.100", borderColor: "#fed500" }}
                transition="all 0.2s ease"
                fontWeight={"600"}
              >
                Стать партнером
              </Button>
            </HStack>

            {/* Mobile User Menu */}
            <Box display={{base: "block", custom1130: "none"}}>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<FiChevronDown />}
                  variant="ghost"
                  size={{ base: 'sm', md: 'md' }}
                  borderRadius="xl"
                  _hover={{ bg: "gray.100" }}
                  transition="all 0.2s ease"
                >
                  <HStack spacing={3}>
                    <Avatar 
                      size="sm" 
                      // name="Gaybullayev Jorabek"
                      src=""
                      border="2px solid"
                      borderColor="#fed500"
                    />
                    {!isMobile && (
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                          Gaybullayev Jorabek
                        </Text>
                        <Text fontSize="xs" color={mutedTextColor}>
                          Alisher ogli
                        </Text>
                      </VStack>
                    )}
                  </HStack>
                </MenuButton>
                <MenuList 
                  borderRadius="xl" 
                  boxShadow="2xl"
                  border="1px solid"
                  borderColor={borderColor}
                  bg={bgColor}
                >
                  <MenuItem 
                    onClick={() => handleNavigation('/profile')} 
                    icon={<FiUser />} 
                    borderRadius="lg"
                    _hover={{ bg: hoverBg }}
                    transition="all 0.2s ease"
                  >
                    Мой профиль
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleNavigation('/profile/settings')} 
                    icon={<FiSettings />} 
                    borderRadius="lg"
                    _hover={{ bg: hoverBg }}
                    transition="all 0.2s ease"
                  >
                    Настройки
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleNavigation('/profile/notifications')} 
                    icon={<FiBell />} 
                    borderRadius="lg"
                    _hover={{ bg: hoverBg }}
                    transition="all 0.2s ease"
                  >
                    Уведомления
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem 
                    onClick={() => handleNavigation('/logout')} 
                    icon={<FiLogOut />} 
                    color="red.500" 
                    borderRadius="lg"
                    _hover={{ bg: 'red.50', color: 'red.600' }}
                    transition="all 0.2s ease"
                  >
                    Выйти
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </HStack>

          {/* Right Section - Actions and Desktop User Menu */}
          <HStack spacing={3} wrap="wrap" display={{base: 'none', custom1130: 'flex'}}>
            <Button
              leftIcon={<FiPlus />}
              bg="#fed500"
              color="gray.800"
              size={{ base: 'sm', md: 'md' }}
              borderRadius="xl"
              isLoading={isLoading}
              onClick={() => handleNavigation("/create-ads")}
              boxShadow="lg"
              _hover={{ 
                transform: 'translateY(-2px)', 
                boxShadow: '2xl',
                bg: '#fec000'
              }}
              _active={{ transform: 'translateY(0)' }}
              transition="all 0.2s ease"
              fontWeight="semibold"
            >
              Подать объявление
            </Button>
            
            <Button
              leftIcon={<FiShoppingCart />}
              variant="outline"
              borderColor="#fed500"
              color="p.balck"
              size={{ base: 'sm', md: 'md' }}
              borderRadius="xl"
              borderWidth="2px"
              _hover={{ 
                transform: 'translateY(-2px)', 
                boxShadow: 'lg',
                bg: '#fed500',
                color: 'gray.800'
              }}
              _active={{ transform: 'translateY(0)' }}
              transition="all 0.2s ease"
              fontWeight="semibold"
              onClick={() => handleNavigation("/applications/create")}
            >
              Разместить заказ
            </Button>

            {/* Desktop User Menu */}
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FiChevronDown />}
                variant="ghost"
                size={{ base: 'sm', md: 'md' }}
                borderRadius="xl"
                _hover={{ bg: "gray.100" }}
                transition="all 0.2s ease"
              >
                <HStack spacing={3}>
                  <Avatar 
                    size="sm" 
                    // name="Gaybullayev Jorabek"
                    src=""
                    border="2px solid"
                    borderColor="#fed500"
                  />
                  {!isMobile && (
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                        Gaybullayev Jorabek
                      </Text>
                      <Text fontSize="xs" color={mutedTextColor}>
                        Alisher ogli
                      </Text>
                    </VStack>
                  )}
                </HStack>
              </MenuButton>
              <MenuList 
                borderRadius="xl" 
                boxShadow="2xl"
                border="1px solid"
                borderColor={borderColor}
                bg={bgColor}
              >
                <MenuItem 
                  onClick={() => handleNavigation('/profile')}
                  icon={<FiUser />} 
                  borderRadius="lg"
                  _hover={{ bg: hoverBg }}
                  transition="all 0.2s ease"
                >
                  Мой профиль
                </MenuItem>
                <MenuItem 
                  onClick={() => handleNavigation('/profile/settings')}
                  icon={<FiSettings />} 
                  borderRadius="lg"
                  _hover={{ bg: hoverBg }}
                  transition="all 0.2s ease"
                >
                  Настройки
                </MenuItem>
                <MenuItem 
                  onClick={() => handleNavigation('/profile/notifications')}
                  icon={<FiBell />} 
                  borderRadius="lg"
                  _hover={{ bg: hoverBg }}
                  transition="all 0.2s ease"
                >
                  Уведомления
                </MenuItem>
                <MenuDivider />
                <MenuItem 
                  onClick={() => handleNavigation('/logout')}
                  icon={<FiLogOut />} 
                  color="red.500" 
                  borderRadius="lg"
                  _hover={{ bg: 'red.50', color: 'red.600' }}
                  transition="all 0.2s ease"
                >
                  Выйти
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </CardBody>
    </Card>
  );
};