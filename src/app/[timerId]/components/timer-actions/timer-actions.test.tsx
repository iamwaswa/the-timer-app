import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { theme } from "@/theme";

import { TimerActions } from "./timer-actions";

it("should render as expected", () => {
  render(
    <ThemeProvider theme={theme}>
      <TimerActions
        backgroundColor="rgb(255, 0, 0)"
        isPlaying={false}
        pause={vi.fn()}
        play={vi.fn()}
        reset={vi.fn()}
        resetAll={vi.fn()}
        restart={vi.fn()}
      />
    </ThemeProvider>,
  );

  expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Restart" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reset All" })).toBeInTheDocument();
});

it("should trigger actions as expected", async () => {
  const reset = vi.fn();
  const resetAll = vi.fn();
  const restart = vi.fn();
  const event = userEvent.setup();

  render(
    <ThemeProvider theme={theme}>
      <TimerActions
        backgroundColor="rgb(255, 0, 0)"
        isPlaying={false}
        pause={vi.fn()}
        play={vi.fn()}
        reset={reset}
        resetAll={resetAll}
        restart={restart}
      />
    </ThemeProvider>,
  );

  expect(reset).not.toHaveBeenCalled();

  await event.click(screen.getByRole("button", { name: "Reset" }));

  expect(reset).toHaveBeenCalled();

  expect(restart).not.toHaveBeenCalled();

  await event.click(screen.getByRole("button", { name: "Restart" }));

  expect(restart).toHaveBeenCalled();

  expect(resetAll).not.toHaveBeenCalled();

  await event.click(screen.getByRole("button", { name: "Reset All" }));

  expect(resetAll).toHaveBeenCalled();
});

it('should pause when isPlaying is true and "Pause" is clicked', async () => {
  const pause = vi.fn();
  const event = userEvent.setup();

  render(
    <ThemeProvider theme={theme}>
      <TimerActions
        backgroundColor="rgb(255, 0, 0)"
        isPlaying={true}
        pause={pause}
        play={vi.fn()}
        reset={vi.fn()}
        resetAll={vi.fn()}
        restart={vi.fn()}
      />
    </ThemeProvider>,
  );

  expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Play" })).not.toBeInTheDocument();

  await event.click(screen.getByRole("button", { name: "Pause" }));

  expect(pause).toHaveBeenCalled();
});

it('should play when isPlaying is false and "Play" is clicked', async () => {
  const play = vi.fn();
  const event = userEvent.setup();

  render(
    <ThemeProvider theme={theme}>
      <TimerActions
        backgroundColor="rgb(255, 0, 0)"
        isPlaying={false}
        pause={vi.fn()}
        play={play}
        reset={vi.fn()}
        resetAll={vi.fn()}
        restart={vi.fn()}
      />
    </ThemeProvider>,
  );

  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Pause" })).not.toBeInTheDocument();

  await event.click(screen.getByRole("button", { name: "Play" }));

  expect(play).toHaveBeenCalled();
});
