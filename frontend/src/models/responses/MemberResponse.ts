interface MemberResponse {
  name: string;
  email: string;
  message: string;
}

const emptyMemberResponse = {
  name: "-",
  email: "-",
  message: "",
};

export default MemberResponse;
export { emptyMemberResponse };
