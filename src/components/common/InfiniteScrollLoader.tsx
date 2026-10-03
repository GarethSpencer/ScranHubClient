import type { RefObject } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

interface Props {
  sentinelRef: RefObject<HTMLDivElement | null>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  onRetry: () => void;
}

const InfiniteScrollLoader = ({
  sentinelRef,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  onRetry,
}: Props) => (
  <>
    {hasNextPage && <div ref={sentinelRef} className="py-1" />}
    {(isFetchingNextPage || isFetchNextPageError) && (
      <div className="d-flex justify-content-center align-items-center gap-2 py-3">
        {isFetchNextPageError ? (
          <>
            <span className="text-muted">Couldn't load more venues.</span>
            <Button variant="link" className="p-0" onClick={onRetry}>
              Try again
            </Button>
          </>
        ) : (
          <>
            <Spinner animation="border" size="sm" aria-hidden="true" />
            <span>Loading more venues...</span>
          </>
        )}
      </div>
    )}
  </>
);

export default InfiniteScrollLoader;
