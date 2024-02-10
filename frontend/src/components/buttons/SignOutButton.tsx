import { useSignOut } from "../../services/AuthService";

function SignOutButton() {
  const signOut = useSignOut();

  const onClick = () => {
    signOut();
  };

  return <button onClick={onClick}>로그아웃</button>;
}

export default SignOutButton;
