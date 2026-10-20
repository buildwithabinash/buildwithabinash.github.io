import { existsSync } from "node:fs";
import { expect, test } from "@playwright/test";
import * as money from "../src/lib/money";
import { coverHref, guideOgHref, guides } from "../src/lib/guides";
import { sourcesFor, toolOgHref, tools } from "../src/lib/tools";

/*
 * The maths behind every calculator, checked against answers worked out by
 * hand, or taken from official charts and standard tables. If one of these
 * fails after a change, the calculator would be showing people a wrong number.
 */

const near = (actual: number, expected: number, within = 1) => expect(Math.abs(actual - expected)).toBeLessThanOrEqual(within);

test.describe("income tax", () => {
  test("new regime: ₹12.75 lakh salary pays nothing after the rebate", () => {
    // 12,75,000 less the 75,000 standard deduction is exactly the 12 lakh rebate limit.
    expect(money.incomeTax(1275000, "new").total).toBe(0);
  });

  test("new regime: ₹15 lakh salary", () => {
    // Taxable 14,25,000: 20,000 + 40,000 + 33,750 = 93,750, plus 4% cess.
    near(money.incomeTax(1500000, "new").total, 97500);
  });

  test("new regime: marginal relief just past the rebate limit", () => {
    // Taxable 12,10,000: slab tax 61,500 is capped at the 10,000 over the limit, plus cess.
    near(money.incomeTax(1285000, "new").total, 10400);
  });

  test("old regime: ₹15 lakh with ₹2 lakh of deductions", () => {
    // Taxable 12,50,000: 12,500 + 1,00,000 + 75,000 = 1,87,500, plus cess.
    near(money.incomeTax(1500000, "old", 200000).total, 195000);
  });

  test("non-residents get no rebate", () => {
    near(money.taxOnIncome(1000000, "new", true).total, 0);
    near(money.taxOnIncome(1000000, "new", false).total, 41600);
  });

  test("the tax year label is the current one", () => {
    // Fails each April until the slabs are re-checked and TAX_YEAR_START is bumped.
    const now = new Date();
    const current = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    expect(money.TAX_YEAR_START, "Re-check the slabs in money.ts and bump TAX_YEAR_START").toBe(current);
    expect(money.ADVANCE_TAX_DATES[0].iso).toBe(`${current}-06-15`);
  });
});

test.describe("growth", () => {
  test("SIP: ₹5,000 a month for 15 years at 12%", () => {
    // 5,000 × ((1.01^180 − 1) / 0.01) × 1.01, paid at the start of each month.
    near(money.sip(5000, 15, 12).future, 2522880, 2);
  });

  test("lumpsum doubles in 6 years at 12.25%", () => {
    near(money.lumpsum(100000, 6, 12.2462).future, 200000, 5);
  });

  test("CAGR of a doubling in 10 years", () => {
    near(money.cagr(100000, 200000, 10).rate, 7.177, 0.01);
  });

  test("XIRR: ₹1,000 in, ₹1,100 back a year later is 10%", () => {
    near(
      money.xirr([
        { date: "2023-01-01", amount: -1000 },
        { date: "2024-01-01", amount: 1100 },
      ]),
      10,
      0.001,
    );
  });

  test("XIRR is undefined without money both in and out", () => {
    expect(money.xirr([{ date: "2024-01-01", amount: -1000 }])).toBeNaN();
  });
});

test.describe("loans", () => {
  test("EMI on ₹10 lakh over 20 years at 9% is ₹8,997", () => {
    near(money.emi(1000000, 20, 9).monthly, 8997, 1);
  });

  test("the yearly breakdown adds up to the total interest", () => {
    const rows = money.amortise(1000000, 20, 9);
    near(
      rows.reduce((s, r) => s + r.interest, 0),
      money.emi(1000000, 20, 9).interest,
      1,
    );
    near(rows[rows.length - 1].balance, 0, 1);
  });

  test("a 7% flat car loan rate is about 12.5% reducing", () => {
    const r = money.carLoan({ price: 800000, down: 100000, years: 5, ratePct: 7, flat: true });
    expect(r.effectiveRate).toBeGreaterThan(12.3);
    expect(r.effectiveRate).toBeLessThan(12.7);
  });
});

