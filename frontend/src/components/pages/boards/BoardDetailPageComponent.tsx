import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BoardResponse from "../../../models/responses/BoardResponse";
import { useFindBoard } from "../../../services/BoardService";
import styles from "../../../styles/pages/boards/BoardDetailPage.module.scss";
import { dateToString } from "../../../utils/Utils";

function BoardDetailPageComponent() {
  const params = useParams();
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

  useEffect(() => {
    if (!didLoad) {
      findBoard(id).then((b) => {
        setBoard(b);
        setDidLoad(true);
      });
    }
  }, [findBoard, id, didLoad]);

  document
    .getElementsByClassName("app")[0]
    .classList.add("justify-content-start");

  return (
    <div className={`m-auto ${styles.main}`}>
      <div className={`t-center ${styles.title}`}>{board.title}</div>
      <p className="t-center">{dateToString(board.date)}</p>
      <div className="line"></div>
      <div>{board?.content}</div>
    </div>
  );
}

export default BoardDetailPageComponent;
