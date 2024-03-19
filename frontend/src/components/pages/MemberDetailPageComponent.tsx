import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFindMember } from "../../services/MemberService";

function MemberDetailPageComponent() {
  const findMember = useFindMember();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const params = useParams();
  const id = parseInt(params.userId ?? "-1");

  if (id > 0) {
    findMember(id).then((d) => {
      setEmail(d.email);
      setName(d.name);
    });
  }

  return (
    <div className="m-auto">
      <div>
        <p>이름 : {name}</p>
      </div>
      <div>
        <p>이메일 : {email}</p>
      </div>
    </div>
  );
}

export default MemberDetailPageComponent;