test.describe("schemes", () => {
  test("Atal Pension matches the official chart", () => {
    expect(money.apy(18, 1000).monthly).toBe(42);
    expect(money.apy(30, 5000).monthly).toBe(577);
    expect(money.apy(40, 5000).monthly).toBe(1454);
    expect(money.apy(30, 5000).corpus).toBe(850000);
  });
});

test.describe("tax tools", () => {
  test("GST comes back out of a price that includes it", () => {
    const r = money.gst(118, 18, "remove");
    near(r.base, 100, 0.001);
    near(r.tax, 18, 0.001);
  });

  test("advance tax instalments are 15, 45, 75 and 100%", () => {
    const r = money.advanceTax({ salary: 0, other: 2000000, regime: "new", deductions: 0, tds: 0, presumptive: false });
    expect(r.schedule.map((d) => d.share)).toEqual([0.15, 0.45, 0.75, 1]);
    near(r.schedule[3].amount, r.net, 0.01);
    expect(r.due).toBe(true);
  });

  test("advance tax is not due under ₹10,000", () => {
    // A ₹12.75 lakh salary owes nothing at all in the new regime.
    const r = money.advanceTax({ salary: 1275000, other: 0, regime: "new", deductions: 0, tds: 0, presumptive: false });
    expect(r.due).toBe(false);
  });

  test("residency: 182 days makes you resident", () => {
    const r = money.residency({ days: 200, daysLast4: 0, indian: true, indianIncome: 0, taxedAbroad: true, nrYearsOf10: 0, daysLast7: 2000 });
    expect(r.status).toBe("ROR");
  });

  test("residency: the 120-day rule makes you not ordinarily resident", () => {
    const r = money.residency({ days: 130, daysLast4: 400, indian: true, indianIncome: 2000000, taxedAbroad: true, nrYearsOf10: 3, daysLast7: 2000 });
    expect(r.status).toBe("RNOR");
  });

  test("residency: deemed resident when Indian income is high and untaxed abroad", () => {
    const r = money.residency({ days: 30, daysLast4: 100, indian: true, indianIncome: 2000000, taxedAbroad: false, nrYearsOf10: 10, daysLast7: 100 });
    expect(r.status).toBe("RNOR");
  });

  test("residency: a short visit stays non-resident", () => {
    const r = money.residency({ days: 130, daysLast4: 400, indian: true, indianIncome: 500000, taxedAbroad: true, nrYearsOf10: 3, daysLast7: 2000 });
    expect(r.status).toBe("NR");
  });

  test("tax harvesting uses only the room left in the ₹1.25 lakh limit", () => {
    const r = money.taxHarvest(300000, 25000, 1);
    expect(r.book).toBe(100000);
    near(r.savedNow, 13000);
  });
});

test.describe("every calculator", () => {
  for (const t of tools) {
    test(`${t.slug} has sources and a social card`, () => {
      expect(sourcesFor(t.slug).length).toBeGreaterThan(0);
      expect(existsSync(`public${toolOgHref(t.slug)}`), "Run npm run og:tools").toBe(true);
    });
  }
});

test.describe("every guide", () => {
  for (const g of guides) {
    test(`${g.slug} has its PDF, cover and social card`, () => {
      if (g.pdf) expect(existsSync(`public${g.pdf}`), `missing ${g.pdf}`).toBe(true);
      expect(existsSync(`public${coverHref(g.slug)}`), "missing cover").toBe(true);
      expect(existsSync(`public${guideOgHref(g.slug)}`), "missing social card").toBe(true);
    });
  }
});
