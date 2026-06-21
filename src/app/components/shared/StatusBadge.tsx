import { Badge } from "../ui/badge"

type StatusType = "success" | "warning" | "error" | "info" | "neutral"

interface StatusBadgeProps {
  status: string
  type?: StatusType
}

export function StatusBadge({ status, type = "neutral" }: StatusBadgeProps) {
  const colorClasses: Record<StatusType, string> = {
    success: "bg-green-100 text-green-800 border-transparent",
    warning: "bg-orange-100 text-orange-800 border-transparent",
    error: "bg-red-100 text-red-800 border-transparent",
    info: "bg-blue-50 text-blue-700 border-transparent",
    neutral: "bg-zinc-100 text-ink-muted border-transparent"
  }

  // Auto-detect type if not provided explicitly based on status text
  let finalType = type
  if (type === "neutral") {
    const s = status.toLowerCase()
    if (s.includes("traitée") || s.includes("validé") || s.includes("payé")) finalType = "success"
    else if (s.includes("attente") || s.includes("cours")) finalType = "warning"
    else if (s.includes("rejeté") || s.includes("erreur")) finalType = "error"
    else if (s.includes("transmis") || s.includes("envoyé")) finalType = "info"
  }

  return (
    <Badge variant="outline" className={`font-medium ${colorClasses[finalType]}`}>
      {status}
    </Badge>
  )
}
