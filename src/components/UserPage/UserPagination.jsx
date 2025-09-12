import { Button, HStack, IconButton } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

    
    
    
function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <HStack mt={7} justify="center" align="center" spacing={2}>
            <IconButton
                icon={<FiChevronLeft />}
                size="sm"
                variant="ghost"
                borderRadius="full"
                aria-label="Prev"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                key={page}
                size="sm"
                minW={8}
                variant={currentPage === page ? "solid" : "ghost"}
                colorScheme={currentPage === page ? "blue" : "gray"}
                fontWeight={currentPage === page ? "bold" : undefined}
                onClick={() => onPageChange(page)}
                _hover={{ bg: currentPage === page ? "blue.400" : "gray.50" }}
                >
                {page}
                </Button>
            ))}
            <IconButton
                icon={<FiChevronRight />}
                size="sm"
                variant="ghost"
                borderRadius="full"
                aria-label="Next"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            />
        </HStack>
    );
}

export default Pagination