import { useParams } from "react-router-dom";
import { useFindBoard } from "../../../services/BoardService";
import BoardResponse from "../../../models/responses/BoardResponse";
import { useState } from "react";

function BoardDetailPageComponent() {
  const params = useParams();
  const findBoard = useFindBoard();
  const id = parseInt(params.id ?? "-1");
  const [board, setBoard] = useState<BoardResponse | null>(null);

  findBoard(id).then((b) => setBoard(b));

  return (
    <div>
      <div>{board?.title}</div>
      <div>{board?.content}</div>
    </div>
  );
}

export default BoardDetailPageComponent;
