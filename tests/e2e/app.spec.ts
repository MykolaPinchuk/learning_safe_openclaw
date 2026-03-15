import { expect, test } from "@playwright/test";

test("cautious path ends in low exposure recommendation", async ({ page }) => {
  await page.goto("/");
  const mainPanel = page.locator(".panel-main");
  await page.getByRole("button", { name: /start guided setup flow/i }).click();
  await page.getByRole("button", { name: /in a dedicated vm or spare machine/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /no browser or web automation/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /no third-party skills/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /no inbound channels yet/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /guarded and approval-heavy/i }).click();
  await page.getByRole("button", { name: /build recommendation/i }).click();

  await expect(mainPanel.getByText(/low exposure/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /export markdown plan/i })).toBeVisible();
});

test("convenience-first path ends in high exposure recommendation", async ({ page }) => {
  await page.goto("/");
  const mainPanel = page.locator(".panel-main");
  await page.getByRole("button", { name: /start guided setup flow/i }).click();
  await page.getByRole("button", { name: /on my main personal machine/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /full browser-driven tasks/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /broad marketplace access/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /broad messaging access/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /as autonomous as possible/i }).click();
  await page.getByRole("button", { name: /build recommendation/i }).click();

  await expect(mainPanel.getByText(/high exposure/i)).toBeVisible();
  await expect(
    page.getByText(/do not use your main personal machine as the default deployment target/i),
  ).toBeVisible();
});
