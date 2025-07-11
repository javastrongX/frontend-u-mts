import { IconButton, useColorModeValue } from "@chakra-ui/react";
import { FaArrowUp } from "react-icons/fa";
import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [show, setShow] = useState(false);

  // Call hook here, unconditionally
  const hoverBg = useColorModeValue("orange.100", "orange.50");

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <IconButton
      icon={<FaArrowUp />}
      aria-label="Scroll to top"
      onClick={scrollToTop}
      position="fixed"
      bottom="135px"
      right="25px"
      zIndex={1000}
      size="lg"
      bg={"orange.50"}
      borderRadius="full"
      boxShadow="md"
      _hover={{ bg: hoverBg, border: "1px solid", borderColor: "orange.50" }}
    />
  );
};

export default ScrollToTopButton;
