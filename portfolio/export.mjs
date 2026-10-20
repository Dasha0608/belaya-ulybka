// Экспорт модулей Behance и постов в PNG.
// Нужен запущенный сайт (npm run dev) на http://127.0.0.1:5173
// Запуск: node portfolio/export.mjs  [behance|posts]
import puppeteer from "puppeteer-core"
import { mkdirSync, existsSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const BASE = "http://127.0.0.1:5173/portfolio"
const OUT = join(dirname(fileURLToPath(import.meta.url)), "export")
const EDGE = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"].find(existsSync)

const JOBS = {
  behance: {
    width: 1400,
    modules: ["01-cover", "02-about", "03-structure", "04-style", "05-desktop-1", "06-desktop-2", "07-desktop-3", "08-motion", "09-mobile", "10-thanks"],
    hover: { "08-motion": "#hover-demo" },
  },
  posts: {
    width: 1080,
    modules: ["post-1", "post-2", "post-3", "post-4", "post-5", "story"],
    hover: { "post-3": "#hover-post" },
  },
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function waitForFrames(page) {
  // ждём, пока во всех iframe загрузятся картинки
  for (let i = 0; i < 40; i++) {
    const pending = await page.evaluate(() =>
      [...document.querySelectorAll("iframe")].reduce((n, f) => {
        const d = f.contentDocument
        if (!d || d.readyState !== "complete") return n + 1
        return n + [...d.images].filter((img) => !img.complete).length
      }, 0)
    )
    if (!pending) return
    await sleep(500)
  }
}

const only = process.argv[2]
// Если Edge уже запущен с --remote-debugging-port=9333 — подключаемся к нему, иначе запускаем сами
let connected = true
const browser = await puppeteer
  .connect({ browserURL: "http://127.0.0.1:9333", defaultViewport: null, protocolTimeout: 600000 })
  .catch(() => {
    connected = false
    return puppeteer.launch({
      executablePath: EDGE,
      headless: "new",
      protocolTimeout: 600000,
      userDataDir: join(OUT, ".profile"),
      args: ["--hide-scrollbars", "--disable-gpu", "--no-first-run", "--no-default-browser-check"],
    })
  })
try {
  for (const [page_, job] of Object.entries(JOBS)) {
    if (only && only !== page_) continue
    const dir = join(OUT, page_)
    mkdirSync(dir, { recursive: true })
    for (const name of job.modules) {
      // уже готовые файлы пропускаем; FORCE=1 — пересоздать всё
      if (!process.env.FORCE && existsSync(join(dir, `${name}.png`))) continue
      const page = await browser.newPage()
      await page.setViewport({ width: job.width, height: 2000 })
      await page.goto(`${BASE}/${page_}.html?only=${name}`, { waitUntil: "load", timeout: 120000 })
      await page.evaluate(() => document.fonts.ready)
      await sleep(2000) // pf.js обрезает и прокручивает iframe
      const el = await page.$(`.shot[data-name="${name}"]`)
      const { height } = await el.boundingBox()
      // весь модуль в видимой области — чтобы сработали анимации появления внутри сайта
      await page.setViewport({ width: job.width, height: Math.ceil(height) })
      await waitForFrames(page)
      await sleep(3500) // появление блоков и счётчики

      const hoverFrame = job.hover[name]
      if (hoverFrame) {
        await page.$eval(hoverFrame, (f) => (f.style.pointerEvents = "auto"))
        const handle = await page.$(hoverFrame)
        const frame = await handle.contentFrame()
        const cards = await frame.$$("#services a.group")
        const card = cards[1]
        const box = await card.boundingBox()
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
        await sleep(1200)
      }

      await el.screenshot({ path: join(dir, `${name}.png`) })
      console.log(`✓ ${page_}/${name}.png  ${job.width}×${Math.round(height)}`)
      await page.close()
    }
  }
} finally {
  // подключённый Edge не закрываем — им можно пользоваться для следующего экспорта
  if (connected) browser.disconnect()
  else await browser.close().catch(() => {})
}
