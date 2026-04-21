"use client"

import { useEffect, useState } from "react"
import { cn } from "../lib/cn"

const defaultMessages = [
  "Exporting coal...",
  "Loading shipments...",
  "Checking manifests...",
  "Weighing cargo...",
  "Clearing customs...",
  "Scheduling logistics...",
  "Preparing invoices...",
  "Verifying documents...",
  "Tracking deliveries...",
  "Almost there...",
]

interface PageLoaderProps {
  /** Controls visibility. When switched to false, fades out then unmounts. */
  visible?: boolean
  /** Custom rotating messages. Falls back to built-in set. */
  messages?: string[]
  /** Interval in ms between message changes. Defaults to 2500. */
  interval?: number
  /** Size of the logo in pixels. Defaults to 64. */
  size?: number
  /** Hide the rotating text. */
  hideText?: boolean
  className?: string
}

/**
 * Full-page overlay loader with an animated Cometa logo mark
 * and rotating status messages.
 *
 * Covers the entire viewport. Fades out when `visible` becomes false.
 *
 * ```tsx
 * <PageLoader visible={isLoading} />
 * ```
 */
export function PageLoader({
  visible = true,
  messages = defaultMessages,
  interval = 2500,
  size = 64,
  hideText = false,
  className,
}: PageLoaderProps) {
  const height = Math.round(size * (128 / 96))
  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [mounted, setMounted] = useState(visible)
  const [show, setShow] = useState(false)

  // Mount → fade in
  useEffect(() => {
    if (visible) {
      setMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setShow(true))
      })
    } else {
      setShow(false)
      const timer = setTimeout(() => setMounted(false), 200)
      return () => clearTimeout(timer)
    }
  }, [visible])

  // Rotate messages
  useEffect(() => {
    if (!visible || hideText || messages.length <= 1) return
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length)
        setAnimating(false)
      }, 300)
    }, interval)
    return () => clearInterval(timer)
  }, [visible, hideText, messages.length, interval])

  if (!mounted) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-background transition-opacity duration-200",
        show ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <svg
        width={size}
        height={height}
        viewBox="169.921 7.566 18.388 24.118"
        xmlns="http://www.w3.org/2000/svg"
        className="cometa-loader overflow-visible block"
      >
        <defs>
          <clipPath id="ll-clip">
            <rect
              x="169.921"
              y="31.684"
              width="18.388"
              height="24.118"
              className="cometa-loader-clip"
            />
          </clipPath>
        </defs>

        <path
          className="cometa-loader-base"
          d="M188.309 7.56566H169.921V19.2062H176.609C183.076 19.2062 188.309 13.9925 188.309 7.56566V7.56566Z"
        />
        <path
          className="cometa-loader-base"
          d="M188.309 31.6841H169.921V20.0364H176.609C183.076 20.0364 188.309 25.2502 188.309 31.677V31.6841Z"
        />

        <g clipPath="url(#ll-clip)" className="cometa-loader-fill">
          <path
            className="cometa-loader-top"
            d="M188.309 7.56566H169.921V19.2062H176.609C183.076 19.2062 188.309 13.9925 188.309 7.56566V7.56566Z"
          />
          <path
            className="cometa-loader-bottom"
            d="M188.309 31.6841H169.921V20.0364H176.609C183.076 20.0364 188.309 25.2502 188.309 31.677V31.6841Z"
          />
        </g>
      </svg>

      {!hideText && messages.length > 0 && (
        <div className="h-6 overflow-hidden relative">
          <p
            className={cn(
              "text-sm text-muted-foreground transition-all duration-300 ease-in-out",
              animating
                ? "opacity-0 -translate-y-4"
                : "opacity-100 translate-y-0",
            )}
          >
            {messages[index].replace(/\.{3}$/, "")}
            <span className="cometa-loader-dots">
              <span className="cometa-dot">.</span>
              <span className="cometa-dot">.</span>
              <span className="cometa-dot">.</span>
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
