import { useEffect, useState } from "react";
import BoardResponse from "../../models/responses/BoardResponse";
import { useFindBoards } from "../../services/BoardService";

function BoardsComponent() {
  const findBoards = useFindBoards();
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [didLoad, setDidLoad] = useState<boolean>(false);

  useEffect(() => {
    if (!didLoad) {
      findBoards().then(setBoards);
      setDidLoad(true);
    }
  }, [findBoards, didLoad]);

  return (
    <div>
      {boards.length !== 0 ? (
        <table>
          <tbody>
            {boards.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.title}</td>
                <td>{b.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>현재 작성된 글이 없습니다.</div>
      )}
    </div>
  );
}

export default BoardsComponent;
