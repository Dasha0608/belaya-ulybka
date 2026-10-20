// Запись демо-видео сайта: node portfolio/record.mjs [desktop|mobile]
// Нужны: сайт на http://127.0.0.1:5173 и Edge с --remote-debugging-port=9333
import puppeteer from "puppeteer-core"
import { mkdirSync, rmSync, writeFileSync, readFileSync } from "fs"
import { tmpdir } from "os"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const ROOT = dirname(fileURLToPath(import.meta.url))
const SITE = "http://127.0.0.1:5173/"
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
// повтор при EPERM/EBUSY — файл на секунду занят антивирусом
async function retry(fn, tries = 20) {
  for (let i = 0; ; i++) {
    try { return fn() } catch (e) { if (i >= tries || !["EPERM", "EBUSY", "EACCES"].includes(e.code)) throw e; await sleep(250) }
  }
}

// Видимый курсор: в записи экрана системного курсора нет
const CURSOR = `
  addEventListener("DOMContentLoaded", () => {
    const c = document.createElement("div")
    c.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24"><path d="M4 2l16 9.5-7 1.6 4.2 7.4-2.8 1.5-4.2-7.4L5 19z" fill="#0c2d4f" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>'
    c.style.cssText = "position:fixed;left:0;top:0;z-index:99999;pointer-events:none;transition:transform .12s linear;transform:translate(-100px,-100px);filter:drop-shadow(0 3px 6px rgba(0,0,0,.35))"
    document.documentElement.appendChild(c)
    addEventListener("mousemove", (e) => (c.style.transform = "translate(" + (e.clientX - 4) + "px," + (e.clientY - 2) + "px)"), true)
  })
`

const SCENES = {
  desktop: { viewport: { width: 1440, height: 900, deviceScaleFactor: 1 }, cursor: true },
  mobile: { viewport: { width: 390, height: 844, deviceScaleFactor: 2 }, cursor: false },
}

