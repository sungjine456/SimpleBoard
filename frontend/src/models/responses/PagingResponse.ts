import BoardResponse from "./BoardResponse";

interface PagingResponse {
  boards: BoardResponse[];
  totalPage: number;
}

const emptyPagingResponse: PagingResponse = {
  boards: [],
  totalPage: 0,
};

export default PagingResponse;
export { emptyPagingResponse };
