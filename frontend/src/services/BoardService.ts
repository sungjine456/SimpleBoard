import axios from "axios";
import BoardRequest from "../models/requests/BoardRequest";

export function useWrite(): (board: BoardRequest) => Promise<boolean> {
  return (board: BoardRequest) => {
    return axios
      .post<boolean>("http://localhost:8080/board", board)
      .then((r) => {
        return r.data;
      })
      .catch((_) => {
        return false;
      });
  };
}