async function run(name) {
  const scene = SCENES[name]
  // кадры — во временную папку: в папке на рабочем столе антивирус блокирует частую запись
  const framesDir = join(tmpdir(), `bu-frames-${name}`)
  rmSync(framesDir, { recursive: true, force: true })
  mkdirSync(framesDir, { recursive: true })

  const browser = await puppeteer.connect({ browserURL: "http://127.0.0.1:9333", defaultViewport: null, protocolTimeout: 900000 })
  const page = await browser.newPage()
  page.setDefaultTimeout(180000)
  await page.setViewport(scene.viewport)
  if (scene.cursor) await page.evaluateOnNewDocument(CURSOR)

  // прогрев кэша фотографий, чтобы в записи они появлялись сразу
  await page.goto(SITE, { waitUntil: "networkidle2", timeout: 180000 })
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = "eager"
    await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))))
  })
  await page.goto("about:blank")

  // --- запись кадров ---
  const client = await page.target().createCDPSession()
  const frames = []
  let n = 0
  client.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
    const file = `${String(n++).padStart(5, "0")}.jpg`
    await retry(() => writeFileSync(join(framesDir, file), Buffer.from(data, "base64")))
    frames.push({ file, t: metadata.timestamp })
    client.send("Page.screencastFrameAck", { sessionId }).catch(() => {})
  })

  const W = scene.viewport.width
  const H = scene.viewport.height
  const dpr = scene.viewport.deviceScaleFactor
  await page.goto(SITE, { waitUntil: "domcontentloaded" })
  await client.send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: W * dpr, maxHeight: H * dpr, everyNthFrame: 1 })

  const mouse = { x: W / 2, y: H / 2 }
  const moveTo = async (x, y, ms = 600) => {
    const steps = Math.max(8, Math.round(ms / 25))
    const sx = mouse.x
    const sy = mouse.y
    for (let i = 1; i <= steps; i++) {
      const p = i / steps
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      await page.mouse.move(sx + (x - sx) * e, sy + (y - sy) * e)
      await sleep(ms / steps)
    }
    mouse.x = x
    mouse.y = y
  }
  const hover = async (selector, index = 0, ms = 600) => {
    const els = await page.$$(selector)
    const el = els[index]
    if (!el) return
    const b = await el.boundingBox()
    if (!b) return
    await moveTo(b.x + b.width / 2, b.y + b.height / 2, ms)
  }
  const scrollTo = (target, dur = 1400) =>
    page.evaluate(
      (target, dur) =>
        new Promise((res) => {
          document.documentElement.style.scrollBehavior = "auto"
          const el = typeof target === "string" ? document.querySelector(target) : null
          const y = el ? el.getBoundingClientRect().top + scrollY - 64 : target
          const s = scrollY
          const d = Math.min(y, document.documentElement.scrollHeight - innerHeight) - s
          const t0 = performance.now()
          const step = (now) => {
            const p = Math.min((now - t0) / dur, 1)
            const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
            scrollTo(0, s + d * e)
            p < 1 ? requestAnimationFrame(step) : res()
          }
          requestAnimationFrame(step)
        }),
      target,
      dur
    )
  const typeSlow = async (selector, text) => {
    await page.click(selector)
    await page.type(selector, text, { delay: 90 })
  }

  if (name === "desktop") {
    await sleep(3500) // появление первого экрана
    await hover("#top a[href='#booking']", 0, 900)
    await sleep(1200)
    await hover("#top a[href='#services'].rounded-full", 1, 700)
    await sleep(700)
    await hover("#top a[href='#services'].rounded-full", 4, 600)
    await sleep(700)
    await moveTo(W * 0.7, H * 0.55, 500)

    await scrollTo("#services", 1600)
    await sleep(900)
    for (const i of [0, 1, 2, 4]) {
      await hover("#services a.group", i, 650)
      await sleep(900)
    }
    await moveTo(W - 120, H / 2, 400)

    await scrollTo("#about", 1600)
    await sleep(800)
    await page.evaluate(() => scrollBy({ top: 420, behavior: "instant" }))
    await sleep(2600) // счётчики
    await hover("#about .group.border-border\\/70", 0, 700)
    await sleep(1000)

    await scrollTo("#gallery", 1400)
    await sleep(600)
    await hover("#gallery figure", 0, 600)
    await sleep(900)
    await hover("#gallery figure", 2, 700)
    await sleep(900)

    await scrollTo("#reviews", 1400)
    await sleep(700)
    await hover("#reviews .group", 1, 700)
    await sleep(1000)
    await hover("#reviews .group", 2, 600)
    await sleep(1000)

    await scrollTo("#booking", 1600)
    await sleep(900)
    await hover("#booking button[type=submit]", 0, 800)
    await sleep(500)
    await page.click("#booking button[type=submit]")
    await sleep(1400) // встряхивание и ошибки
    await hover("#name", 0, 500)
    await typeSlow("#name", "Дарья")
    await hover("#phone", 0, 400)
    await typeSlow("#phone", "9161234567")
    await hover("#service", 0, 400)
    await page.click("#service")
    await sleep(700)
    await hover("[role=option]", 3, 600)
    await sleep(400)
    await page.click("[role=option]:nth-child(4)")
    await sleep(600)
    await hover("#booking button[type=submit]", 0, 600)
    await sleep(400)
    await page.click("#booking button[type=submit]")
    await sleep(2600) // экран «Спасибо»

    await moveTo(W - 60, H - 60, 500)
    await scrollTo(0, 2200)
    await sleep(1500)
  } else {
    await sleep(3500)
    await scrollTo(380, 1200)
    await sleep(700)
    await scrollTo("#services", 1400)
    await sleep(900)
    await page.evaluate(() => scrollBy({ top: 520, behavior: "smooth" }))
    await sleep(1200)
    await scrollTo("#about", 1600)
    await sleep(700)
    await page.evaluate(() => document.querySelector("#about .mt-16")?.scrollIntoView({ block: "center" }))
    await sleep(2400)
    await scrollTo("#gallery", 1400)
    await sleep(1000)
    await scrollTo("#reviews", 1400)
    await sleep(1200)
    await page.evaluate(() => scrollBy({ top: 600, behavior: "smooth" }))
    await sleep(1200)
    await scrollTo("#booking", 1600)
    await sleep(900)
    await page.evaluate(() => document.querySelector("#booking form")?.scrollIntoView({ block: "center" }))
    await sleep(900)
    await typeSlow("#name", "Дарья")
    await typeSlow("#phone", "9161234567")
    await page.click("#service")
    await sleep(800)
    await page.click("[role=option]:nth-child(4)")
    await sleep(700)
    await page.click("#booking button[type=submit]")
    await sleep(2400)
    await scrollTo(0, 2200)
    await sleep(800)
    await page.click("header button[aria-label='Меню']")
    await sleep(1800)
    await page.click("header button[aria-label='Меню']")
    await sleep(800)
  }

  await client.send("Page.stopScreencast")
  await sleep(300)
  frames.sort((a, b) => a.t - b.t)
  const meta = { width: W * dpr, height: H * dpr, frames }
  const secs = frames.length ? frames[frames.length - 1].t - frames[0].t : 0
  console.log(`${name}: ${frames.length} кадров за ${secs.toFixed(1)} с (≈${(frames.length / secs).toFixed(1)} к/с)`)
  await page.close()

  // --- склейка в видео ---
  const enc = await browser.newPage()
  await enc.exposeFunction("getFrame", (i) => readFileSync(join(framesDir, frames[i].file)).toString("base64"))
  await enc.goto("http://127.0.0.1:5173/portfolio/encode.html")
  const info = await enc.evaluate((m) => window.encode(m), meta)
  const ext = info.mimeType.includes("mp4") ? "mp4" : "webm"
  mkdirSync(join(ROOT, "video"), { recursive: true })
  const out = join(ROOT, "video", `belaya-ulybka-${name}.${ext}`)
  const parts = []
  const CHUNK = 4 * 1024 * 1024
  for (let pos = 0; pos < info.size; pos += CHUNK) {
    const b64 = await enc.evaluate((s, l) => window.readChunk(s, l), pos, CHUNK)
    parts.push(Buffer.from(b64, "base64"))
  }
  await retry(() => writeFileSync(out, Buffer.concat(parts)))
  rmSync(framesDir, { recursive: true, force: true })
  console.log(`✓ ${out}  ${info.mimeType}  ${(info.size / 1e6).toFixed(1)} МБ, ${info.seconds.toFixed(1)} с`)
  await enc.close()
  browser.disconnect()
}

const which = process.argv[2]
for (const name of which ? [which] : ["desktop", "mobile"]) await run(name)
