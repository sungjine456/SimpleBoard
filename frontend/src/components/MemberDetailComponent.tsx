import { useState } from "react";
import MemberService from "../services/MemberService";
import axios from "axios";

function MemberDetailComponent() {
  const [email, setEmail] = useState("");

  console.log(axios.defaults.headers.common["Authorization"]);

  MemberService.findMember().then((d) => setEmail(d.email));

  return <div>{email}</div>;
}

export default MemberDetailComponent;
