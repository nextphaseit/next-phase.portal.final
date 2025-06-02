import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 40 },
    md: { width: 180, height: 60 },
    lg: { width: 240, height: 80 },
  }

  return (
    <Link href="/" className={className}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NextPhaseITlogo-UjhgXpVY9cPArN2oguJfr6khIokq3z.png"
        alt="NextPhase IT Logo"
        width={sizes[size].width}
        height={sizes[size].height}
        priority
        className="object-contain"
      />
    </Link>
  )
}
