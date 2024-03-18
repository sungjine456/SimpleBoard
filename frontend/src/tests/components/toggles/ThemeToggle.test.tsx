import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../../../components/contexts/ThemeContext";
import ThemeToggle from "../../../components/toggles/ThemeToggle";
import storage from "../../../utils/Storage";

let label: HTMLLabelElement;

beforeEach(() => {
  localStorage.clear();

  const { container } = render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );

  label = container.querySelector("label")!;
});

describe("테마 변경 테스트", () => {
  test("테마가 없을 때", async () => {
    expect(storage.get("theme")).toBeNull();
    expect(document.documentElement.getAttribute("data-theme")).toBeNull();

    await act(async () => userEvent.click(label));

    waitFor(() => {
      expect(storage.get("theme")).toBe("light");
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    });
  });

  test("테마가 dark일 때", async () => {
    document.documentElement.setAttribute("data-theme", "dark");

    expect(storage.get("theme")).toBeNull();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    await act(async () => userEvent.click(label));

    waitFor(() => {
      expect(storage.get("theme")).toBe("light");
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    });
  });

  test("테마가 light일 때", async () => {
    document.documentElement.setAttribute("data-theme", "light");

    expect(storage.get("theme")).toBeNull();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    await act(async () => userEvent.click(label));

    waitFor(() => {
      expect(storage.get("theme")).toBe("dark");
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    });
  });
});
