import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BoardResponse from "../../models/responses/BoardResponse";
import { useFindBoards } from "../../services/BoardService";
import styles from "../../styles/pages/Boards.module.scss";
import { dateToString } from "../../utils/Utils";
import { AuthContext } from "../contexts/AuthContext";

function BoardsComponent() {
  const navigate = useNavigate();
  const findBoards = useFindBoards();

  const { authenticated } = useContext(AuthContext);

  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [didLoad, setDidLoad] = useState<boolean>(false);

  useEffect(() => {
    if (!didLoad) {
      findBoards().then((b) => {
        setBoards(b);
        setDidLoad(true);
      });
    }
  }, [findBoards, didLoad]);

  return (
    <div
      className={boards.length === 0 ? `m-auto ${styles.main}` : styles.main}
    >
      {boards.length !== 0 ? (
        <div className={styles.items}>
          {boards.map((b) => (
            <div className={styles.item} key={b.id}>
              <div className={`d-flex ${styles.header}`}>
                <div className={styles.name}>
                  <Link to={`/mem/${b.memberId}`}>{b.memberName}</Link>
                </div>
                <div>{dateToString(b.date)}</div>
              </div>
              <div className={styles.title}>
                <Link to={`/board/${b.id}`}>{b.title}</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>현재 작성된 글이 없습니다.</div>
      )}
      {authenticated && (
        <button
          className="align-self-end btn-md"
          type="button"
          onClick={() => navigate("/board")}
        >
          글쓰기
        </button>
      )}
    </div>
  );
}

export default BoardsComponent;
