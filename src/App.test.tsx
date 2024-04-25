import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("Should change interval type in 25 minutes", async () => {
    await act(async () => {
      render(<App />);
    });

    const startButton = screen.getByTestId("start");
    const _break = screen.getByTestId("break");
    const session = screen.getByTestId("session");

    fireEvent.click(startButton);

    act(() => {
      vi.advanceTimersByTime(1501000); // 25min 1s
    });

    expect(session).not.toHaveClass("lettering--active");
    expect(_break).toHaveClass("lettering--active");
  });

  it("Should pause timer in 2 seconds", async () => {
    await act(async () => {
      render(<App />);
    });

    const startButton = screen.getByTestId("start");
    const pauseButton = screen.getByTestId("pause");
    const timer = screen.getByTestId("timer");

    fireEvent.click(startButton);

    act(() => {
      vi.advanceTimersByTime(2000); // 2s
    });

    fireEvent.click(pauseButton);

    act(() => {
      vi.advanceTimersByTime(2000); // 2s
    });

    expect(timer).toHaveTextContent("24:58");
    expect(pauseButton).toBeDisabled();
  });

  it("Should stop timer in 2 seconds", async () => {
    await act(async () => {
      render(<App />);
    });

    const startButton = screen.getByTestId("start");
    const stopButton = screen.getByTestId("stop");
    const timer = screen.getByTestId("timer");

    fireEvent.click(startButton);

    act(() => {
      vi.advanceTimersByTime(2000); // 2s
    });

    fireEvent.click(stopButton);

    expect(timer).toHaveTextContent("25:00");
  });

  it("Shouldn't increment break timer", async () => {
    await act(async () => {
      render(<App />);
    });

    const incrementBreakButton = screen.getAllByTestId("increment")[0];
    const timer = screen.getByTestId("timer");

    fireEvent.click(incrementBreakButton);

    expect(timer).toHaveTextContent("25:00");
  });

  it("Should increment session timer", async () => {
    await act(async () => {
      render(<App />);
    });

    const incrementSessionButton = screen.getAllByTestId("increment")[1];
    const timer = screen.getByTestId("timer");

    fireEvent.click(incrementSessionButton);

    expect(timer).toHaveTextContent("26:00");
  });

  it("Shouldn't decrement break timer", async () => {
    await act(async () => {
      render(<App />);
    });

    const decrementBreakButton = screen.getAllByTestId("decrement")[0];
    const timer = screen.getByTestId("timer");

    fireEvent.click(decrementBreakButton);

    expect(timer).toHaveTextContent("25:00");
  });

  it("Should decrement session timer", async () => {
    await act(async () => {
      render(<App />);
    });

    const decrementSessionButton = screen.getAllByTestId("decrement")[1];
    const timer = screen.getByTestId("timer");

    fireEvent.click(decrementSessionButton);

    expect(timer).toHaveTextContent("24:00");
  });
});
