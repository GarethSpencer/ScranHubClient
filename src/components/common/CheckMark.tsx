interface Props {
  className?: string;
  size?: number;
}

const CheckMark = ({ className, size = 18 }: Props) => (
  <svg
    className={`check-mark${className ? ` ${className}` : ""}`}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
  >
    <path
      d="M4 12.5 L9.5 18 L20 6.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CheckMark;
