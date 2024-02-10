import axios from "axios";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./components/contexts/AuthContext";
import Header from "./components/layouts/Header";
import Routes from "./routes/Routes";
import "./styles/App.css";

function App() {
  const { setAuthenticated } = useContext(AuthContext);

  const initialize = () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setAuthenticated(true);
  };

  initialize();

  return (
    <div className="app">
      <AuthProvider>
        <Header />
        <main>
          <Routes />
        </main>
      </AuthProvider>
    </div>
  );
}

export default App;
