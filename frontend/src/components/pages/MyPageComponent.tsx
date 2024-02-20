import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUpdateMember } from "../../services/MemberService";
import "../../styles/common.css";
import "../../styles/components/table.css";
import "../../styles/pages/my-page.css";
import { AuthContext } from "../contexts/AuthContext";

function MyPageComponent() {
  const { member } = useContext(AuthContext);
  const [success, setSuccess] = useState(false);
  const { state, pathname } = useLocation();
  const updateMember = useUpdateMember();
  const navigate = useNavigate();

  if (state != null && state.success && state.success !== success) {
    setSuccess(state.success);
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitted, errors },
  } = useForm<{ name: string }>({
    mode: "onBlur",
    defaultValues: {
      name: member.name,
    },
  });

  const update = (data: { name: string }) => {
    updateMember(member.id, data.name).then((b) => {
      setSuccess(!b);
      navigate(pathname, {});
    });
  };

  return (
    <form>
      <div id="my-page">
        {!success && <div className="title">계정 페이지</div>}
        {success && <div className="title">계정 수정 페이지</div>}
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
                  <input
                    className="d-block"
                    style={{ margin: "initial" }}
                    type="text"
                    placeholder="이름"
                    aria-invalid={
                      isSubmitted ? (errors.name ? "true" : "false") : undefined
                    }
                    {...register("name", {
                      required: "이름을 입력해주세요.",
                    })}
                    maxLength={10}
                  ></input>
                  {errors.name && (
                    <small role="alert">{errors.name.message}</small>
                  )}
                </td>
              </tr>
              <tr>
                <th>이메일</th>
                <td>{member.email}</td>
              </tr>
              <tr>
                <th>비밀번호</th>
                <td>
                  <button className="d-block" type="button">
                    비밀번호 변경
                  </button>
                </td>
              </tr>
            </tbody>
          )}
        </table>
        <div className="buttons">
          {!success && (
            <Link to="/my/check">
              <button type="button">수정하기</button>
            </Link>
          )}
          {success && (
            <button onClick={handleSubmit(update)} type="submit">
              수정
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default MyPageComponent;
