import { useContext, useEffect } from "react";
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
  const { autoSignIn } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    autoSignIn();
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme.toString());
    // eslint-disable-next-line
  }, []);

  return (
    <div className="app">
      <Header />
      <main className="w-100 d-flex">
        <Routes />
      </main>
    </div>
  );
}

export default App;
