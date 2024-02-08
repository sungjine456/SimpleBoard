import axios from "axios";
import { useContext } from "react";
import Routes from "./components/Routes";
import { AuthContext, AuthProvider } from "./components/contexts/AuthContext";
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
    <div className="App">
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </div>
  );
}

export default App;
