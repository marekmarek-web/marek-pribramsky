/**
 * SVG ikony pro /kariera — bez importu z lucide-react barrelu (webpack dev umí vracet undefined).
 * Tvary podle Lucide ISC — viz node_modules/lucide-react/dist/esm/icons/*.js
 */
import type { ReactNode, SVGProps } from "react";

type IcoProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };

function Ico({ size = 24, children, strokeWidth = 2, ...rest }: IcoProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export function KIconSparkles(props: IcoProps) {
  return (
    <Ico {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </Ico>
  );
}

export function KIconChevronRight(props: IcoProps) {
  return (
    <Ico {...props}>
      <path d="m9 18 6-6-6-6" />
    </Ico>
  );
}

export function KIconArrowRight(props: IcoProps) {
  return (
    <Ico {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Ico>
  );
}

export function KIconArrowLeft(props: IcoProps) {
  return (
    <Ico {...props}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </Ico>
  );
}

export function KIconCircleCheck(props: IcoProps) {
  return (
    <Ico {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </Ico>
  );
}

export function KIconMail(props: IcoProps) {
  return (
    <Ico {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Ico>
  );
}

export function KIconPhone(props: IcoProps) {
  return (
    <Ico {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Ico>
  );
}

export function KIconUser(props: IcoProps) {
  return (
    <Ico {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Ico>
  );
}

export function KIconImage(props: IcoProps) {
  return (
    <Ico {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </Ico>
  );
}

export function KIconBookOpen(props: IcoProps) {
  return (
    <Ico {...props}>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </Ico>
  );
}

export function KIconShieldCheck(props: IcoProps) {
  return (
    <Ico {...props}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </Ico>
  );
}

export function KIconTrendingUp(props: IcoProps) {
  return (
    <Ico {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </Ico>
  );
}

export function KIconUsers(props: IcoProps) {
  return (
    <Ico {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Ico>
  );
}
