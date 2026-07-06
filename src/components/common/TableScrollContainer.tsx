import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface TableScrollContainerProps {
  children: ReactNode;
  className?: string;
}

const SCROLL_EPSILON = 1;

const TableScrollContainer = ({
  children,
  className,
}: TableScrollContainerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    setCanScrollLeft(element.scrollLeft > SCROLL_EPSILON);
    setCanScrollRight(
      element.scrollWidth - element.clientWidth - element.scrollLeft >
        SCROLL_EPSILON,
    );
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    updateScrollState();

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(element);
    if (element.firstElementChild) {
      observer.observe(element.firstElementChild);
    }

    return () => observer.disconnect();
  }, [updateScrollState]);

  const shadowClasses = [
    "table-scroll-container",
    canScrollLeft ? "can-scroll-left" : "",
    canScrollRight ? "can-scroll-right" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shadowClasses}>
      <div
        ref={scrollRef}
        className="table-responsive"
        onScroll={updateScrollState}
      >
        {children}
      </div>
    </div>
  );
};

export default TableScrollContainer;
