import { Route, Routes } from "react-router-dom";
import MainComponent from "./components/MainComponent";
import SignUpFormComponent from "./components/SignUpFormComponent";
import "./styles/App.css";
import MemberDetailComponent from "./components/MemberDetailComponent";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainComponent />} />
        <Route path="/signUp" element={<SignUpFormComponent />} />
        <Route path="/member" element={<MemberDetailComponent />} />
      </Routes>
    </div>
  );
}

export default App;
