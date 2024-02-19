import { useContext, useEffect } from "react";
import { AuthContext } from "./components/contexts/AuthContext";
import Header from "./components/layouts/Header";
import Routes from "./routes/Routes";
import "./styles/pages/app.css";

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
