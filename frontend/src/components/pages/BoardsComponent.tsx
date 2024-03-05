import { useState } from "react";
import BoardResponse from "../../models/responses/BoardResponse";
import { useFindBoards } from "../../services/BoardService";

function BoardsComponent() {
  const findBoards = useFindBoards();
  const [boards, setBoards] = useState<BoardResponse[]>([]);

  findBoards().then((b) => setBoards(b));

  return (
    <div>
      {boards.length !== 0 ? (
        <table>
          <tbody>
            {boards.map((b) => (
              <tr>
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
