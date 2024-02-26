import { useContext } from "react";
import SignOutButton from "../buttons/SignOutButton";
import { AuthContext } from "../contexts/AuthContext";
import SignInFormComponent from "../forms/SignInFormComponent";
import { useNavigate } from "react-router-dom";

function MainPageComponent() {
  const { authenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="d-flex-column">
      {authenticated ? (
        <SignOutButton />
      ) : (
        <div>
          <SignInFormComponent />

          <div className="buttons align-self-end">
            <button
              className="btn btn-light"
              type="button"
              onClick={() => navigate("/signUp")}
            >
              가입하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPageComponent;
