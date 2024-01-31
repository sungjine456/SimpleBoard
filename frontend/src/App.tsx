import "./styles/App.css";
import { useEffect, useState } from "react";
import memberService from "./services/MemberService";
import MemberRespons from "./models/responses/MemberRespons";
import MemberComponent from "./components/MemberComponent";

function App() {
  const [data, set] = useState<MemberRespons>();

  useEffect(() => {
    memberService.findMember().then((res) => {
      set(res);
    });
  }, []);
  return (
    <div className="App">
      <div>
        <p>유저의 이메일 : {data?.email}</p>
        <p>유저의 이름 : {data?.name}</p>
      </div>
      <div>
        <MemberComponent />
      </div>
    </div>
  );
}

export default App;
