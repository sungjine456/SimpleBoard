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

function App() {
  const { autoSignIn } = useContext(AuthContext);

  useEffect(() => {
    autoSignIn();
  });

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
