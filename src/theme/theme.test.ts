import { expect, test } from "vitest";

import { theme } from "./theme";

test("MuiButton should have textTransform set to none for contained variant", () => {
  expect(theme.components?.MuiButton?.styleOverrides?.contained).toStrictEqual({ textTransform: "none" });
});

test("MuiButton should have textTransform set to none for text variant", () => {
  expect(theme.components?.MuiButton?.styleOverrides?.text).toStrictEqual({ textTransform: "none" });
});

test("MuiButton should have textTransform set to none for outlined variant", () => {
  expect(theme.components?.MuiButton?.styleOverrides?.outlined).toStrictEqual({ textTransform: "none" });
});

test("cssVariables should not be false", () => {
  expect(theme.cssVariables).toBeUndefined();
});

test("typography should have the correct fontFamily", () => {
  expect(theme.typography.fontFamily).toBe("var(--font-roboto)");
});
