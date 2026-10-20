import { useState, type FormEvent, type ReactNode, type SVGProps } from "react"
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  CalendarCheck,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Microscope,
  Phone,
  Quote,
  Send,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  ThumbsUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CountUp, Reveal, useScroll } from "@/lib/motion"
import { cn } from "@/lib/utils"

/* ---------- Фото (Unsplash, бесплатная лицензия) ---------- */

const photo = (id: string, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const IMG = {
  hero: "1489278353717-f64c6ee8a4d2",
  about: "1777331903190-341a3dd0441b",
  cta: "1704455306251-b4634215d98f",
}

/* ---------- Данные ---------- */

const NAV = [
  { href: "#services", label: "Услуги" },
  { href: "#about", label: "О клинике" },
  { href: "#gallery", label: "Кабинеты" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
]

const SERVICES = [
  { title: "Лечение зубов", text: "Кариес и каналы под микроскопом", price: "от 3 500 ₽", img: "1663755489920-5e09f66d011a" },
  { title: "Протезирование", text: "Коронки, виниры, протезы", price: "от 15 000 ₽", img: "1468493858157-0da44aaf1d13" },
  { title: "Чистка", text: "Ультразвук и Air Flow", price: "от 4 000 ₽", img: "1681939278218-a755fb2bf2d3" },
  { title: "Отбеливание", text: "До 8 тонов за один визит", price: "от 12 000 ₽", img: "1654373535457-383a0a4d00f9" },
  { title: "Имплантация", text: "Пожизненная гарантия на импланты", price: "от 35 000 ₽", img: "1593022356769-11f762e25ed9" },
  { title: "Детская стоматология", text: "Лечение без страха с 2 лет", price: "от 2 500 ₽", img: "1758205307836-0829c799890b" },
]

const ADVANTAGES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Award, title: "Опыт 15+ лет", text: "Врачи высшей категории" },
  { icon: Microscope, title: "Цифровое оборудование", text: "3D-томограф и микроскоп" },
  { icon: HeartHandshake, title: "Без боли и страха", text: "Современная анестезия" },
  { icon: ShieldCheck, title: "Гарантия качества", text: "Письменно на все работы" },
]

const DOCTORS = [
  { name: "Алексей Иванов", role: "Стоматолог-ортопед", exp: "12 лет опыта", rating: "4.9", img: "1667133295308-9ef24f71952e" },
  { name: "Мария Петрова", role: "Терапевт", exp: "8 лет опыта", rating: "4.8", img: "1623854767648-e7bb8009f0db" },
  { name: "Игорь Смирнов", role: "Хирург-имплантолог", exp: "10 лет опыта", rating: "4.9", img: "1758691463582-11aea602cd4a" },
]

const STATS: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: ThumbsUp, value: "98%", label: "довольных пациентов" },
  { icon: Smile, value: "12 000+", label: "здоровых улыбок" },
  { icon: Users, value: "4.9", label: "средний рейтинг клиники" },
  { icon: Star, value: "15+", label: "лет заботы о пациентах" },
]

const GALLERY = [
  { img: "1629909613654-28e377c37b09", label: "Лечебный кабинет" },
  { img: "1704455306925-1401c3012117", label: "Хирургия" },
  { img: "1629909614456-6b1c5c94cecc", label: "Зона ожидания" },
  { img: "1606811971618-4486d14f3f99", label: "Диагностика" },
]

const REVIEWS = [
  { name: "Анна Смирнова", service: "Отбеливание", img: "1580489944761-15a19d654956", text: "Результат превзошёл ожидания: зубы стали белее на несколько тонов, никакой чувствительности. Очень уютная клиника и внимательный персонал." },
  { name: "Дмитрий Козлов", service: "Имплантация", img: "1592234789031-94bf65f630ed", text: "Долго боялся имплантации, но всё прошло спокойно и без боли. Врач объяснил каждый этап, а цена не изменилась ни на рубль." },
  { name: "Елена Петрова", service: "Детская стоматология", img: "1548382131-e0ebb1f0cdea", text: "Сын теперь сам просится к стоматологу! Доктор нашла подход за пять минут, лечение прошло в игровой форме. Спасибо огромное!" },
  { name: "Игорь Волков", service: "Протезирование", img: "1568602471122-7832951cc4c5", text: "Поставили керамические коронки — выглядят как родные зубы. Всё сделали быстро, за три визита. Рекомендую друзьям и коллегам." },
]

