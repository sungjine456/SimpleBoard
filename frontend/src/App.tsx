import { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "./components/contexts/AuthContext";
import { ThemeContext } from "./components/contexts/ThemeContext";
import Header from "./components/layouts/Header";
import Routes from "./routes/Routes";
import "./styles/components/Button.scss";
import "./styles/components/Form.scss";
import "./styles/components/Icons.scss";
import "./styles/components/Table.scss";
import "./styles/pages/App.scss";
import "./styles/Common.scss";

function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { autoSignIn } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    autoSignIn();
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme.toString());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith("/board/")) {
      if (appRef.current?.classList.contains("justify-content-start")) {
        appRef.current?.classList.remove("justify-content-start");
      }
    }
  }, [location]);

  return (
    <div className="app" ref={appRef}>
      <Header />
      <main className="w-100 d-flex">
        <Routes />
      </main>
    </div>
  );
}

export default App;
