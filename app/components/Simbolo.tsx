type Props = { size?: number; className?: string }

export default function Simbolo({ size = 32, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 68 68" fill="none"
         xmlns="http://www.w3.org/2000/svg" className={className}
         role="img" aria-label="JP Abrahão">
      <path d="M0 46 A34 34 0 0 1 68 46" stroke="currentColor"
            strokeWidth="4" strokeLinecap="round" opacity="0.35" />
      <path d="M10 46 A24 24 0 0 1 58 46" stroke="currentColor"
            strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M20 46 A14 14 0 0 1 48 46" stroke="currentColor"
            strokeWidth="6" strokeLinecap="round" />
      <circle cx="34" cy="46" r="5" fill="currentColor" />
    </svg>
  )
}
