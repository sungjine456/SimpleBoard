import axios from "axios";
import { useState } from "react";
import SignInFormComponent from "../forms/SignInFormComponent";

function MainPageComponent() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(
    !!axios.defaults.headers.common["Authorization"]
  );

  return (
    <div>
      <p>{isSignedIn}</p>
      {isSignedIn ? null : (
        <SignInFormComponent handler={(b) => setIsSignedIn(b)} />
      )}
    </div>
  );
}

export default MainPageComponent;
