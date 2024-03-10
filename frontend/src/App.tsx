import { useContext, useEffect } from "react";
import { AuthContext } from "./components/contexts/AuthContext";
import Header from "./components/layouts/Header";
import Routes from "./routes/Routes";
import "./styles/Common.scss";
import "./styles/components/Button.scss";
import "./styles/components/Form.scss";
import "./styles/components/Icons.scss";
import "./styles/components/Table.scss";
import "./styles/pages/App.scss";
import storage from "./utils/Storage";

function App() {
  const { setToken } = useContext(AuthContext);

  useEffect(() => {
    const token = storage.get("token");

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
