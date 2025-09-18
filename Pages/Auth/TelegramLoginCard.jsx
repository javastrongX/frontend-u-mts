import { Box, Icon, Text, Button } from "@chakra-ui/react";
import { FaTelegram } from "react-icons/fa";
import { keyframes } from "@emotion/react";
import { useTelegramAuth } from './hooks/useTelegramAuth';

// Floating animation
const float = keyframes`
  0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  25% { transform: translate(10px, -15px) scale(1.1); opacity: 0.8; }
  50% { transform: translate(-10px, 10px) scale(0.9); opacity: 0.7; }
  75% { transform: translate(15px, 5px) scale(1.05); opacity: 0.9; }
  100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
`;

const DECORATIONS = [
  { w: "60px", h: "60px", left: -4, top: -4, bg: "whiteAlpha.400", delay: "0s" },
  { w: "80px", h: "80px", right: -6, top: 6, bg: "whiteAlpha.300", delay: "1s" },
  { w: "70px", h: "70px", left: 10, bottom: -6, bg: "whiteAlpha.200", delay: "2s" },
];

export default function TelegramLoginCard({ 
  title = "Telegram orqali kirish",
  description = "Ro'yxatdan o'tish uchun Telegram hisobingizdan foydalaning",
  buttonText = "Kirish",
  variant = "primary",
  onSuccess,
  onError,
  ...boxProps 
}) {
  const { login, isLoading } = useTelegramAuth();

  const handleSubmit = () => {
    login({
      onSuccess,
      onError
    });
  };

  const getColorScheme = () => {
    switch (variant) {
      case 'secondary':
        return {
          boxBg: "gray.500",
          buttonBg: "white",
          buttonColor: "gray.500"
        };
      case 'outline':
        return {
          boxBg: "transparent",
          border: "2px solid",
          borderColor: "blue.400",
          buttonBg: "blue.400",
          buttonColor: "white"
        };
      default:
        return {
          boxBg: "blue.400",
          buttonBg: "white",
          buttonColor: "blue.500"
        };
    }
  };

  const colors = getColorScheme();

  return (
    <Box
      w="100%"
      maxW={{ base: "400px", md: "500px", lg: "600px" }}
      mx="auto"
      p={6}
      borderRadius="2xl"
      boxShadow="lg"
      pos="relative"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{ 
        transform: "translateY(-2px)",
        boxShadow: "xl" 
      }}
      bg={colors.boxBg}
      border={colors.border}
      borderColor={colors.borderColor}
      {...boxProps}
    >
      {/* Decorative circles */}
      {DECORATIONS.map((decoration, index) => (
        <Box
          key={`decoration-${index}`}
          pos="absolute"
          width={decoration.w}
          height={decoration.h}
          borderRadius="full"
          bg={decoration.bg}
          animation={`${float} 6s ease-in-out infinite`}
          animationdelay={decoration.delay}
          style={{
            left: decoration.left,
            right: decoration.right,
            top: decoration.top,
            bottom: decoration.bottom,
          }}
        />
      ))}

      {/* Main content */}
      <Box
        pos="relative"
        zIndex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Icon 
          as={FaTelegram} 
          boxSize={12} 
          color="white" 
          mb={4}
          transition="transform 0.3s ease"
          _hover={{ transform: "scale(1.1)" }}
        />
        
        <Text 
          fontSize="xl" 
          fontWeight="bold" 
          color="white"
          mb={2}
        >
          {title}
        </Text>
        
        <Text 
          fontSize="sm" 
          color="whiteAlpha.800" 
          mb={6}
          maxW="300px"
          lineHeight="1.5"
        >
          {description}
        </Text>

        <Button
          leftIcon={<FaTelegram />}
          bg={colors.buttonBg}
          color={colors.buttonColor}
          _hover={{ 
            bg: "whiteAlpha.900",
            transform: "translateY(-1px)"
          }}
          _active={{ transform: "translateY(0)" }}
          size="lg"
          borderRadius="full"
          fontWeight="bold"
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Kuting..."
          transition="all 0.2s ease"
          minW="150px"
        >
          {isLoading ? "Kirish..." : buttonText}
        </Button>
      </Box>
    </Box>
  );
}

