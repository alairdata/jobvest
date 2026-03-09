const Logo = ({ size = 24 }) => {
  const h = size * 1.22;
  return (
    <svg width={size} height={h} viewBox="0 0 64 78" fill="none">
      {/* Shield outline */}
      <path
        d="M32 4 L56 16 L56 40 C56 56 44 68 32 74 C20 68 8 56 8 40 L8 16 Z"
        fill="none"
        stroke="#6fa8f7"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Vest collar left */}
      <path
        d="M24 20 L32 38 L28 28 L20 24 Z"
        fill="#6fa8f7"
        opacity="0.85"
      />
      {/* Vest collar right */}
      <path
        d="M40 20 L32 38 L36 28 L44 24 Z"
        fill="#6fa8f7"
        opacity="0.85"
      />
      {/* Lapel lines */}
      <path d="M24 20 L20 16" stroke="#a3c8fd" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 20 L44 16" stroke="#a3c8fd" strokeWidth="2" strokeLinecap="round" />
      {/* Vest buttons */}
      <circle cx="32" cy="44" r="2.2" fill="#6fa8f7" />
      <circle cx="32" cy="52" r="2.2" fill="#6fa8f7" />
      <circle cx="32" cy="60" r="2.2" fill="#6fa8f7" />
    </svg>
  );
};

export default Logo;