const CONTACTS = {
  address: "г. Москва, ул. Садовая, д. 12",
  phone: "+7 (495) 123-45-67",
  phoneHref: "tel:+74951234567",
  email: "info@belaya-ulybka.ru",
  hours: [
    { days: "Пн–Пт", time: "9:00 – 21:00" },
    { days: "Сб", time: "10:00 – 18:00" },
    { days: "Вс", time: "выходной" },
  ],
}

/* ---------- Общие элементы ---------- */

function ToothIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5.5C10.5 4 8.6 3.4 7 3.6 4.6 3.9 3.2 6 3.5 8.6c.3 2.3 1.4 3.6 1.8 5.4.5 2.4.6 6.4 2.4 6.4 1.6 0 1.7-3.2 2.3-4.9.4-1.1 1.1-1.6 2-1.6s1.6.5 2 1.6c.6 1.7.7 4.9 2.3 4.9 1.8 0 1.9-4 2.4-6.4.4-1.8 1.5-3.1 1.8-5.4.3-2.6-1.1-4.7-3.5-5-1.6-.2-3.5.4-5 1.9Z" />
    </svg>
  )
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="group flex items-center gap-2.5">
      <ToothIcon
        className={cn("h-8 w-8 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110", light ? "text-white" : "text-primary")}
        strokeWidth={1.8}
      />
      <span className={cn("font-display text-lg font-bold uppercase leading-none tracking-wide", light ? "text-white" : "text-navy")}>
        Белая улыбка
        <span className={cn("mt-1 block font-sans text-[10px] font-semibold tracking-[0.2em]", light ? "text-white/60" : "text-muted-foreground")}>
          стоматология
        </span>
      </span>
    </a>
  )
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={cn("group mb-3 flex items-center gap-2 text-sm font-semibold", light ? "text-sky-200" : "text-primary")}>
      <span className={cn("h-px w-8 transition-all duration-500 group-hover:w-14", light ? "bg-sky-200" : "bg-primary")} />
      {children}
    </p>
  )
}

function Heading({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("font-display text-2xl font-bold uppercase leading-tight tracking-tight text-navy sm:text-4xl", className)}>{children}</h2>
}

function Stars({ className }: { className?: string }) {
  return (
    <span className={cn("flex gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </span>
  )
}

/** Круг со стрелкой внутри кнопки: при наведении на кнопку стрелка уезжает вправо */
function ArrowBubble({ className }: { className?: string }) {
  return (
    <span className={cn("ml-2 grid h-9 w-9 place-items-center overflow-hidden rounded-full transition-transform duration-300 group-hover:rotate-[-45deg]", className)}>
      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
    </span>
  )
}

/* ---------- Секции ---------- */

function Header() {
  const [open, setOpen] = useState(false)
  const { scrolled, progress } = useScroll()
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-500",
        scrolled ? "border-border/60 bg-white/90 shadow-lg shadow-navy/5 backdrop-blur-lg" : "border-transparent bg-white"
      )}
    >
      <div className={cn("container flex items-center justify-between gap-6 transition-all duration-500", scrolled ? "h-16" : "h-[76px]")}>
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="nav-link text-sm font-semibold text-navy/70 transition-colors hover:text-primary">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <a href={CONTACTS.phoneHref} className="group flex items-center gap-2 text-sm font-bold text-navy transition-colors hover:text-primary">
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/30" />
              <Phone className="relative h-4 w-4 group-hover:animate-wiggle" />
            </span>
            {CONTACTS.phone}
          </a>
          <Button asChild className="rounded-full px-6">
            <a href="#booking">Записаться</a>
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Меню">
          <span className={cn("transition-transform duration-300", open && "rotate-90")}>{open ? <X /> : <Menu />}</span>
        </Button>
      </div>
      {open && (
        <div className="border-t bg-white animate-in fade-in slide-in-from-top-2 duration-300 md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {NAV.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${i * 50}ms` }}
                className="rounded-md px-3 py-2.5 font-semibold text-navy transition-all animate-in fade-in slide-in-from-left-4 fill-mode-both hover:translate-x-1 hover:bg-accent"
              >
                {item.label}
              </a>
            ))}
            <a href={CONTACTS.phoneHref} className="flex items-center gap-2 px-3 py-2.5 font-bold text-navy">
              <Phone className="h-4 w-4 text-primary" /> {CONTACTS.phone}
            </a>
            <Button asChild className="mt-2 rounded-full">
              <a href="#booking" onClick={() => setOpen(false)}>Записаться на приём</a>
            </Button>
          </nav>
        </div>
      )}
      {/* Полоса прогресса прокрутки */}
      <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-primary to-sky-300" style={{ transform: `scaleX(${progress})` }} />
    </header>
  )
}

