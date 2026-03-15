import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the orientation knowledge check", () => {
    render(<App />);

    expect(screen.getByText("Quick check")).toBeInTheDocument();
  });

  it("enables forward navigation after selecting an answer", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /start guided setup flow/i }));

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /on my main personal machine/i }));

    expect(continueButton).toBeEnabled();
  });

  it("preserves earlier answers when navigating back", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /start guided setup flow/i }));
    await user.click(screen.getByRole("button", { name: /on my main personal machine/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /limited web access for research/i }));
    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(screen.getByRole("button", { name: /on my main personal machine/i })).toHaveClass(
      "selected",
    );
  });

  it("updates the plan after answers are completed", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /start guided setup flow/i }));
    await user.click(screen.getByRole("button", { name: /in a dedicated vm or spare machine/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /no browser or web automation/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /no third-party skills/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /no inbound channels yet/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /guarded and approval-heavy/i }));
    await user.click(screen.getByRole("button", { name: /build recommendation/i }));

    expect(
      screen.getByText(/cautious learning-first posture/i),
    ).toBeInTheDocument();
  });
});
