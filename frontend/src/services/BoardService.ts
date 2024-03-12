import BoardRequest from "../models/requests/BoardRequest";
import BoardResponse from "../models/responses/BoardResponse";
import { getOrElse, postOrElse } from "./AxiosWrapper";

export function useWrite(): (board: BoardRequest) => Promise<boolean> {
  return (board: BoardRequest) => {
    return postOrElse<boolean>("/board", board, {}, false);
  };
}

export function useFindBoard(): (id: number) => Promise<BoardResponse> {
  return (id: number) => {
    return getOrElse<BoardResponse>(
      `/board/${id}`,
      {},
      {
        id: -1,
        title: "",
        content: "",
      }
    );
  };
}

export function useFindBoards(): () => Promise<BoardResponse[]> {
  return () => {
    return getOrElse<BoardResponse[]>("/boards", {}, []);
  };
}
