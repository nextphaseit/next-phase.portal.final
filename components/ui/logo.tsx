import Link from "next/link"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "light" | "dark" | "auto"
  asLink?: boolean
}

export function Logo({ className, size = "md", variant = "auto", asLink = false }: LogoProps) {
  const sizes = {
    sm: { width: 140, height: 40, textSize: "text-lg" },
    md: { width: 180, height: 50, textSize: "text-xl" },
    lg: { width: 220, height: 60, textSize: "text-2xl" },
  }

  const logoContent = (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <div
          className={`
            flex items-center justify-center rounded-lg font-bold
            ${size === "sm" ? "w-8 h-8 text-sm" : size === "md" ? "w-10 h-10 text-base" : "w-12 h-12 text-lg"}
            ${
              variant === "light"
                ? "bg-white text-brand-blue border border-gray-200"
                : variant === "dark"
                  ? "bg-brand-blue text-white"
                  : "bg-brand-blue text-white dark:bg-white dark:text-brand-blue"
            }
          `}
        >
          N
        </div>
        {/* Small accent dot */}
        <div
          className={`
            absolute -bottom-1 -right-1 rounded-full
            ${size === "sm" ? "w-2 h-2" : size === "md" ? "w-2.5 h-2.5" : "w-3 h-3"}
            ${variant === "light" ? "bg-brand-green" : variant === "dark" ? "bg-brand-green" : "bg-brand-green"}
          `}
        />
      </div>

      {/* Logo Text */}
      <div className="flex flex-col leading-none">
        <span
          className={`
            font-bold tracking-tight
            ${sizes[size].textSize}
            ${
              variant === "light"
                ? "text-gray-900"
                : variant === "dark"
                  ? "text-white"
                  : "text-gray-900 dark:text-white"
            }
          `}
        >
          NextPhase
        </span>
        <span
          className={`
            font-semibold tracking-wide
            ${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"}
            ${
              variant === "light"
                ? "text-brand-blue"
                : variant === "dark"
                  ? "text-brand-green"
                  : "text-brand-blue dark:text-brand-green"
            }
          `}
        >
          IT
        </span>
      </div>
    </div>
  )

  if (!asLink) {
    return logoContent
  }

  return <Link href="/">{logoContent}</Link>
}
