import styles from "../../styles/pages/MainPage.module.scss";
import BoardsComponent from "./BoardsComponent";

function MainPageComponent() {
  return (
    <div className={`d-flex-column m-auto ${styles.main}`}>
      <BoardsComponent />
    </div>
  );
}

export default MainPageComponent;
