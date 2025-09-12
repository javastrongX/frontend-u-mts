import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";

// Gradient background for all boxes
const gradient =
  "linear-gradient(to right, #141562, #486FBC, #EAB5A1, #8DD6FF, #4973C9, #D07CA7, #F4915E, #F5919E, #B46F89, #141562, #486FBC)";

// Keyframes for gradient movement
const moveGradient = keyframes`
  to {
    background-position: 100% 50%;
  }
`;

// Keyframes for each box (clip-path and visibility)
const boxKeyframes = [
  keyframes`
    0%, 14.2857% { visibility: visible; clip-path: inset(0% 35% 70% round 5%); }
    28.5714%, 42.8571% { clip-path: inset(35% round 5%); }
    57.1428%, 71.4285% { clip-path: inset(0% 70% 70% 0 round 5%); }
    85.7142%, 100% { clip-path: inset(0% 35% 70% round 5%); }
  `,
  keyframes`
    0%, 14.2857% { visibility: visible; clip-path: inset(0% 70% 70% 0 round 5%); }
    28.5714%, 42.8571% { clip-path: inset(0% 35% 70% round 5%); }
    57.1428%, 71.4285% { clip-path: inset(35% round 5%); }
    85.7142%, 100% { clip-path: inset(0% 70% 70% 0 round 5%); }
  `,
  keyframes`
    0%, 14.2857% { visibility: visible; clip-path: inset(35% 70% 35% 0 round 5%); }
    28.5714%, 42.8571% { clip-path: inset(0% 70% 70% 0 round 5%); }
    57.1428%, 71.4285% { clip-path: inset(0% 35% 70% round 5%); }
    85.7142%, 100% { clip-path: inset(35% round 5%); }
  `,
  keyframes`
    0%, 14.2857% { visibility: visible; clip-path: inset(35% 0% 35% 70% round 5%); }
    28.5714%, 42.8571% { clip-path: inset(35% round 5%); }
    57.1428%, 71.4285% { clip-path: inset(70% 35% 0% 35% round 5%); }
    85.7142%, 100% { clip-path: inset(35% 0% 35% 70% round 5%); }
  `,
  keyframes`
    0%, 14.2857% { visibility: visible; clip-path: inset(70% 0 0 70% round 5%); }
    28.5714%, 42.8571% { clip-path: inset(35% 0% 35% 70% round 5%); }
    57.1428%, 71.4285% { clip-path: inset(35% round 5%); }
    85.7142%, 100% { clip-path: inset(70% 35% 0% 35% round 5%); }
  `,
  keyframes`
    0%, 14.2857% { visibility: visible; clip-path: inset(70% 35% 0% 35% round 5%); }
    28.5714%, 42.8571% { clip-path: inset(70% 0 0 70% round 5%); }
    57.1428%, 71.4285% { clip-path: inset(35% 0% 35% 70% round 5%); }
    85.7142%, 100% { clip-path: inset(70% 35% 0% 35% round 5%); }
  `,
];

const boxAnimationDelays = ["0s", ".15s", ".3s", ".575s", ".725s", ".875s"];

const PulsingDotsLoader = () => (
  <Flex
    justify="center"
    align="center"
    position="relative"
    w="120px"
    h="120px"
    mx="auto"
  >
    <Box
      position="absolute"
      left="50%"
      top="50%"
      transform="translate(-50%, -50%)"
      w="100px"
      h="100px"
      bg="transparent"
      border="none"
      userSelect="none"
    >
      <Flex
        position="relative"
        w="70%"
        h="70%"
        m="auto"
        style={{ transform: "rotate(-45deg)" }}
      >
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            position="absolute"
            left={0}
            top={0}
            w="100%"
            h="100%"
            borderRadius="md"
            bgGradient={gradient}
            backgroundSize="1000% 1000%"
            backgroundPosition="0% 50%"
            visibility="hidden"
            css={css`
              animation:
                ${moveGradient} 15s linear infinite,
                ${boxKeyframes[i]} 3.5s ${boxAnimationDelays[i]} infinite;
            `}
          />
        ))}
      </Flex>
    </Box>
  </Flex>
);

export default PulsingDotsLoader;
