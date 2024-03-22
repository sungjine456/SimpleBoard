import BoardRequest from "../models/requests/BoardRequest";
import BoardResponse from "../models/responses/BoardResponse";
import { getOrElse, postOrElse } from "./AxiosWrapper";

export function useWrite(): (board: BoardRequest) => Promise<boolean> {
  return (board: BoardRequest) => {
    return postOrElse<boolean>("/board", board, {}, false);
  };
}

export function useUpdate(): (
  id: number,
  board: BoardRequest
) => Promise<boolean> {
  return (id: number, board: BoardRequest) => {
    return postOrElse<boolean>(`/board/${id}`, board, {}, false);
  };
}

export function useFindBoard(): (id: number) => Promise<BoardResponse> {
  return (id: number) => {
    return getOrElse<BoardResponse>(
      `/board/${id}`,
      {},
      {
        id: -1,
        memberId: -1,
        title: "",
        content: "",
        memberName: "",
        date: new Date(),
      }
    );
  };
}

export function useFindBoards(): () => Promise<BoardResponse[]> {
  return () => {
    return getOrElse<BoardResponse[]>("/boards", {}, []);
  };
}
