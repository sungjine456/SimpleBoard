import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/pages/MainPage.module.scss";
import { AuthContext } from "../contexts/AuthContext";
import SignInFormComponent from "../forms/SignInFormComponent";
import BoardsComponent from "./BoardsComponent";

function MainPageComponent() {
  const { authenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className={`d-flex-column m-auto ${styles.main}`}>
      {authenticated ? (
        <BoardsComponent />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default MainPageComponent;
