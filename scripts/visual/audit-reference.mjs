// Auditoría visual de una página de referencia con Chrome real (playwright-core + Chrome instalado).
// Uso: node scripts/visual/audit-reference.mjs <url> <carpeta-salida>
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const url = process.argv[2] ?? "https://talamus.pro/";
const out = process.argv[3] ?? "audit-out";
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = {};

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 300) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}

// ---------- 1. Escritorio 1440: librerías, tipografía, colores, medidas ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  // Muestras de la animación inicial del hero (antes de networkidle)
  const heroSamples = [];
  for (const t of [0, 150, 400, 800, 1300, 2000, 3000]) {
    await page.waitForTimeout(t === 0 ? 0 : 1);
    const s = await page.evaluate(() => {
      const pick = (el) => {
        if (!el) return null;
        const cs = getComputedStyle(el);
        return { tag: el.tagName, cls: el.className?.toString().slice(0, 80), opacity: cs.opacity, transform: cs.transform, clip: cs.clipPath };
      };
      const h1 = document.querySelector("h1");
      const firstChildren = h1 ? [...h1.querySelectorAll("*")].slice(0, 6).map(pick) : [];
      return { t: performance.now(), h1: pick(h1), h1Children: firstChildren, header: pick(document.querySelector("header, nav")) };
    });
    heroSamples.push(s);
    await page.screenshot({ path: path.join(out, `hero-t${t}.png`) });
    if (t) await page.waitForTimeout(t - (heroSamples.at(-2)?.t ?? 0) > 0 ? 0 : 0);
  }
  report.heroSamples = heroSamples;

  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1500);

  report.libs = await page.evaluate(() => {
    const w = window;
    return {
      gsap: w.gsap?.version ?? null,
      ScrollTrigger: !!w.ScrollTrigger,
      SplitText: !!w.SplitText,
      lenisClass: document.documentElement.className,
      lenis: !!w.lenis || !!w.Lenis || document.documentElement.classList.contains("lenis"),
      locomotive: !!document.querySelector("[data-scroll-container]"),
      webflow: !!w.Webflow,
      jquery: w.jQuery?.fn?.jquery ?? null,
      three: !!w.THREE,
      swiper: !!w.Swiper,
      barba: !!w.barba,
      framer: !!document.querySelector("[data-framer-name]"),
      canvases: [...document.querySelectorAll("canvas")].map((c) => ({ w: c.width, h: c.height, cls: c.className, parent: c.parentElement?.className?.toString().slice(0, 60) })),
      videos: document.querySelectorAll("video").length,
      generator: document.querySelector('meta[name="generator"]')?.content ?? null,
      scripts: [...document.scripts].map((s) => s.src).filter(Boolean),
      stylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href),
    };
  });

  report.gsapInventory = await page.evaluate(() => {
    const w = window;
    const out = { tweens: [], triggers: [] };
    try {
      if (w.gsap) {
        const kids = w.gsap.globalTimeline.getChildren(true, true, true);
        out.tweens = kids.slice(0, 120).map((k) => {
          const v = { ...(k.vars || {}) };
          delete v.onComplete; delete v.onUpdate; delete v.onStart;
          const targets = k.targets ? k.targets().slice(0, 3).map((t) => (t.tagName ? `${t.tagName}.${(t.className || "").toString().slice(0, 40)}` : typeof t)) : [];
          return { type: k.constructor?.name, duration: k.duration?.(), delay: k.delay?.(), ease: v.ease?.toString?.() ?? v.ease, vars: JSON.stringify(v, (key, val) => (typeof val === "function" ? "fn" : val && val.nodeType ? "node" : val)).slice(0, 300), targets };
        });
      }
      if (w.ScrollTrigger) {
        out.triggers = w.ScrollTrigger.getAll().map((st) => ({
          trigger: st.trigger ? `${st.trigger.tagName}.${(st.trigger.className || "").toString().slice(0, 50)}` : null,
          start: st.vars.start, end: st.vars.end, scrub: st.vars.scrub ?? null, pin: !!st.vars.pin, toggleActions: st.vars.toggleActions ?? null,
        }));
      }
    } catch (e) { out.error = String(e); }
    return out;
  });

  report.cssAnimations = await page.evaluate(() =>
    document.getAnimations().slice(0, 60).map((a) => ({
      name: a.animationName ?? a.constructor.name,
      target: a.effect?.target ? `${a.effect.target.tagName}.${(a.effect.target.className || "").toString().slice(0, 50)}` : null,
      duration: a.effect?.getTiming?.().duration, delay: a.effect?.getTiming?.().delay, easing: a.effect?.getTiming?.().easing, iterations: a.effect?.getTiming?.().iterations,
    })),
  );

  report.typography = await page.evaluate(() => {
    const st = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { text: el.textContent.trim().slice(0, 60), fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, color: cs.color, textTransform: cs.textTransform };
    };
    return {
      body: st(document.body),
      h1: [...document.querySelectorAll("h1")].map(st),
      h2: [...document.querySelectorAll("h2")].slice(0, 10).map(st),
      h3: [...document.querySelectorAll("h3")].slice(0, 10).map(st),
      p: [...document.querySelectorAll("p")].slice(0, 8).map(st),
      blockquote: [...document.querySelectorAll("blockquote, q, [class*='quote']")].slice(0, 3).map(st),
      fontsLoaded: [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight} ${f.style}`),
    };
  });

  report.layout = await page.evaluate(() => {
    const rect = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
    const header = document.querySelector("header") || document.querySelector("nav");
    const sections = [...document.querySelectorAll("section, footer, header")].map((s) => {
      const cs = getComputedStyle(s);
      return { tag: s.tagName, cls: (s.className || "").toString().slice(0, 70), id: s.id, ...rect(s), bg: cs.backgroundColor, color: cs.color, radius: cs.borderRadius, padTop: cs.paddingTop, padBottom: cs.paddingBottom };
    });
    const containers = [...document.querySelectorAll("[class*='container'], [class*='wrapper'], [class*='inner']")].slice(0, 15).map((c) => { const cs = getComputedStyle(c); return { cls: (c.className || "").toString().slice(0, 60), maxWidth: cs.maxWidth, padL: cs.paddingLeft, padR: cs.paddingRight, ...rect(c) }; });
    const buttons = [...document.querySelectorAll("a[class*='button'], a[class*='btn'], button")].slice(0, 12).map((b) => { const cs = getComputedStyle(b); return { text: b.textContent.trim().slice(0, 40), bg: cs.backgroundColor, color: cs.color, radius: cs.borderRadius, pad: cs.padding, font: `${cs.fontSize}/${cs.fontWeight}`, transition: cs.transition, border: cs.border, ...rect(b) }; });
    const headerCs = header ? getComputedStyle(header) : null;
    return { docHeight: document.documentElement.scrollHeight, header: header ? { ...rect(header), position: headerCs.position, bg: headerCs.backgroundColor, transition: headerCs.transition } : null, sections, containers, buttons };
  });

  // Comportamiento del header al hacer scroll abajo / arriba
  const headerSel = (await page.$("header")) ? "header" : "nav";
  const hdr = async () => page.evaluate((sel) => { const el = document.querySelector(sel); const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return { top: Math.round(r.top), transform: cs.transform, bg: cs.backgroundColor, opacity: cs.opacity, cls: el.className.toString().slice(0, 80) }; }, headerSel);
  report.headerScroll = { atTop: await hdr() };
  await page.mouse.wheel(0, 1500); await page.waitForTimeout(1200);
  report.headerScroll.afterScrollDown = await hdr();
  await page.screenshot({ path: path.join(out, "scroll-down-1440.png") });
  await page.mouse.wheel(0, -400); await page.waitForTimeout(1200);
  report.headerScroll.afterScrollUp = await hdr();
  await page.screenshot({ path: path.join(out, "scroll-up-1440.png") });

  // Muestreo de elementos durante el scroll (detección de reveals y parallax)
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
  const vh = 900;
  const docH = report.layout.docHeight;
  report.scrollSamples = [];
  for (let y = 0; y < docH; y += 450) {
    await page.mouse.wheel(0, 450);
    await page.waitForTimeout(250);
    const sample = await page.evaluate(() => {
      const res = [];
      for (const el of document.querySelectorAll("h2, h3, p, img, a, [class*='card'], [class*='item']")) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const cs = getComputedStyle(el);
        if (cs.transform !== "none" || cs.opacity !== "1" || (cs.clipPath && cs.clipPath !== "none")) {
          res.push({ el: `${el.tagName}.${(el.className || "").toString().slice(0, 40)}`, text: el.textContent.trim().slice(0, 30), top: Math.round(r.top), opacity: cs.opacity, transform: cs.transform, clip: cs.clipPath });
        }
        if (res.length > 12) break;
      }
      return { scrollY: Math.round(scrollY), animating: res };
    });
    report.scrollSamples.push(sample);
    if (Math.round(y / 450) % 2 === 0) await page.screenshot({ path: path.join(out, `scroll-${String(Math.round(y)).padStart(5, "0")}.png`) });
  }

  // Hover de un botón
  const btn = await page.$("a[class*='button'], a[class*='btn']");
  if (btn) {
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600);
    const b = await btn.boundingBox();
    if (b) {
      await page.screenshot({ path: path.join(out, "button-before.png"), clip: { x: Math.max(0, b.x - 20), y: Math.max(0, b.y - 20), width: b.width + 40, height: b.height + 40 } });
      await btn.hover(); await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(out, "button-hover.png"), clip: { x: Math.max(0, b.x - 20), y: Math.max(0, b.y - 20), width: b.width + 40, height: b.height + 40 } });
      report.buttonHover = await btn.evaluate((el) => { const cs = getComputedStyle(el); return { bg: cs.backgroundColor, color: cs.color, transform: cs.transform, transition: cs.transition, html: el.outerHTML.slice(0, 600) }; });
    }
  }
  await ctx.close();
}

// ---------- 2. Capturas de página completa por viewport ----------
const viewports = [
  [1920, 1080], [1440, 900], [1366, 768], [768, 1024], [430, 932], [390, 844],
];
report.viewports = {};
for (const [w, h] of viewports) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(out, `fold-${w}.png`) });
  await scrollThrough(page);
  report.viewports[`${w}x${h}`] = await page.evaluate(() => {
    const h1 = document.querySelector("h1"); const h2 = document.querySelector("h2");
    const header = document.querySelector("header") || document.querySelector("nav");
    const vis = (sel) => [...document.querySelectorAll(sel)].filter((e) => e.offsetParent !== null).length;
    return {
      docHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      h1Size: h1 ? getComputedStyle(h1).fontSize : null,
      h2Size: h2 ? getComputedStyle(h2).fontSize : null,
      headerH: header ? Math.round(header.getBoundingClientRect().height) : null,
      visibleNavLinks: vis("header a, nav a"),
      hamburger: [...document.querySelectorAll("button, [class*='burger'], [class*='menu-button'], [class*='toggle']")].filter((e) => e.offsetParent !== null).map((e) => (e.className || "").toString().slice(0, 50)).slice(0, 4),
    };
  });
  await page.screenshot({ path: path.join(out, `full-${w}.png`), fullPage: true });

  // Menú móvil / hamburguesa
  if (w <= 768 || w === 1440) {
    const burger = await page.$("[class*='burger'], [class*='hamburger'], [class*='menu-button'], [class*='menu_button'], button[aria-label*='enu'], [class*='nav-toggle'], [class*='menu-toggle']");
    if (burger && (await burger.isVisible())) {
      await burger.click().catch(() => {});
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(out, `menu-${w}-t250.png`) });
      await page.waitForTimeout(900);
      await page.screenshot({ path: path.join(out, `menu-${w}-open.png`) });
      report.viewports[`${w}x${h}`].menu = await page.evaluate(() => {
        const cands = [...document.querySelectorAll("[class*='menu'], [class*='nav']")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > innerWidth * 0.5 && r.height > innerHeight * 0.5; });
        return cands.slice(0, 3).map((e) => { const cs = getComputedStyle(e); return { cls: (e.className || "").toString().slice(0, 60), bg: cs.backgroundColor, transition: cs.transition, transform: cs.transform, position: cs.position }; });
      });
    }
  }
  await ctx.close();
}

fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2));
await browser.close();
console.log("OK", out);
