export const ThinCircleIcon = ({
  color = "gray",
  strokeWidth = 1,
  checked = false,
}) => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="transparent"
    />
    {checked && (
      <path
        d="M9 12l2 2 4-4"
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);
