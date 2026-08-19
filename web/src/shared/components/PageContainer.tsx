import type { ReactNode } from"react"
import { cn } from"../../shared/utils/cn"

interface PageContainerProps {
 children: ReactNode
 className?: string
 noPadding?: boolean
}

export function PageContainer({
 children,
 className,
 noPadding = false,
}: PageContainerProps) {
 return (
 <main
 className={cn(
"flex-1 w-full",
 !noPadding &&"container py-8 md:py-12",
 className
 )}
 >
 {children}
 </main>
 )
}
