import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function SignOutButton() {
  const { signOut } = useContext(AuthContext);

  const onClick = () => {
    signOut();
  };

  return <button onClick={onClick}>로그아웃</button>;
}

export default SignOutButton;
