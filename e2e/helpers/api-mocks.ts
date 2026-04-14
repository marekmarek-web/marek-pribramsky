import type { Page, Route } from "@playwright/test";

function isPost(route: Route): boolean {
  return route.request().method() === "POST";
}

/** Oddělí E2E od Resend/DB a od časovače `too_fast` na API. */
export async function mockLeadSubmitOk(page: Page): Promise<void> {
  await page.route("**/api/leads", async (route) => {
    if (!isPost(route)) {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, leadId: null }),
    });
  });
}

export async function mockSubscriberSubmitOk(page: Page): Promise<void> {
  await page.route("**/api/subscribers", async (route) => {
    if (!isPost(route)) {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, subscriberId: null, leadId: null }),
    });
  });
}
