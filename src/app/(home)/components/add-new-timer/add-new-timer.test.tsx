import { render, screen } from "@testing-library/react";

import { AddNewTimer } from "./add-new-timer";

it("should render the add new timer card with the correct link and title", () => {
  const itemHeight = 100;

  render(<AddNewTimer itemHeight={itemHeight} />);

  expect(screen.getByRole("link", { name: "Add new timer" })).toHaveAttribute("href", "/new");
  expect(screen.getByRole("link", { name: "Add new timer" }).closest(".MuiCard-root")).toHaveStyle(
    `height: ${itemHeight}px`,
  );
});

it("should render with undefined height", () => {
  render(<AddNewTimer itemHeight={undefined} />);
  expect(screen.getByRole("link", { name: "Add new timer" }).closest(".MuiCard-root")).not.toHaveStyle("height: 0px");
});
