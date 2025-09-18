import { Button } from "@chakra-ui/react";
import { FaTelegram } from "react-icons/fa";
import { useTelegramAuth } from '../hooks/useTelegramAuth';

export function ResendCodeButton({ 
  variant = "outline",
  size = "md",
  children = "Kodni qayta yuborish",
  onSuccess,
  onError,
  ...props 
}) {
  const { resendCode, isLoading } = useTelegramAuth();

  const handleResend = () => {
    resendCode({
      onSuccess,
      onError
    });
  };

  return (
    <Button
      leftIcon={<FaTelegram />}
      variant={variant}
      size={size}
      colorScheme="blue"
      onClick={handleResend}
      isLoading={isLoading}
      loadingText="Yuborilmoqda..."
      {...props}
    >
      {children}
    </Button>
  );
}