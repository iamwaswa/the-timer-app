import { ThemeProvider } from "@mui/material";
import { act, render, screen } from "@testing-library/react";
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
  expect(screen.getByRole("button", { name: "Play / Pause" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Restart" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reset All" })).toBeInTheDocument();
});

it('should hide the "Reset All" action when resetAll is not provided', () => {
  render(
    <ThemeProvider theme={theme}>
      <TimerActions
        backgroundColor="rgb(255, 0, 0)"
        isPlaying={false}
        pause={vi.fn()}
        play={vi.fn()}
        reset={vi.fn()}
        resetAll={undefined}
        restart={vi.fn()}
      />
    </ThemeProvider>,
  );

  expect(screen.queryByRole("button", { name: "Reset All" })).not.toBeInTheDocument();
});

it("should trigger actions as expected", async () => {
  const pause = vi.fn();
  const play = vi.fn();
  const reset = vi.fn();
  const resetAll = vi.fn();
  const restart = vi.fn();
  const event = userEvent.setup();

  render(
    <ThemeProvider theme={theme}>
      <TimerActions
        backgroundColor="rgb(255, 0, 0)"
        isPlaying={false}
        pause={pause}
        play={play}
        reset={reset}
        resetAll={resetAll}
        restart={restart}
      />
    </ThemeProvider>,
  );

  expect(reset).not.toHaveBeenCalled();

  await act(() => event.click(screen.getByRole("button", { name: "Reset" })));

  expect(reset).toHaveBeenCalled();

  expect(play).not.toHaveBeenCalled();

  await act(() => event.click(screen.getByRole("button", { name: "Play / Pause" })));

  expect(play).toHaveBeenCalled();

  expect(restart).not.toHaveBeenCalled();

  await act(() => event.click(screen.getByRole("button", { name: "Restart" })));

  expect(restart).toHaveBeenCalled();

  expect(resetAll).not.toHaveBeenCalled();

  await act(() => event.click(screen.getByRole("button", { name: "Reset All" })));

  expect(resetAll).toHaveBeenCalled();
});

it('should pause when isPlaying is true and "Play / Pause" is clicked', async () => {
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

  await act(() => event.click(screen.getByRole("button", { name: "Play / Pause" })));

  expect(pause).toHaveBeenCalled();
});
