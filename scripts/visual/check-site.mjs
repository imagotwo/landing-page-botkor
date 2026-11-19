// Validación visual y funcional de la landing con Chrome real.
// Uso: node scripts/visual/check-site.mjs <baseUrl> <carpeta-salida>
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "visual-out";
const url = `${base}/creacion-paginas-web-profesionales`;
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const results = { consoleErrors: [], pageErrors: [], failedRequests: [], checks: {} };

function watch(page, label) {
  page.on("console", (m) => m.type() === "error" && results.consoleErrors.push(`[${label}] ${m.text()}`));
  page.on("pageerror", (e) => results.pageErrors.push(`[${label}] ${e.message}`));
  page.on("requestfailed", (r) => results.failedRequests.push(`[${label}] ${r.url()} ${r.failure()?.errorText}`));
}

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 350) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(1200);
}

for (const vp of [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1366", width: 1366, height: 768 },
  { name: "tablet-768", width: 768, height: 1024, mobile: true },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.mobile, hasTouch: !!vp.mobile });
  const page = await ctx.newPage();
  watch(page, vp.name);
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, `${vp.name}-t400.png`) });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: path.join(out, `${vp.name}-fold.png`) });

  // Header: ocultar al bajar / mostrar al subir
  if (vp.name === "desktop-1440") {
    await page.mouse.wheel(0, 1400); await page.waitForTimeout(1200);
    const down = await page.evaluate(() => document.querySelector("header").getBoundingClientRect().top);
    await page.mouse.wheel(0, -300); await page.waitForTimeout(1200);
    const up = await page.evaluate(() => { const h = document.querySelector("header"); return { top: h.getBoundingClientRect().top, bg: getComputedStyle(h).backgroundColor }; });
    results.checks.headerHideShow = { afterDownTop: down, afterUp: up };
    await page.screenshot({ path: path.join(out, `${vp.name}-header-up.png`) });
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
  }

  await scrollThrough(page);
  results.checks[vp.name] = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    hiddenReveals: [...document.querySelectorAll("[data-reveal]")].filter((e) => !e.classList.contains("is-inview")).length,
    totalReveals: document.querySelectorAll("[data-reveal]").length,
    h1: document.querySelectorAll("h1").length,
    lenis: document.documentElement.classList.contains("lenis"),
    motion: document.documentElement.classList.contains("motion"),
    h1Size: getComputedStyle(document.querySelector("h1")).fontSize,
  }));
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(out, `${vp.name}-full.png`), fullPage: true });

  // Secciones individuales (solo desktop y móvil)
  if (vp.name === "desktop-1440" || vp.name === "mobile-390") {
    for (const id of ["soluciones", "automatizacion", "seguridad", "soporte", "tecnologia", "por-que-botkor", "sectores", "proceso", "preguntas-frecuentes", "cotizar"]) {
      const el = await page.$(`#${id}`);
      if (!el) continue;
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      await page.evaluate((i) => document.getElementById(i).scrollIntoView({ block: "start" }), id);
      await page.waitForTimeout(900);
      await page.screenshot({ path: path.join(out, `${vp.name}-sec-${id}.png`) });
    }
  }

  // Menú
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600);
  const toggle = page.getByRole("button", { name: /abrir menú/i });
  await toggle.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(out, `${vp.name}-menu.png`) });
  results.checks[`${vp.name}-menu`] = await page.evaluate(() => ({
    expanded: document.querySelector("[aria-controls]")?.getAttribute("aria-expanded"),
    focused: document.activeElement?.textContent?.trim().slice(0, 30),
  }));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  results.checks[`${vp.name}-menu-closed`] = await page.evaluate(() => ({
    expanded: document.querySelector("[aria-controls]")?.getAttribute("aria-expanded"),
    focused: document.activeElement?.getAttribute("aria-label"),
  }));
  await ctx.close();
}

// Hover del botón + validación del formulario (desktop)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  watch(page, "form");
  await page.goto(url, { waitUntil: "networkidle" });
  const btn = page.locator("main a.btn").first();
  await page.waitForTimeout(1500);
  const bb = await btn.boundingBox();
  await page.screenshot({ path: path.join(out, "btn-before.png"), clip: { x: bb.x - 12, y: bb.y - 12, width: bb.width + 24, height: bb.height + 24 } });
  await btn.hover(); await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(out, "btn-hover.png"), clip: { x: bb.x - 12, y: bb.y - 12, width: bb.width + 24, height: bb.height + 24 } });

  await page.evaluate(() => document.getElementById("cotizar").scrollIntoView());
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: /solicitar mi cotización/i }).click();
  await page.waitForTimeout(400);
  results.checks.formEmptySubmit = await page.evaluate(() => ({
    errors: [...document.querySelectorAll(".field-error")].map((e) => e.textContent),
    focused: document.activeElement?.getAttribute("name"),
  }));
  await page.locator("#cotizar form").screenshot({ path: path.join(out, "form-errors.png") });

  await page.fill('input[name="fullName"]', "Laura Gómez");
  await page.fill('input[name="company"]', "Acme");
  await page.selectOption('select[name="sector"]', "salud");
  await page.fill('input[name="contact"]', "laura@acme.co");
  await page.locator("label", { hasText: "Landing Page" }).click();
  await page.waitForTimeout(3000); // supera la trampa de tiempo (2,5 s)
  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/lead")),
    page.getByRole("button", { name: /solicitar mi cotización/i }).click(),
  ]);
  results.checks.formSubmit = { status: resp.status(), body: await resp.json().catch(() => null) };
  await page.waitForTimeout(800);
  await page.locator("#cotizar").screenshot({ path: path.join(out, "form-after-submit.png") });
  await ctx.close();
}

// Reduced motion: todo visible sin animaciones
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  watch(page, "reduced");
  await page.goto(url, { waitUntil: "networkidle" });
  results.checks.reducedMotion = await page.evaluate(() => ({
    motionClass: document.documentElement.classList.contains("motion"),
    invisible: [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity === "0").length,
  }));
  await ctx.close();
}

// Sin JavaScript: contenido visible
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load" });
  results.checks.noJs = await page.evaluate(() => ({
    invisible: [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity === "0").length,
    faqAnswers: document.querySelectorAll("details p").length,
  }));
  await page.screenshot({ path: path.join(out, "nojs-full.png"), fullPage: true });
  await ctx.close();
}

fs.writeFileSync(path.join(out, "results.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
