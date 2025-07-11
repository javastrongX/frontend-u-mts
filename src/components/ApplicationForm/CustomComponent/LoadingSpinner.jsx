import React from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';

const LoadingSpinner = ({ 
  message = "Loading...", 
  size = "xl", 
  py = 10 
}) => {
  return (
    <Box textAlign="center" py={py}>
      <Spinner 
        emptyColor="gray.200" 
        color="#fed400"
        size={size}
        thickness="4px"
      />
      <Text mt={4} color="gray.600" fontSize="md">
        {message}
      </Text>
    </Box>
  );
};

export default LoadingSpinner;