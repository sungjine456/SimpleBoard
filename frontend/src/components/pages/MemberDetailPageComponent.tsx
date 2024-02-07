import { useState } from "react";
import MemberService from "../../services/MemberService";

function MemberDetailPageComponent() {
  const [email, setEmail] = useState("");

  MemberService.findMember().then((d) => setEmail(d.email));

  return <div>{email}</div>;
}

export default MemberDetailPageComponent;
