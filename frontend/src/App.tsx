import { Route, Routes } from "react-router-dom";
import MainComponent from "./components/MainComponent";
import SignUpComponent from "./components/SignUpComponent";
import "./styles/App.css";
import MemberDetailComponent from "./components/MemberDetailComponent";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainComponent />} />
        <Route path="/signUp" element={<SignUpComponent />} />
        <Route path="/member" element={<MemberDetailComponent />} />
      </Routes>
    </div>
  );
}

export default App;