/** Появление элемента героя при загрузке страницы */
const enter = "animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"

function Hero() {
  const doc = DOCTORS[0]
  return (
    <section id="top" className="container pt-4 md:pt-6">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy animate-in fade-in zoom-in-95 duration-700">
        <img
          src={photo(IMG.hero, 1800)}
          alt="Улыбающаяся пациентка клиники"
          className="absolute inset-0 -z-10 h-full w-full animate-kenburns object-cover object-[70%_30%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/85 to-navy/10 md:via-navy/70" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-navy/80 to-transparent md:hidden" />

        {/* Плавающие декоративные элементы */}
        <Sparkles className="pointer-events-none absolute right-[45%] top-16 hidden h-6 w-6 animate-float text-sky-200/70 lg:block" />
        <span className="pointer-events-none absolute bottom-24 right-[42%] hidden h-3 w-3 animate-float-slow rounded-full bg-sky-300/60 lg:block" />
        <span className="pointer-events-none absolute right-[52%] top-1/2 hidden h-2 w-2 animate-float rounded-full bg-white/50 [animation-delay:1.5s] lg:block" />

        <div className="grid min-h-[600px] gap-10 p-6 sm:p-10 lg:min-h-[640px] lg:grid-cols-[1.2fr_1fr] lg:p-14">
          <div className="flex flex-col justify-center text-white">
            <p className={cn(enter, "delay-150 mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur")}>
              <Star className="h-4 w-4 animate-spin-slow fill-amber-400 text-amber-400" /> 4.9 · более 1 200 отзывов
            </p>
            <h1 className={cn(enter, "delay-300 font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl")}>
              Здоровые зубы&nbsp;—<br />
              <span className="text-shimmer animate-shimmer">красивая</span> улыбка
            </h1>
            <p className={cn(enter, "delay-500 mt-6 max-w-md text-lg text-white/80")}>
              Стоматологическая клиника «Белая улыбка»: бережное лечение, современные технологии и забота о каждом пациенте.
            </p>
            <div className={cn(enter, "delay-700 mt-8 flex flex-wrap items-center gap-4")}>
              <Button asChild size="lg" className="group rounded-full bg-white pl-7 pr-2 text-navy shadow-xl hover:bg-sky-300 hover:text-navy">
                <a href="#booking">
                  Записаться на приём
                  <ArrowBubble className="bg-primary text-white group-hover:bg-navy" />
                </a>
              </Button>
              <a href={CONTACTS.phoneHref} className="nav-link font-semibold text-white/90 transition-colors hover:text-sky-200">
                {CONTACTS.phone}
              </a>
            </div>
            <div className="mt-10 flex max-w-lg flex-wrap gap-2">
              {SERVICES.map((s, i) => (
                <a
                  key={s.title}
                  href="#services"
                  style={{ animationDelay: `${900 + i * 80}ms` }}
                  className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition-all duration-300 animate-in fade-in zoom-in-75 fill-mode-both hover:-translate-y-1 hover:border-white hover:bg-white hover:text-navy hover:shadow-lg"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden flex-col items-end justify-between lg:flex">
            <p className={cn(enter, "delay-500 max-w-[16rem] text-right text-sm leading-relaxed text-white/85")}>
              Экспертная стоматологическая помощь в комфортной обстановке с использованием современных технологий и материалов.
            </p>
            <div className="animate-in fade-in slide-in-from-right-10 duration-1000 fill-mode-both delay-1000">
              <Card className="w-72 animate-float border-0 bg-white/95 shadow-2xl backdrop-blur transition-shadow hover:shadow-sky-300/40">
                <CardContent className="flex gap-4 p-4">
                  <div className="relative shrink-0">
                    <img src={photo(doc.img, 240)} alt={doc.name} className="h-28 w-24 rounded-xl object-cover" />
                    <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400">
                      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400" />
                    </span>
                  </div>
                  <div className="flex flex-col justify-between py-0.5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Главный врач</p>
                      <p className="mt-1 font-bold leading-tight text-navy">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{doc.exp}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-navy">
                        {doc.rating} <Stars />
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Преимущества под героем */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-2 py-10 md:grid-cols-4">
        {ADVANTAGES.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 100} className="group flex cursor-default items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-primary/20 bg-secondary text-primary transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-navy transition-colors group-hover:text-primary">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/** Бегущая строка с услугами */
function Marquee() {
  const items = [...SERVICES.map((s) => s.title), "Консультация", "3D-диагностика", "Виниры", "Ортодонтия"]
  const row = (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((t) => (
        <span key={t} className="flex items-center gap-6 px-6 font-display text-lg font-bold uppercase tracking-wide text-white/90 sm:text-2xl">
          {t}
          <ToothIcon className="h-6 w-6 text-sky-300" strokeWidth={1.6} />
        </span>
      ))}
    </div>
  )
  return (
    <div className="group relative -rotate-1 overflow-hidden bg-primary py-4 shadow-xl shadow-primary/20">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {row}
        {row}
      </div>
    </div>
  )
}

function Services() {
  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end">
          <Reveal dir="left">
            <Eyebrow>Наши услуги</Eyebrow>
            <Heading>Откройте для себя наши стоматологические услуги</Heading>
          </Reveal>
          <Reveal dir="right" delay={150} className="lg:pl-10">
            <p className="text-muted-foreground">
              Современная стоматология, которая сочетает комфорт, точность и внимание к деталям. Полный спектр услуг для здоровья вашей улыбки — в одной клинике.
            </p>
            <div className="group mt-5 flex items-center gap-3">
              <div className="flex -space-x-3 transition-all duration-500 group-hover:space-x-1">
                {REVIEWS.slice(0, 3).map((r) => (
                  <img key={r.name} src={photo(r.img, 96)} alt="" className="h-10 w-10 rounded-full border-2 border-white object-cover transition-all duration-500" loading="lazy" />
                ))}
              </div>
              <div>
                <p className="font-display text-lg font-bold leading-none text-navy">
                  <CountUp value="1 200+" />
                </p>
                <p className="text-xs text-muted-foreground">отзывов пациентов</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 120} dir="zoom">
              <a
                href="#booking"
                className="group relative isolate block aspect-[4/3] overflow-hidden rounded-3xl bg-navy shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/25"
              >
                <img
                  src={photo(s.img, 700)}
                  alt={s.title}
                  loading="lazy"
                  className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy backdrop-blur transition-all duration-500 group-hover:bg-navy group-hover:text-white">
                  {s.price}
                </span>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
                  <div className="transition-transform duration-500 group-hover:-translate-y-1">
                    <h3 className="text-xl font-bold leading-tight">{s.title}</h3>
                    <p className="mt-1 text-sm text-white/75">{s.text}</p>
                    <p className="grid grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr]">
                      <span className="overflow-hidden text-sm font-semibold text-white">
                        <span className="mt-2 block">Записаться →</span>
                      </span>
                    </p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-navy transition-all duration-500 group-hover:rotate-45 group-hover:scale-110 group-hover:bg-navy group-hover:text-white">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="bg-gradient-to-b from-sky-50/80 to-white py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal dir="left" className="relative">
            <div className="group overflow-hidden rounded-3xl shadow-xl">
              <img
                src={photo(IMG.about, 1000)}
                alt="Врач консультирует пациентку"
                loading="lazy"
                className="aspect-[5/4] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="absolute -left-4 -top-4 -z-10 h-32 w-32 animate-float-slow rounded-3xl bg-primary/15" />
            <div className="absolute -bottom-6 right-6 hidden animate-float rounded-2xl bg-white p-5 shadow-xl sm:block">
              <p className="animate-wiggle font-script text-3xl leading-none text-primary">Улыбайтесь чаще!</p>
              <p className="mt-1 text-xs text-muted-foreground">команда «Белой улыбки»</p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <Eyebrow>О клинике</Eyebrow>
              <Heading>Высокие стандарты и индивидуальный подход</Heading>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 text-muted-foreground">
                Мы используем передовые технологии и качественные материалы, чтобы обеспечить безболезненное лечение и долгосрочный результат. Каждый план лечения
                согласуем с вами заранее — без скрытых доплат.
              </p>
              <Button asChild variant="outline" className="group mt-6 rounded-full border-navy/20 px-6">
                <a href="#booking">
                  Бесплатная консультация <ArrowRight className="group-hover:translate-x-1" />
                </a>
              </Button>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {DOCTORS.slice(1).map((d, i) => (
                <Reveal key={d.name} delay={240 + i * 120}>
                  <Card className="group border-border/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                    <CardContent className="flex gap-3 p-3">
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg">
                        <img src={photo(d.img, 200)} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-sm font-bold leading-tight text-navy transition-colors group-hover:text-primary">Д-р {d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.role}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{d.exp}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-navy">
                          {d.rating} <Stars />
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal className="mt-16 grid grid-cols-2 gap-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-border/70 md:grid-cols-4 md:p-8">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <div key={label} className={cn("group flex cursor-default items-center gap-4", i > 0 && "md:border-l md:border-border md:pl-6")}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-navy">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-2xl font-bold text-navy">
                  <CountUp value={value} />
                </p>
                <p className="text-xs leading-snug text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section id="gallery" className="py-16 md:py-24">
      <div className="container">
        <Reveal className="mb-10 text-center">
          <Heading>Наши кабинеты</Heading>
          <p className="mt-3 text-muted-foreground">Комфортная атмосфера для вашего спокойствия</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {GALLERY.map((g, i) => (
            <Reveal key={g.img} delay={i * 120} dir="zoom">
              <figure className="group relative overflow-hidden rounded-2xl">
                <img
                  src={photo(g.img, 600)}
                  alt={g.label}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy backdrop-blur transition-all duration-500 group-hover:bottom-5 group-hover:bg-primary group-hover:text-white">
                  {g.label}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section id="reviews" className="bg-sky-50/70 py-16 md:py-24">
      <div className="container">
        <Reveal className="mb-10 text-center">
          <Heading>Отзывы наших пациентов</Heading>
          <p className="mt-3 text-muted-foreground">Нам доверяют свои улыбки тысячи людей</p>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 120} className="h-full">
              <Card className="group relative h-full overflow-hidden border-0 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15">
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-sky-300 transition-transform duration-500 group-hover:scale-x-100" />
                <Quote className="absolute right-5 top-5 h-8 w-8 text-secondary transition-all duration-500 group-hover:rotate-12 group-hover:scale-125 group-hover:text-primary/20" />
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-center gap-3">
                    <img src={photo(r.img, 120)} alt={r.name} loading="lazy" className="h-12 w-12 rounded-full object-cover ring-2 ring-transparent transition-all duration-500 group-hover:ring-primary" />
                    <div>
                      <p className="font-bold text-navy">{r.name}</p>
                      <Stars />
                    </div>
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">«{r.text}»</blockquote>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">{r.service}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBanner() {
  return (
    <section className="container pb-16 pt-16 md:pb-24 md:pt-24">
      <Reveal dir="zoom" className="group grid overflow-hidden rounded-3xl bg-gradient-to-r from-sky-50 to-sky-100 lg:grid-cols-2">
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <p className="text-sm font-semibold text-primary">Готовы к здоровой улыбке?</p>
          <Heading className="mt-2 text-2xl sm:text-3xl">Запишитесь на приём уже сегодня</Heading>
          <p className="mt-3 max-w-md text-muted-foreground">Наши специалисты помогут подобрать лучшее решение для вашей улыбки.</p>
          <Button asChild size="lg" className="group/btn mt-6 w-fit rounded-full pl-7 pr-2">
            <a href="#booking">
              Записаться на приём
              <span className="ml-2 grid h-9 w-9 place-items-center rounded-full bg-white/20 transition-transform duration-300 group-hover/btn:-rotate-45">
                <ArrowRight />
              </span>
            </a>
          </Button>
        </div>
        <div className="overflow-hidden">
          <img
            src={photo(IMG.cta, 1200)}
            alt="Стоматологический кабинет клиники"
            loading="lazy"
            className="h-64 w-full object-cover transition-transform duration-1000 group-hover:scale-105 lg:h-full"
          />
        </div>
      </Reveal>
    </section>
  )
}

function formatPhone(value: string) {
  let d = value.replace(/\D/g, "")
  if (d.startsWith("8")) d = "7" + d.slice(1)
  if (!d.startsWith("7")) d = "7" + d
  d = d.slice(0, 11)
  const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)]
  let out = "+7"
  if (p[0]) out += ` (${p[0]}`
  if (p[0].length === 3) out += ")"
  if (p[1]) out += ` ${p[1]}`
  if (p[2]) out += `-${p[2]}`
  if (p[3]) out += `-${p[3]}`
  return out
}

function BookingForm() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const [shake, setShake] = useState(0)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (name.trim().length < 2) next.name = "Укажите ваше имя"
    if (phone.replace(/\D/g, "").length !== 11) next.phone = "Введите номер полностью"
    if (!service) next.service = "Выберите услугу"
    setErrors(next)
    if (Object.keys(next).length === 0) {
      // Здесь можно подключить отправку на сервер / в CRM
      setSent(true)
    } else {
      setShake((n) => n + 1)
    }
  }

  const reset = () => {
    setName("")
    setPhone("")
    setService("")
    setSent(false)
  }

  const fieldClass = "h-12 border-0 bg-white text-navy focus-visible:ring-sky-300 focus-visible:ring-offset-navy focus:ring-sky-300 focus:ring-offset-navy"
  const errorText = "text-sm text-red-300 animate-in fade-in slide-in-from-top-1 duration-300"

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-white/10 p-8 text-center ring-1 ring-white/15 backdrop-blur animate-in fade-in zoom-in-90 duration-500">
        <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-primary">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/50" />
          <CheckCircle2 className="relative h-8 w-8 animate-in zoom-in-0 spin-in-90 duration-700" />
        </span>
        <h3 className="mt-5 text-2xl font-bold">Спасибо, {name.trim()}!</h3>
        <p className="mt-2 max-w-sm text-white/75">Заявка принята. Мы перезвоним на номер {phone} в ближайшее время.</p>
        <Button variant="outline" className="mt-6 rounded-full border-white/30 bg-transparent text-white hover:border-white hover:bg-white hover:text-navy" onClick={reset}>
          Отправить ещё одну заявку
        </Button>
      </div>
    )
  }

  return (
    <form key={shake} onSubmit={submit} noValidate className={cn("space-y-4", shake > 0 && "animate-shake")}>
      <div className="space-y-1.5">
        <Label htmlFor="name" className="sr-only">Ваше имя</Label>
        <Input id="name" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} className={cn(fieldClass, errors.name && "ring-2 ring-red-400")} />
        {errors.name && <p className={errorText}>{errors.name}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone" className="sr-only">Телефон</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value ? formatPhone(e.target.value) : "")}
          aria-invalid={!!errors.phone}
          className={cn(fieldClass, errors.phone && "ring-2 ring-red-400")}
        />
        {errors.phone && <p className={errorText}>{errors.phone}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="service" className="sr-only">Услуга</Label>
        <Select value={service} onValueChange={setService}>
          <SelectTrigger id="service" aria-invalid={!!errors.service} className={cn(fieldClass, errors.service && "ring-2 ring-red-400")}>
            <SelectValue placeholder="Выберите услугу" />
          </SelectTrigger>
          <SelectContent>
            {SERVICES.map((s) => (
              <SelectItem key={s.title} value={s.title}>
                {s.title}
              </SelectItem>
            ))}
            <SelectItem value="Консультация">Консультация</SelectItem>
          </SelectContent>
        </Select>
        {errors.service && <p className={errorText}>{errors.service}</p>}
      </div>
      <Button type="submit" size="lg" className="group h-12 w-full bg-sky-300 text-navy shadow-sky-300/30 hover:bg-white hover:text-primary">
        <CalendarCheck className="group-hover:-rotate-12 group-hover:scale-125" /> Записаться на приём
      </Button>
      <p className="text-center text-xs text-white/50">Нажимая кнопку, вы соглашаетесь с обработкой персональных данных</p>
    </form>
  )
}

function BookingAndContacts() {
  const items: { icon: LucideIcon; content: ReactNode }[] = [
    { icon: Phone, content: <a href={CONTACTS.phoneHref} className="font-semibold transition-colors hover:text-sky-300">{CONTACTS.phone}</a> },
    { icon: Mail, content: <a href={`mailto:${CONTACTS.email}`} className="transition-colors hover:text-sky-300">{CONTACTS.email}</a> },
    {
      icon: MapPin,
      content: (
        <a href="https://yandex.ru/maps/?text=Москва%2C%20ул.%20Садовая%2C%2012" target="_blank" rel="noreferrer" className="transition-colors hover:text-sky-300">
          {CONTACTS.address}
        </a>
      ),
    },
    {
      icon: Clock,
      content: (
        <ul className="space-y-0.5">
          {CONTACTS.hours.map((h) => (
            <li key={h.days} className="flex gap-4">
              <span className="w-12 text-white/60">{h.days}</span>
              <span>{h.time}</span>
            </li>
          ))}
        </ul>
      ),
    },
  ]

  return (
    <section id="booking" className="relative isolate overflow-hidden bg-navy py-16 text-white md:py-24">
      <ToothIcon className="pointer-events-none absolute -right-16 top-10 -z-10 h-[28rem] w-[28rem] animate-float-slow text-white/[0.06]" strokeWidth={0.6} />
      <div className="pointer-events-none absolute -left-40 bottom-0 -z-10 h-96 w-96 animate-pulse rounded-full bg-primary/30 blur-3xl" />

      <div className="container grid gap-12 lg:grid-cols-[1fr_1.1fr_0.8fr] lg:items-center">
        <Reveal dir="left">
          <div id="contacts" className="scroll-mt-24">
            <Eyebrow light>Контакты</Eyebrow>
            <h2 className="font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">Свяжитесь с нами</h2>
            <p className="mt-3 text-white/70">Запишитесь на приём уже сегодня — администратор перезвонит в течение 15 минут.</p>
            <ul className="mt-8 space-y-5">
              {items.map(({ icon: Icon, content }, i) => (
                <li key={i} className="group flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-sky-300 ring-1 ring-white/15 transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-300 group-hover:text-navy">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="pt-2 text-white/90 transition-transform duration-300 group-hover:translate-x-1">{content}</div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={150} className="rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur transition-all duration-500 hover:bg-white/[0.09] hover:ring-sky-300/40 sm:p-8">
          <h3 className="mb-6 text-xl font-bold">Онлайн-запись</h3>
          <BookingForm />
        </Reveal>

        <Reveal dir="right" delay={300} className="hidden text-center lg:block">
          <ToothIcon className="mx-auto h-28 w-28 animate-float text-sky-200/80" strokeWidth={0.9} />
          <p className="mt-4 animate-wiggle font-script text-5xl leading-tight text-sky-100">
            Здоровые зубы —<br />счастливая жизнь
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  const socials: { label: string; href: string; icon: ReactNode }[] = [
    { label: "ВКонтакте", href: "#", icon: <span className="text-xs font-extrabold">VK</span> },
    { label: "Telegram", href: "#", icon: <Send className="h-4 w-4" /> },
    { label: "WhatsApp", href: "#", icon: <MessageCircle className="h-4 w-4" /> },
    { label: "E-mail", href: `mailto:${CONTACTS.email}`, icon: <Mail className="h-4 w-4" /> },
  ]
  const linkClass = "inline-block transition-all duration-300 hover:translate-x-1 hover:text-sky-300"
  return (
    <footer className="bg-navy-950 text-white/70">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm">Здоровые зубы — красивая улыбка. Современная стоматология для взрослых и детей.</p>
          <div className="mt-6 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:rotate-[10deg] hover:bg-primary hover:shadow-lg hover:shadow-primary/40"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 font-bold text-white">Навигация</p>
          <ul className="space-y-2.5">
            {[...NAV, { href: "#booking", label: "Запись на приём" }].map((item) => (
              <li key={item.href}>
                <a href={item.href} className={linkClass}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-bold text-white">Пациентам</p>
          <ul className="space-y-2.5">
            {["Цены", "Акции", "Врачи", "Лицензии", "Политика конфиденциальности"].map((l) => (
              <li key={l}>
                <a href="#" className={linkClass}>{l}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} «Белая улыбка». Все права защищены.</p>
          <p>Имеются противопоказания. Необходима консультация специалиста.</p>
        </div>
      </div>
    </footer>
  )
}

function BackToTop() {
  const { scrolled, progress } = useScroll()
  const show = scrolled && progress > 0.15
  return (
    <a
      href="#top"
      aria-label="Наверх"
      className={cn(
        "fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-primary text-white shadow-xl shadow-primary/40 transition-all duration-500 hover:-translate-y-1 hover:bg-navy",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </a>
  )
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <About />
        <Gallery />
        <Reviews />
        <CtaBanner />
        <BookingAndContacts />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
