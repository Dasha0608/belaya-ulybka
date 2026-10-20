// Ник для постов и финального модуля — поменяйте на свой
window.NICK = "@daniosy"

// Контурный зуб — тот же, что в логотипе сайта
const TOOTH_PATH =
  "M12 5.5C10.5 4 8.6 3.4 7 3.6 4.6 3.9 3.2 6 3.5 8.6c.3 2.3 1.4 3.6 1.8 5.4.5 2.4.6 6.4 2.4 6.4 1.6 0 1.7-3.2 2.3-4.9.4-1.1 1.1-1.6 2-1.6s1.6.5 2 1.6c.6 1.7.7 4.9 2.3 4.9 1.8 0 1.9-4 2.4-6.4.4-1.8 1.5-3.1 1.8-5.4.3-2.6-1.1-4.7-3.5-5-1.6-.2-3.5.4-5 1.9Z"

document.querySelectorAll("[data-tooth]").forEach((el) => {
  const sw = el.getAttribute("data-tooth") || "1"
  el.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${TOOTH_PATH}"/></svg>`
})

document.querySelectorAll("[data-nick]").forEach((el) => (el.textContent = window.NICK))

// Прокрутка встроенного сайта к нужному блоку: data-scroll="#about" или число пикселей
document.querySelectorAll("iframe[data-scroll]").forEach((frame) => {
  frame.addEventListener("load", () => {
    const target = frame.getAttribute("data-scroll")
    const go = () => {
      const doc = frame.contentDocument
      if (!doc) return
      doc.documentElement.style.scrollBehavior = "auto"
      const y = /^\d+$/.test(target) ? Number(target) : (doc.querySelector(target)?.getBoundingClientRect().top ?? 0) + frame.contentWindow.scrollY - 64
      frame.contentWindow.scrollTo(0, Math.max(0, y))
    }
    // ждём, пока React отрисует страницу
    setTimeout(go, 600)
    setTimeout(go, 1500)
  })
})

// Вырезать часть длинной страницы: data-from="#about" data-to="#reviews" (или "end").
// iframe получает высоту всей страницы, рамка показывает только кусок между блоками.
document.querySelectorAll("iframe[data-from]").forEach((frame) => {
  frame.addEventListener("load", () => {
    const clip = () => {
      const doc = frame.contentDocument
      if (!doc) return
      const top = (sel) => (sel === "end" ? doc.documentElement.scrollHeight : sel === "start" ? 0 : doc.querySelector(sel)?.getBoundingClientRect().top ?? 0)
      const from = top(frame.dataset.from)
      const to = top(frame.dataset.to)
      const s = Number(getComputedStyle(frame.parentElement).getPropertyValue("--s")) || 1
      frame.style.top = `${-from * s}px`
      frame.parentElement.style.height = `${(to - from) * s}px`
    }
    setTimeout(clip, 600)
    setTimeout(clip, 1500)
  })
})

// ?only=<data-name> — показать только один модуль (для экспорта в PNG)
const only = new URLSearchParams(location.search).get("only")
if (only) {
  document.body.style.background = "transparent"
  document.querySelectorAll(".shot").forEach((s) => {
    if (s.dataset.name !== only) s.remove()
    else s.style.margin = "0"
  })
}
