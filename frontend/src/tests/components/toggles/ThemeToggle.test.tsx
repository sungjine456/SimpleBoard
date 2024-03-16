import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../../../components/contexts/ThemeContext";
import ThemeToggle from "../../../components/toggles/ThemeToggle";
import storage from "../../../utils/Storage";

const dark = "#282c34";
const white = "#e6e6e6";

beforeEach(() => {
  localStorage.clear();
});

test("light mode", async () => {
  const { container } = render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );

  document.documentElement.setAttribute("data-theme", "dark");

  expect(storage.get("theme")).toBeNull();
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

  const label = container.querySelector("label");

  if (label) await act(async () => userEvent.click(label));

  waitFor(() => {
    expect(storage.get("theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });
});

test("dark mode", async () => {
  const { container } = render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );

  document.documentElement.setAttribute("data-theme", "light");

  expect(storage.get("theme")).toBeNull();
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");

  const label = container.querySelector("label");

  if (label) await act(async () => userEvent.click(label));

  waitFor(() => {
    expect(storage.get("theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
