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
  const [page, setPage] = useState<number>(0);
  const [maxPage, setMaxPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [pages, setPages] = useState<number[]>([]);
  const [count, setCount] = useState<number>(10);

  useEffect(() => {
    if (!didLoad) {
      setInBoards(page, count);
    }
    // eslint-disable-next-line
  }, [page, didLoad]);

  function onClickHandler(p: number) {
    setPage(p - 1);
    setInBoards(p - 1, count);
  }

  function setInBoards(p: number, c: number) {
    findBoards(p, c).then((d) => {
      setBoards(d.boards);
      setDidLoad(true);
      setTotalPage(d.totalPage);
      const p = [];
      for (let i = 0; i < 10; i++) {
        if (i + 1 > d.totalPage) break;
        p.push(i + 1);
        setMaxPage(i + 1);
      }
      setPages(p);
    });
  }

  function countChangeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
    const c = Number(e.target.value);

    setCount(c);
    setInBoards(page, c);
  }

  return (
    <div
      className={boards.length === 0 ? `m-auto ${styles.main}` : styles.main}
    >
      {boards.length !== 0 ? (
        <>
          <div className={styles.select}>
            <select
              defaultValue={count}
              name="language"
              onChange={countChangeHandler}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
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
          <div className={styles.paging}>
            {page >= 10 && <span>이전</span>}
            {pages.map((p) => (
              <span
                className={p === page + 1 ? styles.selected : ""}
                key={p}
                onClick={() => onClickHandler(p)}
              >
                {p}
              </span>
            ))}
            {maxPage % 10 === 0 && maxPage < totalPage && <span>다음</span>}
          </div>
        </>
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
