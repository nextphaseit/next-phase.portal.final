// components/layout/VersionInfo.tsx
import packageJson from "@/app/package-json"

const VersionInfo = () => {
  return <div>Version: {packageJson.version}</div>
}

export default VersionInfo
