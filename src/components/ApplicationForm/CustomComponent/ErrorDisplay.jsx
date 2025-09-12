import React, { use } from 'react';
import { 
  Box, 
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription,
  Button,
  VStack
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  title = "Error occurred",
  py = 10 
}) => {
  const { t } = useTranslation();
  return (
    <Box py={py}>
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={2} flex={1}>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            {error || t("ApplicationForm.errors.someting_went_wrong", "Что-то пошло не так. Пожалуйста, попробуйте снова.")}
          </AlertDescription>
          {onRetry && (
            <Button 
              size="sm" 
              colorScheme="red" 
              variant="outline"
              onClick={onRetry}
            >
              {t("ApplicationForm.errors.try_again", "Повторить попытку")}
            </Button>
          )}
        </VStack>
      </Alert>
    </Box>
  );
};

export default ErrorDisplay;