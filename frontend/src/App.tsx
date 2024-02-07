import { Route, Routes } from "react-router-dom";
import SignUpFormComponent from "./components/forms/SignUpFormComponent";
import MainComponent from "./components/pages/MainPageComponent";
import MemberDetailComponent from "./components/pages/MemberDetailPageComponent";
import "./styles/App.css";

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
