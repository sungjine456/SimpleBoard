import { ReactNode, createContext, useState } from "react";
import Board, { emptyBoard } from "../../models/domains/Board";

interface IBoardContext {
  board: Board;
  setBoard: (board: Board) => void;
}

const BoardContext = createContext<IBoardContext>({
  board: emptyBoard,
  setBoard: (_: Board) => {},
});

const BoardContextProvider = ({ children }: { children?: ReactNode }) => {
  const [board, setBoard] = useState<Board>(emptyBoard);

  return (
    <BoardContext.Provider value={{ board, setBoard }}>
      {children}
    </BoardContext.Provider>
  );
};

export { BoardContext, BoardContextProvider };
