import { useContext } from "react";
import SignOutButton from "../buttons/SignOutButton";
import { AuthContext } from "../contexts/AuthContext";
import SignInFormComponent from "../forms/SignInFormComponent";

function MainPageComponent() {
  const { authenticated } = useContext(AuthContext);

  return (
    <div>
      <p>{authenticated}</p>
      {authenticated ? <SignOutButton /> : <SignInFormComponent />}
    </div>
  );
}

export default MainPageComponent;
