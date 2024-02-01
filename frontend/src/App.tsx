import { Route, Routes } from "react-router-dom";
import MainComponent from "./components/MainComponent";
import SigninComponent from "./components/SigninComponent";
import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainComponent />} />
        <Route path="/signin" element={<SigninComponent />} />
      </Routes>
    </div>
  );
}

export default App;
