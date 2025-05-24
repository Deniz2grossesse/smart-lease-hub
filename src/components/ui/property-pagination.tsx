
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PropertyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const PropertyPagination: React.FC<PropertyPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  canGoPrevious,
  canGoNext
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink 
            onClick={() => onPageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => onPageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => onPageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-6 animate-fade-in">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
              className={canGoPrevious ? 'cursor-pointer hover-scale' : 'cursor-not-allowed opacity-50'}
            />
          </PaginationItem>
          
          {renderPageNumbers()}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => canGoNext && onPageChange(currentPage + 1)}
              className={canGoNext ? 'cursor-pointer hover-scale' : 'cursor-not-allowed opacity-50'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PropertyPagination;
