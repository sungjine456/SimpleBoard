import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/components/table.css";
import "../../styles/pages/my-page.css";
import { AuthContext } from "../contexts/AuthContext";

function MyPageComponent() {
  const { member } = useContext(AuthContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  let success = false;

  if (state != null && state.success) {
    success = state.success;
  }

  const update = () => {
    navigate("/"); //TODO Update 기능 추가
  };

  return (
    <div id="my-page">
      <div className="title">계정 페이지</div>
      <table>
        <colgroup>
          <col style={{ width: "135px" }} />
          <col style={{ width: "230px" }} />
        </colgroup>
        {!success && (
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
        )}
        {success && (
          <tbody>
            <tr>
              <th>이름</th>
              <td>
                <input defaultValue={member.name} />
              </td>
            </tr>
            <tr>
              <th>이메일</th>
              <td>
                <input defaultValue={member.email} />
              </td>
            </tr>
            <tr>
              <th>비밀번호</th>
              <td>
                <input type="password"></input>
              </td>
            </tr>
          </tbody>
        )}
      </table>

      <div className="buttons">
        {!success && (
          <Link to="/my/check">
            <button>수정하기</button>
          </Link>
        )}
        {success && <button onClick={update}>수정하기</button>}
      </div>
    </div>
  );
}

export default MyPageComponent;
