import { ReactNode, createContext } from "react";
import storage from "../../utils/Storage";

enum Theme {
  light = "light",
  dark = "dark",
}

interface IThemeContext {
  theme: Theme;
  toggle: () => void;
}

const localTheme = storage.get("theme");

let theme = localTheme ? localTheme : Theme.light;

const toggle = () => {
  theme = theme === "light" ? "dark" : "light";
  storage.set("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
};

const ThemeContext = createContext<IThemeContext>({
  theme: theme,
  toggle: toggle,
});

const ThemeProvider = ({ children }: { children?: ReactNode }) => {
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider, Theme };
