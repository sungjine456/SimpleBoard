import { useContext, useEffect } from "react";
import { AuthContext } from "./components/contexts/AuthContext";
import Header from "./components/layouts/Header";
import Routes from "./routes/Routes";
import "./styles/Common.css";
import "./styles/components/Button.css";
import "./styles/components/Form.css";
import "./styles/components/Icons.css";
import "./styles/components/Table.css";
import "./styles/pages/App.css";

function App() {
  const { setToken } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    setToken(token);
  });

  return (
    <div className="app">
      <Header />
      <main>
        <Routes />
      </main>
    </div>
  );
}

export default App;
