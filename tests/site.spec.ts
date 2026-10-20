import AxeBuilder from "@axe-core/playwright";
import { type Page, expect, test } from "@playwright/test";
import { guideHref, guides } from "../src/lib/guides";
import { toolHref, tools } from "../src/lib/tools";

/*
 * The site as a visitor sees it, on a desktop browser and on a phone. Each
 * test here guards something that once broke, or that would quietly cost
 * someone a wrong number.
 */

/** Fails the test on any script error or console error on the page. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  return errors;
}

/** The big answer on a calculator page. */
const headline = (page: Page) => page.locator("p.font-serif.leading-none, p.font-serif.leading-tight").first();

test.describe("every calculator", () => {
  for (const t of tools) {
    test(`${t.slug} loads and answers`, async ({ page }) => {
      const errors = watchErrors(page);
      await page.goto(toolHref(t.slug));
      await expect(page.getByRole("heading", { level: 1 })).toContainText(t.name);
      const answer = await headline(page).innerText();
      expect(answer.trim()).not.toBe("");
      expect(answer).not.toMatch(/NaN|Infinity|undefined|—/);
      await expect(page.getByText("Rules and rates from")).toBeVisible();
      await expect(page.getByRole("region", { name: "How the answer is worked out" })).toBeVisible();
      const og = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(og).toContain(`/tools/og/${t.slug}.jpg`);
      expect(errors).toEqual([]);
    });
  }
});

test.describe("calculator behaviour", () => {
  test("a number can be cleared and retyped", async ({ page }) => {
    // Once, clearing the box snapped it straight back to the minimum.
    await page.goto(toolHref("emi-calculator"));
    const box = page.getByRole("textbox", { name: "I borrow", exact: true });
    await box.click();
    await box.press("ControlOrMeta+a");
    await box.press("Backspace");
    await box.pressSequentially("250000");
    await box.press("Enter");
    await expect(box).toHaveValue("2,50,000");
    await expect(headline(page)).toHaveText("₹2,249");
  });

  test("quick picks set the value", async ({ page }) => {
    await page.goto(toolHref("sip-calculator"));
    await page.getByRole("button", { name: "₹10k" }).click();
    await page.getByRole("button", { name: "20 yrs" }).click();
    await expect(headline(page)).toHaveText("₹99.9 L");
  });

  test("a link carries the numbers it was made with", async ({ page, context }) => {
    await page.goto(toolHref("sip-calculator"));
    await page.getByRole("button", { name: "₹10k" }).click();
    await page.getByRole("button", { name: "20 yrs" }).click();
    await expect(page).toHaveURL(/every-month-i-invest=10000/);
    const shared = page.url();

    const other = await context.newPage();
    await other.goto(shared);
    await expect(headline(other)).toHaveText("₹99.9 L");
  });

  test("an edited link cannot push a value out of range", async ({ page }) => {
    await page.goto(`${toolHref("emi-calculator")}?over=1000000000&i-borrow=-5&interest-rate=abc`);
    await expect(page.getByRole("textbox", { name: "Over", exact: true })).toHaveValue("30");
    await expect(page.getByRole("textbox", { name: "I borrow", exact: true })).toHaveValue("10,000");
    await expect(page.getByRole("textbox", { name: "Interest rate", exact: true })).toHaveValue("9");
  });

  test("rent receipts never put personal details in the address", async ({ page }) => {
    await page.goto(toolHref("rent-receipts"));
    await page.getByLabel("My name (tenant)").fill("Priya Sharma");
    await page.getByLabel("Landlord's PAN").fill("ABCDE1234F");
    await expect(page.locator(".print-area > div")).toHaveCount(12);
    await expect(page.locator(".print-area")).toContainText("Priya Sharma");
    expect(page.url()).not.toMatch(/priya|ABCDE/i);
  });
});

test.describe("finding things", () => {
  test("search finds a calculator outside the picked module", async ({ page }) => {
    // Once, "EMI" with Investing picked said there was no EMI calculator.
    await page.goto("/tools/");
    await page.getByRole("button", { name: /^Investing/ }).click();
    await page.getByRole("searchbox", { name: "Search calculators" }).fill("EMI");
    await expect(page.getByRole("link", { name: /EMI calculator/ })).toBeVisible();
  });

  test("search covers every guide whatever topic is picked", async ({ page }) => {
    await page.goto("/guides/?topic=Tax%2C%20made%20simple");
    await page.getByRole("searchbox", { name: "Search guides" }).fill("SIP");
    await expect(page.getByText(/Showing [1-9]\d* guides?/)).toBeVisible();
  });
});

test.describe("theme", () => {
  test("the toggle switches, remembers, and goes back to following the device", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to dark mode" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.getByRole("button", { name: "Switch to light mode" }).filter({ visible: true }).click();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /./);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  });
});

test.describe("accessibility (WCAG 2.2 AA)", () => {
  const pages = ["/", "/guides/", "/guides/sip/", "/tools/", toolHref("sip-calculator"), toolHref("tax-regime"), "/about/", "/survey/", "/privacy/", "/terms/"];
  for (const scheme of ["light", "dark"] as const) {
    for (const path of pages) {
      test(`${path} in ${scheme} mode`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(path);
        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
      });
    }
  }
});

