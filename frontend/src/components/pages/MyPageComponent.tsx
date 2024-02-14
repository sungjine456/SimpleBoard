import { useState } from "react";
import storage from "../../utils/Storage";

function MyPageComponent() {
  const data = storage.get("user");

  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);

  return (
    <div>
      <div>이름 : {name}</div>
      <div>이메일 : {email}</div>
      <div>비밀번호</div>
    </div>
  );
}

export default MyPageComponent;
