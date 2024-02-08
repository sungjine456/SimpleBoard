import { useContext } from "react";
import SignOutButton from "../buttons/SignOutButton";
import { AuthContext } from "../contexts/AuthContext";
import SignInFormComponent from "../forms/SignInFormComponent";

function MainPageComponent() {
  const { authenticated, setAuthenticated } = useContext(AuthContext);

  const handleSignIn = () => {
    setAuthenticated(true);
  };

  return (
    <div>
      <p>{authenticated}</p>
      {authenticated ? (
        <SignOutButton />
      ) : (
        <SignInFormComponent handler={() => handleSignIn()} />
      )}
    </div>
  );
}

export default MainPageComponent;
