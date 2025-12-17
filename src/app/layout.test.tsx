import { metadata } from "./layout";

vi.mock("next/font/google", () => ({
  ...vi.importActual("next/font/google"),
  Roboto: () => ({
    variable: "mock-font-variable",
  }),
}));

it("should have the correct metadata title", () => {
  expect(metadata.title).toBe("The Timer App");
});
