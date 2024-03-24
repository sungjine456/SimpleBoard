import { useNavigate } from "react-router-dom";
import SignInFormComponent from "../forms/SignInFormComponent";

function SignInPageComponent() {
  const navigate = useNavigate();

  return (
    <div className="d-flex-column m-auto">
      <SignInFormComponent />

      <div className="buttons align-self-end">
        <button
          className="btn btn-light m-r-0"
          type="button"
          onClick={() => navigate("/signUp")}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}

export default SignInPageComponent;
