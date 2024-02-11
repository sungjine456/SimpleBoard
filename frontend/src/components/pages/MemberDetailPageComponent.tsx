import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFindMember } from "../../services/MemberService";

function MemberDetailPageComponent() {
  const findMember = useFindMember();
  const [email, setEmail] = useState("");
  const params = useParams();
  const id = parseInt(params.userId ?? "-1");

  if (id > 0) {
    findMember(id).then((d) => setEmail(d.email));
  }

  return <div>{email}</div>;
}

export default MemberDetailPageComponent;
