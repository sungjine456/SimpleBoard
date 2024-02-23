import { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../../../styles/pages/MyPage.module.scss";
import MainComponent from "./MainComponent";
import UpdateComponent from "./UpdateComponent";

function MyPageComponent() {
  const [success, setSuccess] = useState(false);
  const { state } = useLocation();

  if (state != null && state.success && state.success !== success) {
    setSuccess(state.success);
  }

  return (
    <div className={styles.main}>
      {success ? (
        <UpdateComponent handler={(b: boolean) => setSuccess(b)} />
      ) : (
        <MainComponent />
      )}
    </div>
  );
}

export default MyPageComponent;
