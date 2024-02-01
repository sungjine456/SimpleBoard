import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MemberService from "../services/MemberService";
import "../styles/Common.css";
import "../styles/Form.css";

function LoginComponent() {
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="form">
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
      <div className="buttons">
        <button
          className="btn btn-light"
          onClick={() => {
            MemberService.login({ email, password });
          }}
        >
          로그인
        </button>
        <button className="btn btn-light" onClick={() => navigate("/signin")}>
          가입하기
        </button>
      </div>
    </div>
  );
}

export default LoginComponent;
