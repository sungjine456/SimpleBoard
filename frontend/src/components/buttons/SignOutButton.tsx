import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function SignOutButton() {
  const { setAuthenticated } = useContext(AuthContext);

  const onClick = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    axios.defaults.headers.common["Authorization"] = "";
  };

  return <button onClick={onClick}>로그아웃</button>;
}

export default SignOutButton;
