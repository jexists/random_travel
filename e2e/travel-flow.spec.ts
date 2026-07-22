import { expect, test } from "@playwright/test";

test("chooses a province directly and builds a day trip", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /여행.*어디로 갈까요/ })).toBeVisible();
  await page.getByRole("button", { name: /지도 다트/ }).click();
  await page.getByRole("button", { name: /시·도 먼저 선택/ }).click();
  await page.getByRole("button", { name: "서울특별시" }).click();

  await expect(page.getByRole("heading", { name: /서울특별시 어디로 갈까요/ })).toBeVisible();
  const stopButton = page.getByRole("button", { name: /여기에서 멈추기/ });
  await expect(stopButton).toBeEnabled({ timeout: 2_000 });
  await stopButton.click();

  await expect(page.getByRole("heading", { name: /얼마나 떠나볼까요/ })).toBeVisible({ timeout: 2_000 });
  await page.getByRole("button", { name: /당일치기/ }).click();

  await expect(page.getByText("당일치기 랜덤 코스가 완성됐어요!")).toBeVisible({ timeout: 5_000 });
  await expect(page.getByRole("link", { name: /카카오맵으로 열기/ })).toHaveAttribute("href", /map\.kakao\.com/);
  await expect(page.locator(".place-card")).toHaveCount(4);
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const widths = await page.evaluate(() => ({ body: document.body.scrollWidth, viewport: window.innerWidth }));
  expect(widths.body).toBeLessThanOrEqual(widths.viewport);
});
