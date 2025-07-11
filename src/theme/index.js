import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

export const theme = extendTheme(
  {
    breakpoints: {
      custom380: "380px",
      custom400: "400px",
      sm: "480px",
      custom570: "570px",
      custom680: "680px",
      md: "768px",
      custom900: "900px",
      lg: "992px",
      custom1080: "1080px",
      custom1130: "1130px",
      custom1200: "1200px",
      xl: "1280px",
      "2xl": "1536px",
      custom1600: "1600px"
  },
    colors: {
      purple: {
        500: "#5F00D9",
      },
      yellow: {
        5: "#fefde6",
        500: "#fed500"
      },
      blue: {
        1: "rgba(95, 170, 250, 0.2)",
        200: "#2a81dd",
        300: "#3f83f8",
        400: "#1A56DB",

        600: "#c4e0fe",
        650: "#1778e0"
      },
      p: {
        purple: "#5F00D9",
        black: "#212121",
      },
      black: {
        0: "#FFFFFF",
        5: "#F3F3F7",
        10: "#EEEEF4",
        20: "#D8DDE2",
        40: "#f4f4f4",
        60: "#797E82",
        80: "#535D66",
        90: "rgba(255, 255, 255, 0.9)",
      },
      orange:{
        50: "#fed500",
        100: "#fefde6",
        150: "#EFBB00",
        200: "#FF5A1F",
        250: "#FFCA0A"
      },
      brown: {
        500: "#fff"
      }
    },
    fonts: {
      heading: `Inter, Roboto, arial`,
      body: "Inter, Roboto, arial",
    },
    textStyles: {
      h1: {
        fontSize: {
          base: "30px",
          md: "32px",
        },
        color: "p.black",
        lineHeight: {
          base: "34px",
          md: "36px",
        },
      },
      h2: {
        fontSize: {
          base: "24px",
          md: "28px",
        },
        color: "p.black",
        lineHeight: { base: "28px", md: "32px" },
      },

      h3: {
        fontSize: {
          base: "22px",
          md: "24px",
          xl: "32px",
        },
        color: "p.black",

        lineHeight: { base: "26px", md: "28px", xl: "36px" },
      },

      h4: {
        fontSize: {
          base: "20px",
          md: "22px",
        },
        color: "p.black",

        lineHeight: { base: "24px", md: "26px" },
      },
      h5: {
        fontSize: {
          base: "18px",
          md: "20px",
        },
        color: "p.black",

        lineHeight: { base: "22px", md: "24px" },
      },
      h6: {
        fontSize: {
          base: "16px",
          md: "18px",
        },
        color: "p.black",

        lineHeight: { base: "20px", md: "22px" },
      },
    },

    fontSizes: {
      xs: "12px",
      sm: "14px",
      md: { base: "16px", md: "18px" },
      lg: { base: "18px", md: "20px" },
      xl: '18px',
      "2xl": { base: "22px", md: "24px" },
      "3xl": { base: "24px", md: "28px" },
      "4xl": { base: "30px", md: "32px" },
    },
    styles: {
      global: {
        // styles for the `body`
        body: {
          bg: "black.0",
          color: 'p.black',
        },
        
      },
    },

    components: {
      Button: {
        baseStyle: {
          fontWeight: "bold",
          borderRadius: "10px",
        },
      },

    Alert: {
      variants: {
        // override "info" varianti
        solid: (props) => {
          if (props.status === "info" || props.status === "loading") {
            return {
              container: {
                bg: "blue.400", // yangi fon rangi
                color: "white",
              },
            };
          }
        },
      },
    },

      FormLabel: {
        baseStyle: {
          fontSize: "sm",
        },
      },
      Input: {
        variants: {
          outline: {
            field: {
              h: "38px",
              borderRadius: "8px",
              fontSize: "sm",
              pb: "0",
              _focus: {
                boxShadow: "0 0 0 1px #5F00D9",
              },
            },
          },
        },
      }
    },
  },
  withDefaultColorScheme({ colorScheme: "yellow" })
);