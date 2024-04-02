import BoardRequest from "../models/requests/BoardRequest";
import BoardResponse, {
  emptyBoardResponse,
} from "../models/responses/BoardResponse";
import PagingResponse, {
  emptyPagingResponse,
} from "../models/responses/PagingResponse";
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
    return getOrElse<BoardResponse>(`/board/${id}`, {}, emptyBoardResponse);
  };
}

export function useFindBoards(): (
  page: number,
  count: number
) => Promise<PagingResponse> {
  return (page: number, count: number) => {
    return getOrElse<PagingResponse>(
      "/boards",
      { params: { page: page, count: count } },
      emptyPagingResponse
    );
  };
}
