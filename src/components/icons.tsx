import type { SVGProps } from "react";

// Line icons drawn to match the outline style used throughout the CMF designs.
const paths = {
  book: (
    <>
      <path d="M3 5.5c3-1.3 6-1.3 9 .8 3-2.1 6-2.1 9-.8V19c-3-1.3-6-1.3-9 .8-3-2.1-6-2.1-9-.8z" />
      <path d="M12 6.3v13.5" />
    </>
  ),
  books: (
    <>
      <path d="M4 17.5h15a1.5 1.5 0 0 1 0 3H4z" />
      <path d="M5 13.5h13a1.5 1.5 0 0 1 0 3H5z" />
      <path d="M4 9.5h15a1.5 1.5 0 0 1 0 3H4z" />
      <path d="M6 5.5h12a1.5 1.5 0 0 1 0 3H6z" />
    </>
  ),
  cap: (
    <>
      <path d="m2 9 10-5 10 5-10 5z" />
      <path d="M6 11v4.5c1.8 1.6 3.8 2.4 6 2.4s4.2-.8 6-2.4V11" />
      <path d="M22 9v6" />
    </>
  ),
  people: (
    <>
      <circle cx="12" cy="7" r="2.6" />
      <circle cx="5.5" cy="9" r="2.1" />
      <circle cx="18.5" cy="9" r="2.1" />
      <path d="M7.5 19v-1.5a4.5 4.5 0 0 1 9 0V19z" />
      <path d="M2 19v-1a3.5 3.5 0 0 1 5.2-3" />
      <path d="M22 19v-1a3.5 3.5 0 0 0-5.2-3" />
    </>
  ),
  pillar: (
    <>
      <path d="M3 9h18L12 3.5z" />
      <path d="M5 9v9M9.5 9v9M14.5 9v9M19 9v9" />
      <path d="M3 18h18M2 21h20" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 12C12 7.5 9 5 4 5c0 4.5 3 7 8 7Z" />
      <path d="M12 14.5c0-3.8 2.6-6 7-6 0 3.8-2.6 6-7 6Z" />
    </>
  ),
  drop: <path d="M12 3c3.5 4.5 6 8 6 11a6 6 0 0 1-12 0c0-3 2.5-6.5 6-11Z" />,
  handshake: (
    <>
      <path d="m2 11 4-4 3 1.2L12 7l3.5 1.2L18 7l4 4" />
      <path d="m6 13 4.5 4.5a1.5 1.5 0 0 0 2.1 0l4.9-4.9" />
      <path d="M9 8.2 6.8 10.4a1.4 1.4 0 0 0 2 2L12 9.5l4.5 4" />
      <path d="M2 11v2l4 0M22 11v2h-4" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v2.6M12 18.9v2.6M4.7 4.7l1.8 1.8M17.5 17.5l1.8 1.8M2.5 12h2.6M18.9 12h2.6M4.7 19.3l1.8-1.8M17.5 6.5l1.8-1.8" />
      <circle cx="12" cy="12" r="6.6" />
    </>
  ),
  heart: <path d="M12 20s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.2-8 11-8 11Z" />,
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" />
      <path d="M5 12v9h14v-9M12 8v13" />
      <path d="M12 8C10 4 6.5 4 6.5 6S9.5 8 12 8Zm0 0c2-4 5.5-4 5.5-2S14.5 8 12 8Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </>
  ),
  phone: (
    <path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11 11 0 0 0 5.2 5.2l1.4-2.1 4.2 1.6V17a2.5 2.5 0 0 1-2.5 2.5A15 15 0 0 1 2.5 6 2.5 2.5 0 0 1 5 3.5Z" />
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V9l8-5 8 5v12" />
      <path d="M2 21h20M9 21v-5h6v5M8 11h2M14 11h2M12 7.5v.01" />
    </>
  ),
  document: (
    <>
      <path d="M6 2.5h8l4 4v15H6z" />
      <path d="M14 2.5v4h4M9 11h6M9 14.5h6M9 18h4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="1.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2" />
    </>
  ),
  binoculars: (
    <>
      <circle cx="6.5" cy="16" r="3.5" />
      <circle cx="17.5" cy="16" r="3.5" />
      <path d="M10 16h4M4 13l2-8h3l1 8M20 13l-2-8h-3l-1 8" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
      <path d="m13 11 7-7M17 4h3v3" />
    </>
  ),
  diamond: (
    <>
      <path d="M6 4h12l4 5-10 11L2 9z" />
      <path d="M2 9h20M9 4l3 16 3-16M6 4l3 5 3-5 3 5 3-5" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20h4L19.5 8.5a2.8 2.8 0 0 0-4-4L4 16z" />
      <path d="m14 6 4 4M13 20h7" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5 4 5.5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10v-6z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </>
  ),
  arrow: <path d="M4 12h15m-5-5 5 5-5 5" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor" />,
  minus: <path d="M5 12h14" />,
  arrowDown: <path d="M12 4v15m-5-5 5 5 5-5" />,
  arrowLeft: <path d="M20 12H5m5 5-5-5 5-5" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  expand: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  collapse: <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />,
  contrast: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v17a8.5 8.5 0 0 0 0-17Z" fill="currentColor" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M5 5l14 14M19 5 5 19" />,
  leaf: (
    <>
      <path d="M12 21v-7" />
      <path d="M12 14c-4.5 0-7-3-7-8 4.5 0 7 3 7 8Zm0 0c4.5 0 7-3 7-8-4.5 0-7 3-7 8Z" />
    </>
  ),
  facebook: <path d="M14 8.5h2.5V5H14c-2.2 0-3.5 1.5-3.5 3.7V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9.2c0-.4.3-.7.7-.7Z" />,
  x: <path d="M4.5 4h4l11 16h-4zM19.5 4l-6.3 7.2M4.5 20l6.3-7.2" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17 7v.01" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="m10 9 5 3-5 3z" />
    </>
  ),
  linkedin: (
    <>
      <path d="M5 9.5V19M5 5.5v.01M9.5 19v-9.5M9.5 13.5c0-2.3 1.5-4 3.5-4s3.5 1.3 3.5 4V19" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-6", strokeWidth = 1.5, ...props }: { name: IconName; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
