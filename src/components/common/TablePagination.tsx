import Pagination from "react-bootstrap/Pagination";

interface Props {
  page: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const TablePagination = ({
  page,
  totalCount,
  pageSize,
  onPageChange,
}: Props) => {
  const pageCount = Math.ceil(totalCount / pageSize);

  if (pageCount <= 1) return null;

  return (
    <Pagination>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map(
        (pageNumber) => (
          <Pagination.Item
            key={pageNumber}
            active={pageNumber === page}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Pagination.Item>
        ),
      )}
    </Pagination>
  );
};

export default TablePagination;
