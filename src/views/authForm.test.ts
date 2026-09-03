import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/errors";
import { MissingElementError, requireElementOfType } from "@/lib/dom";
import { authErrorMessage, messageSlot, runSubmit } from "@/views/authForm";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("messageSlot", () => {
  it("shows a message with textContent and clears the hidden attribute", () => {
    document.body.innerHTML = '<p id="slot" hidden></p>';
    const slot = messageSlot("#slot", document);

    slot.show("boom");

    const el = requireElementOfType("#slot", HTMLParagraphElement);
    expect(el.textContent).toBe("boom");
    expect(el.hidden).toBe(false);
  });

  it("clears the text and re-hides the element", () => {
    document.body.innerHTML = '<p id="slot"></p>';
    const slot = messageSlot("#slot", document);

    slot.show("boom");
    slot.clear();

    const el = requireElementOfType("#slot", HTMLParagraphElement);
    expect(el.textContent).toBe("");
    expect(el.hidden).toBe(true);
  });

  it("throws when the target element is missing", () => {
    expect(() => messageSlot("#slot", document)).toThrow(MissingElementError);
  });
});

describe("runSubmit", () => {
  function button(): HTMLButtonElement {
    document.body.innerHTML = '<button id="b">Go</button>';
    return requireElementOfType("#b", HTMLButtonElement);
  }
  const labels = { idle: "Go", busy: "Working..." };

  it("disables the button with the busy label while in flight and restores it after", async () => {
    const b = button();
    let resolveTask: (() => void) | undefined;
    const task = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveTask = resolve;
        }),
    );

    runSubmit(b, labels, task, vi.fn());

    expect(b.disabled).toBe(true);
    expect(b.getAttribute("aria-busy")).toBe("true");
    expect(b.textContent).toBe("Working...");

    resolveTask?.();
    await vi.waitFor(() => {
      expect(b.disabled).toBe(false);
    });
    expect(b.hasAttribute("aria-busy")).toBe(false);
    expect(b.textContent).toBe("Go");
  });

  it("routes a rejection to onError and still restores the button", async () => {
    const b = button();
    const cause = new Error("nope");
    const onError = vi.fn();

    runSubmit(b, labels, () => Promise.reject(cause), onError);

    await vi.waitFor(() => {
      expect(onError).toHaveBeenCalledWith(cause);
    });
    expect(b.disabled).toBe(false);
    expect(b.textContent).toBe("Go");
  });
});

describe("authErrorMessage", () => {
  it("returns the caller's message for an HTTP error", () => {
    expect(authErrorMessage(new ApiError("http", "HTTP 401"), "wrong creds")).toBe("wrong creds");
  });

  it("returns a connection message for a network error", () => {
    expect(authErrorMessage(new ApiError("network", "offline"), "x")).toContain(
      "Could not reach the store",
    );
  });

  it("falls back to a generic message for anything else", () => {
    expect(authErrorMessage(new Error("weird"), "x")).toBe("Something went wrong. Please try again.");
    expect(authErrorMessage(new ApiError("invalid-payload", "bad"), "x")).toBe(
      "Something went wrong. Please try again.",
    );
  });
});
