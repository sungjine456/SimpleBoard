import { ReactNode, createContext, useState } from "react";

interface Board {
  title: string;
  content: string;
}

interface IBoardContext {
  board: Board;
  setBoard: (board: Board) => void;
}

const BoardContext = createContext<IBoardContext>({
  board: { title: "", content: "" },
  setBoard: (_: Board) => {},
});

const BoardContextProvider = ({ children }: { children?: ReactNode }) => {
  const [board, setBoard] = useState<Board>({ title: "", content: "" });

  return (
    <BoardContext.Provider value={{ board, setBoard }}>
      {children}
    </BoardContext.Provider>
  );
};

export { BoardContext, BoardContextProvider };
