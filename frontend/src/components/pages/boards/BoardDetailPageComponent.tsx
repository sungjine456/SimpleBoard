import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BoardResponse from "../../../models/responses/BoardResponse";
import { useFindBoard } from "../../../services/BoardService";
import styles from "../../../styles/pages/boards/BoardDetailPage.module.scss";
import { dateToString } from "../../../utils/Utils";
import { AuthContext } from "../../contexts/AuthContext";
import { BoardContext } from "../../contexts/BoardContext";

function BoardDetailPageComponent() {
  const params = useParams();
  const navigate = useNavigate();
  const { memberId } = useContext(AuthContext);
  const { setBoard: setBoardContext } = useContext(BoardContext);
  const findBoard = useFindBoard();
  const id = parseInt(params.id ?? "-1");
  const [board, setBoard] = useState<BoardResponse>({
    id: -99999,
    memberId: -99999,
    title: "",
    content: "",
    memberName: "",
    date: new Date(),
  });
  const [didLoad, setDidLoad] = useState<boolean>(false);
  const [isAdmin, setIsAmin] = useState<boolean>(false);

  useEffect(() => {
    if (!didLoad) {
      findBoard(id).then((b) => {
        setBoard(b);
        setIsAmin(b.memberId === memberId);
        setDidLoad(true);
      });
    }
  }, [findBoard, id, didLoad, memberId]);

  document
    .getElementsByClassName("app")[0]
    .classList.add("justify-content-start");

  function updateHandler() {
    setBoardContext({ title: board.title, content: board.content });
    navigate(`/board/${id}/update`);
  }

  return (
    <div className={`m-auto ${styles.main}`}>
      <div className={`t-center ${styles.title}`}>{board.title}</div>
      <div className="d-flex justify-content-center">
        <span className="t-center">{dateToString(board.date)}</span>
        {isAdmin && (
          <span className={styles["update-btn"]} onClick={updateHandler}>
            수정
          </span>
        )}
      </div>
      <div className="line"></div>
      <div>{board?.content}</div>
    </div>
  );
}

export default BoardDetailPageComponent;
