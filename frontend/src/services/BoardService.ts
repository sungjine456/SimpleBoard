import axios from "axios";
import BoardRequest from "../models/requests/BoardRequest";
import BoardResponse from "../models/responses/BoardResponse";

export function useWrite(): (board: BoardRequest) => Promise<boolean> {
  return (board: BoardRequest) => {
    return axios
      .post<boolean>("http://localhost:8080/board", board)
      .then((r) => r.data)
      .catch((_) => {
        return false;
      });
  };
}

export function useFindBoard(): (id: number) => Promise<BoardResponse> {
  return (id: number) => {
    return axios
      .get<BoardResponse>(`http://localhost:8080/board/${id}`)
      .then((r) => r.data)
      .catch((_) => {
        return { id: -1, title: "", content: "" };
      });
  };
}

export function useFindBoards(): () => Promise<BoardResponse[]> {
  return () => {
    return axios
      .get<BoardResponse[]>(`http://localhost:8080/boards`)
      .then((r) => r.data)
      .catch((_) => {
        return [];
      });
  };
}
