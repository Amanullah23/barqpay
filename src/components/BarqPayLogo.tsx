export default function BarqPayLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="barqpay-badge"
          x1="0"
          y1="0"
          x2="48"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4CD9E8" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient
          id="barqpay-bolt"
          x1="14"
          y1="6"
          x2="34"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EAFBFF" />
        </linearGradient>
      </defs>

      <rect width="48" height="48" rx="14" fill="url(#barqpay-badge)" />
      <rect width="48" height="48" rx="14" fill="white" fillOpacity="0.06" />

      <path
        d="M26.5 6L14 26.5H21.5L20 42L34 20.5H26L26.5 6Z"
        fill="url(#barqpay-bolt)"
        stroke="#0D0B2E"
        strokeOpacity="0.06"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
