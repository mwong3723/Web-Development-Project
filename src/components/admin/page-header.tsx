import type React from "react"
interface AdminPageHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function AdminPageHeader({ heading, text, children }: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  )
}
