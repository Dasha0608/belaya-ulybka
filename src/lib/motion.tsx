import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react"
import { cn } from "@/lib/utils"

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** true, когда элемент впервые попал в видимую область */
export function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

/** Плавное появление блока при прокрутке */
export function Reveal({
  children,
  className,
  delay = 0,
  dir = "up",
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  delay?: number
  dir?: "up" | "left" | "right" | "zoom"
  as?: ElementType
}) {
  const { ref, inView } = useInView<HTMLElement>()
  return (
    <Tag ref={ref} data-dir={dir} style={{ "--delay": `${delay}ms` } as CSSProperties} className={cn("reveal", inView && "is-visible", className)}>
      {children}
    </Tag>
  )
}

/** Число, которое «набегает» от 0 до значения при появлении. Сохраняет формат: «12 000+», «98%», «4.9» */
export function CountUp({ value, duration = 1800 }: { value: string; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5)
  const match = value.match(/^([\d\s.,]+)(.*)$/)
  const target = match ? parseFloat(match[1].replace(/\s/g, "").replace(",", ".")) : 0
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0
  const suffix = match ? match[2] : ""
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView || !match) return
    if (prefersReducedMotion()) {
      setCurrent(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCurrent(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  if (!match) return <span>{value}</span>
  const formatted = current.toLocaleString("ru-RU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).replace(",", ".")
  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
      {suffix}
    </span>
  )
}

/** Позиция прокрутки: прокручена ли страница и на сколько процентов */
export function useScroll() {
  const [state, setState] = useState({ scrolled: false, progress: 0 })
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setState({ scrolled: window.scrollY > 24, progress: max > 0 ? window.scrollY / max : 0 })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return state
}
