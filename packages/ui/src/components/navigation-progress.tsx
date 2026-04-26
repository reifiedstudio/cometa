"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { cn } from "../lib/cn"

/**
 * Thin linear progress bar at the top of the page.
 * Automatically shows during Next.js route navigations.
 *
 * Place in your root layout:
 * ```tsx
 * <NavigationProgress />
 * ```
 */
export function NavigationProgress({ className }: { className?: string }) {
  const pathname = usePathname()
  const [loading, setLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const prevPathname = React.useRef(pathname)
  const timerRef = React.useRef<ReturnType<typeof setInterval>>(undefined)

  React.useEffect(() => {
    if (pathname !== prevPathname.current) {
      // Navigation started
      prevPathname.current = pathname

      // If we were already loading, finish quickly
      if (timerRef.current) clearInterval(timerRef.current)

      setLoading(true)
      setProgress(20)

      // Simulate progress
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timerRef.current)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 200)

      // Complete after a short delay (page has rendered)
      const done = setTimeout(() => {
        if (timerRef.current) clearInterval(timerRef.current)
        setProgress(100)
        setTimeout(() => {
          setLoading(false)
          setProgress(0)
        }, 200)
      }, 300)

      return () => {
        clearTimeout(done)
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [pathname])

  if (!loading && progress === 0) return null

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] h-0.5 bg-primary/20",
        className,
      )}
    >
      <div
        className="h-full bg-primary transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
