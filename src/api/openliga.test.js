import { getCurrentSeasonYear } from "./openliga";

describe("getCurrentSeasonYear", () => {
  test("uses the current year from July through December", () => {
    expect(getCurrentSeasonYear(new Date(2026, 6, 1))).toBe(2026);
    expect(getCurrentSeasonYear(new Date(2026, 11, 15))).toBe(2026);
  });

  test("uses the previous year from January through June", () => {
    expect(getCurrentSeasonYear(new Date(2027, 0, 1))).toBe(2026);
    expect(getCurrentSeasonYear(new Date(2027, 5, 30))).toBe(2026);
  });
});
