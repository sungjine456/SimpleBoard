import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetMember } from "../../../services/MemberService";
import styles from "../../../styles/pages/MyPage.module.scss";
import MainComponent from "./MainComponent";
import UpdateComponent from "./UpdateComponent";

function MyPageComponent() {
  const getMember = useGetMember();
  const { state } = useLocation();
  const [success, setSuccess] = useState(false);
  const [didLoad, setDidLoad] = useState<boolean>(false);
  const [member, setMember] = useState<{ name: string; email: string }>({
    name: "-",
    email: "-",
  });

  if (state != null && state.success && state.success !== success) {
    setSuccess(state.success);
  }

  useEffect(() => {
    if (!didLoad) {
      getMember().then((m) => {
        setMember(m);
        setDidLoad(true);
      });
    }
  }, [didLoad, getMember]);

  return (
    <div className={styles.main}>
      {success ? (
        <UpdateComponent
          member={member}
          handler={(b: boolean) => setSuccess(b)}
        />
      ) : (
        <MainComponent member={member} />
      )}
    </div>
  );
}

export default MyPageComponent;