test.describe("pages that must exist", () => {
  for (const path of ["/privacy/", "/terms/", "/sitemap.xml", "/robots.txt", "/llms.txt"]) {
    test(path, async ({ request }) => {
      expect((await request.get(path)).status()).toBe(200);
    });
  }

  test("a missing page gets the site's own 404", async ({ page }) => {
    const res = await page.goto("/no-such-page/");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("doesn't");
  });

  test("the footer links to privacy and terms", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy/");
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms/");
  });
});

test.describe("how it adds up", () => {
  test("the SIP diagram adds up to the answer", async ({ page }) => {
    await page.goto(toolHref("sip-calculator"));
    const how = page.getByRole("region", { name: "How the answer is worked out" });
    await expect(how).toContainText("₹9,00,000");
    await expect(how).toContainText("₹16,22,880");
    await expect(how).toContainText("₹25,22,880");
  });

  test("the diagram follows the inputs", async ({ page }) => {
    await page.goto(toolHref("sip-calculator"));
    await page.getByRole("button", { name: "₹10k" }).click();
    await expect(page.getByRole("region", { name: "How the answer is worked out" })).toContainText("₹18,00,000");
  });

  test("HRA marks the smallest of the three", async ({ page }) => {
    await page.goto(toolHref("hra-calculator"));
    await expect(page.getByRole("region", { name: "How the answer is worked out" }).getByText("Smallest", { exact: true })).toBeVisible();
  });
});

test.describe("keyboard", () => {
  test("the first Tab is the skip link, and it moves focus into the page", async ({ page, browserName }) => {
    // Safari only tabs to links with Option held, so its first stop differs by design.
    test.skip(browserName === "webkit", "Safari tabs to links only with Option held");
    await page.goto(toolHref("sip-calculator"));
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("option buttons move with the arrow keys", async ({ page }) => {
    await page.goto(toolHref("take-home-salary"));
    await page.getByRole("radio", { name: "A year" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: "A month" })).toBeFocused();
    await expect(page.getByRole("radio", { name: "A month" })).toHaveAttribute("aria-checked", "true");
  });

  test("every stop shows a focus ring", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "Safari tabs to links only with Option held");
    await page.goto(toolHref("sip-calculator"));
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      const ring = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return "none-focused";
        const cs = getComputedStyle(el);
        return cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0 ? "ok" : `${el.tagName} ${el.textContent?.trim().slice(0, 30)}`;
      });
      expect(ring, `Tab stop ${i + 1}`).toBe("ok");
    }
  });

  test("the phone menu keeps focus inside it", async ({ page, isMobile, browserName }) => {
    test.skip(!isMobile, "The full-screen menu is for phones");
    test.skip(browserName === "webkit", "Safari tabs to links only with Option held");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const inHeader = await page.evaluate(() => !!document.activeElement?.closest("header"));
      expect(inHeader, `Tab ${i + 1} left the menu`).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  });
});

test.describe("print", () => {
  test("printing keeps the answer and drops the rest", async ({ page }) => {
    await page.goto(toolHref("sip-calculator"));
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("header")).toBeHidden();
    await expect(page.locator("footer")).toBeHidden();
    await expect(page.locator('input[type="range"]').first()).toBeHidden();
    await expect(page.getByRole("button", { name: "Print or save as PDF" })).toBeHidden();
    await expect(headline(page)).toBeVisible();
    await expect(page.getByRole("region", { name: "How the answer is worked out" })).toBeVisible();
    await expect(page.getByText(/Worked out on .* Open these numbers again/)).toBeVisible();
  });
});

test("the report link names the page but never the numbers", async ({ page }) => {
  await page.goto(`${toolHref("sip-calculator")}?every-month-i-invest=10000`);
  const href = (await page.getByRole("link", { name: /Spotted a mistake/ }).getAttribute("href")) ?? "";
  expect(href).toMatch(/^mailto:/);
  expect(decodeURIComponent(href)).toContain("/tools/sip-calculator/");
  expect(href).not.toContain("10000");
});

test.describe("offline and install", () => {
  test("the app manifest is there", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.status()).toBe(200);
    const m = await res.json();
    expect(m.display).toBe("standalone");
    expect(m.icons.some((i: { purpose?: string }) => i.purpose === "maskable")).toBe(true);
  });

  test("a calculator opened once works offline, numbers and all", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "Playwright drives service workers in Chromium only");
    await page.goto(toolHref("sip-calculator"));
    await page.evaluate(() => navigator.serviceWorker.ready);
    // The first visit installs the worker; a reload passes through it and saves the page.
    await page.reload();
    await expect(headline(page)).toBeVisible();

    await context.setOffline(true);
    await page.goto(`${toolHref("sip-calculator")}?every-month-i-invest=10000&for=20`);
    await expect(headline(page)).toHaveText("₹99.9 L");

    await page.goto(toolHref("emi-calculator"));
    await expect(page.getByRole("heading", { level: 1 })).toContainText("offline");
    await context.setOffline(false);
  });
});

test.describe("every guide", () => {
  for (const g of guides) {
    test(`${g.slug} loads with its download`, async ({ page, request }) => {
      const errors = watchErrors(page);
      await page.goto(guideHref(g.slug));
      await expect(page.getByRole("heading", { level: 1 })).toContainText(g.title.replace(/[.,]$/, ""));
      if (g.pdf) {
        await expect(page.locator(`a[href="${g.pdf}"][download]`).first()).toBeAttached();
        expect((await request.get(g.pdf)).status()).toBe(200);
      }
      expect(errors).toEqual([]);
    });
  }
});
