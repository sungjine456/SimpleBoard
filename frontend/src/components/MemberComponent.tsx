import memberService from "../services/MemberService";

function MemberComponent() {
  return (
    <button
      onClick={() =>
        memberService.addMember({
          name: "n",
          email: "e",
          password: "p",
        })
      }
    >
      맴버 추가하기
    </button>
  );
}

export default MemberComponent;
