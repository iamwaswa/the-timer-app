import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import type { TimersContextType } from "./timers.context";
import { useTimersContext } from "./timers.context.hook";
import { TimersContextProvider, TimersContextProviderClientOnlyComponent } from "./timers.context.provider";

let originalWindowLocalStorage: typeof window.localStorage;

const getItemMock = vi.fn();

const setItemMock = vi.fn();

beforeEach(() => {
  originalWindowLocalStorage = window.localStorage;
  vi.resetAllMocks();
});

afterEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: originalWindowLocalStorage,
    configurable: true,
  });
});

function TimersContextConsumer() {
  const [timers, setTimers] = useTimersContext();
  return (
    <>
      <div data-testid="timers-value">{JSON.stringify(timers)}</div>
      <button onClick={() => setTimers([])} />
    </>
  );
}

it("should render the client-only component asynchronously", async () => {
  render(
    <TimersContextProviderClientOnlyComponent>
      <div data-testid="timers-context-provider-children" />
    </TimersContextProviderClientOnlyComponent>,
  );

  // Use findBy queries to wait for the async component to render
  expect(await screen.findByTestId("timers-context-provider-children")).toBeInTheDocument();
});

it("should save timers to localStorage when they are updated", async () => {
  const event = userEvent.setup();
  const initialTimers = [
    {
      id: "initial-timer-1",
      numIterations: 12,
      title: "Initial Timer 1",
      timerIntervals: [{ id: "initial-timer-interval-1", duration: 1000, title: "initial interval 1" }],
    },
  ];
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: getItemMock.mockImplementation(() => JSON.stringify(initialTimers)),
      setItem: setItemMock,
    },
    configurable: true,
  });

  render(
    <TimersContextProvider>
      <TimersContextConsumer />
    </TimersContextProvider>,
  );

  expect(screen.getByTestId("timers-value")).toHaveTextContent(JSON.stringify(initialTimers));
  expect(getItemMock).toHaveBeenCalledTimes(1);
  expect(setItemMock).not.toHaveBeenCalled();

  await event.click(screen.getByRole("button"));

  const updatedTimers: TimersContextType["timers"] = [];
  expect(screen.getByTestId("timers-value")).toHaveTextContent(JSON.stringify(updatedTimers));
  expect(getItemMock).toHaveBeenCalledTimes(1);
  expect(setItemMock).toHaveBeenCalledTimes(1);
  expect(setItemMock).toHaveBeenCalledWith("timers", JSON.stringify(updatedTimers));
});

it("should handle empty localStorage", () => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: getItemMock.mockImplementation(() => null),
      setItem: setItemMock,
    },
    configurable: true,
  });

  render(
    <TimersContextProvider>
      <TimersContextConsumer />
    </TimersContextProvider>,
  );

  expect(screen.getByTestId("timers-value")).toHaveTextContent("[]");
  expect(getItemMock).toHaveBeenCalledTimes(1);
  expect(setItemMock).not.toHaveBeenCalled();
});

it("should handle localStorage not defined", () => {
  Object.defineProperty(window, "localStorage", {
    value: undefined,
    configurable: true,
  });

  render(
    <TimersContextProvider>
      <TimersContextConsumer />
    </TimersContextProvider>,
  );

  expect(screen.getByTestId("timers-value")).toHaveTextContent("[]");
  expect(getItemMock).not.toHaveBeenCalled();
  expect(setItemMock).not.toHaveBeenCalled();
});

it.each(["not a json string", "{}"])('should handle unexpected JSON from localStorage = "%s"', (json) => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: getItemMock.mockImplementation(() => json),
      setItem: setItemMock,
    },
    configurable: true,
  });

  render(
    <TimersContextProvider>
      <TimersContextConsumer />
    </TimersContextProvider>,
  );

  expect(screen.getByTestId("timers-value")).toHaveTextContent("[]");
  expect(getItemMock).toHaveBeenCalledTimes(1);
  expect(setItemMock).not.toHaveBeenCalled();
});
