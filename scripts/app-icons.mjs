/**
 * Draws the install icons in public/icons/ from src/app/icon.svg:
 * 192 and 512 for the app list, and a 512 "maskable" one with the mark
 * inside the safe zone, so Android's round or squircle crop never cuts it.
 *
 *   npm run icons
 */
import { mkdirSync, readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const svg = readFileSync("src/app/icon.svg", "utf8");
mkdirSync("public/icons", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

const draw = async (size, file, maskable) => {
  await page.setViewportSize({ width: size, height: size });
  // Maskable: a full square of the brand green, the mark at 70% in the middle.
  const inner = maskable ? Math.round(size * 0.7) : size;
  await page.setContent(
    `<html><body style="margin:0;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;background:${maskable ? "#124a3a" : "transparent"}">
      <div style="width:${inner}px;height:${inner}px">${svg.replace(/width="120" height="120"/, 'width="100%" height="100%"')}</div>
    </body></html>`,
  );
  await page.screenshot({ path: `public/icons/${file}`, omitBackground: !maskable });
};

await draw(192, "icon-192.png", false);
await draw(512, "icon-512.png", false);
await draw(512, "icon-maskable-512.png", true);
await browser.close();
console.log("app-icons: drew 3 icons into public/icons");
