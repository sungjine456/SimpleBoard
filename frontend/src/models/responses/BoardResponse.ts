interface BoardResponse {
  id: number;
  memberId: number;
  title: string;
  content: string;
  memberName: string;
  date: Date;
  admin: boolean;
}

const emptyBoardResponse: BoardResponse = {
  id: -1,
  memberId: -1,
  title: "",
  content: "",
  memberName: "",
  date: new Date(),
  admin: false,
};

export default BoardResponse;
export { emptyBoardResponse };
