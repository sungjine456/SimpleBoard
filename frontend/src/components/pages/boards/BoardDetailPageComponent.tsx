import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BoardResponse from "../../../models/responses/BoardResponse";
import { useFindBoard } from "../../../services/BoardService";

function BoardDetailPageComponent() {
  const params = useParams();
  const findBoard = useFindBoard();
  const id = parseInt(params.id ?? "-1");
  const [board, setBoard] = useState<BoardResponse | null>(null);
  const [didLoad, setDidLoad] = useState<boolean>(false);

  useEffect(() => {
    if (!didLoad) {
      findBoard(id).then(setBoard);
      setDidLoad(true);
    }
  }, [findBoard, id, didLoad]);

  return (
    <div>
      <div>{board?.title}</div>
      <div>{board?.content}</div>
    </div>
  );
}

export default BoardDetailPageComponent;
