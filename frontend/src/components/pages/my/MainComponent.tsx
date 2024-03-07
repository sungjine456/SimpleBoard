import { Link } from "react-router-dom";
import styles from "../../../styles/pages/MyPage.module.scss";

function MainComponent({
  member,
}: {
  member: { name: string; email: string };
}) {
  return (
    <div className={styles.main}>
      <h3>계정 페이지</h3>
      <table>
        <colgroup>
          <col style={{ width: "135px" }} />
          <col style={{ width: "230px" }} />
        </colgroup>
        <tbody>
          <tr>
            <th>이름</th>
            <td>{member.name}</td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>{member.email}</td>
          </tr>
          <tr>
            <th>비밀번호</th>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div className={styles.buttons}>
        <Link to="/my/check" state={{ url: "update" }}>
          <button type="button">수정하기</button>
        </Link>
        <Link to="/my/check" state={{ url: "leave" }}>
          <button type="button">탈퇴하기</button>
        </Link>
      </div>
    </div>
  );
}

export default MainComponent;
