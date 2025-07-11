import React from "react";
import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const scrollAnimation = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const MarqueeText = ({ text, active = false, speed = 15 }) => {
  return (
    <Box
      overflow="hidden"
      whiteSpace="nowrap"
      w="100%"
      maxW="70px"
      h="20px"
      bg="transparent"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        as="span"
        display="inline-block"
        animation={active ? `${scrollAnimation} ${speed}s linear infinite` : "none"}
        color="inherit"
        whiteSpace="nowrap"
        position="absolute"
        left={0}
        transform="translateY(-50%)"
        fontSize="10px"
        lineHeight="1.2"
        fontWeight="inherit"
        sx={{
          minWidth: "100%",
          textAlign: active ? "left" : "center",
          // Transition qo'shish
          transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {text}
      </Box>
    </Box>
  );
};

export default MarqueeText;