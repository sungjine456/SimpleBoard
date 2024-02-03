import { useState } from "react";
import { useNavigate } from "react-router-dom";
import memberService from "../services/MemberService";
import "../styles/Common.css";
import "../styles/Form.css";

function SignUpComponent() {
  let navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function onClick() {
    if (password === passwordConfirm) {
      memberService.signUp({ name, email, password }).then(() => navigate("/"));
    }
  }

  return (
    <div className="form">
      <div>
        <label>이름</label>
        <input
          placeholder="이름"
          onChange={(e) => setName(e.target.value)}
        ></input>
      </div>
      <div>
        <label>이메일</label>
        <input
          type="email"
          placeholder="이메일"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>
      <div>
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      <div>
        <label>비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호 확인"
          onChange={(e) => setPasswordConfirm(e.target.value)}
        ></input>
      </div>
      <button
        className="btn btn-light align-self-end"
        onClick={() => onClick()}
      >
        가입하기
      </button>
    </div>
  );
}

export default SignUpComponent;
