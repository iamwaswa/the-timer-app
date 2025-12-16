import { render, screen } from "@testing-library/react";

import RootLayout, { metadata } from "./layout";

vi.mock("next/font/google", () => ({
  ...vi.importActual("next/font/google"),
  Roboto: () => ({
    variable: "mock-font-variable",
  }),
}));

it("should render children", () => {
  render(
    <RootLayout>
      <div>child</div>
    </RootLayout>,
  );
  expect(screen.getByText("child")).toBeInTheDocument();
});

it("should have the correct metadata title", () => {
  expect(metadata.title).toBe("The Timer App");
});
