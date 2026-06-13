import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CopyButton } from "../src/components/CopyButton";

describe("CopyButton", () => {
  it("copies supplied text and shows copied state", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    render(<CopyButton text="Prompt text" />);
    await userEvent.click(screen.getByRole("button", { name: /copy prompt/i }));

    expect(writeText).toHaveBeenCalledWith("Prompt text");
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });
});
