import { HStack, Button } from "@chakra-ui/react";

const Pagination = ({ page, totalPages, onPageChange }) => (
  <HStack spacing={2} justify="center" mt={6}>
    <Button
      size="sm"
      onClick={() => onPageChange(page - 1)}
      isDisabled={page === 1}
    >
      Oldingi
    </Button>
    <Button size="sm" variant="outline" isDisabled>
      {page} / {totalPages}
    </Button>
    <Button
      size="sm"
      onClick={() => onPageChange(page + 1)}
      isDisabled={page === totalPages}
    >
      Keyingi
    </Button>
  </HStack>
);

export default Pagination;
