import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateMember } from "../../../services/MemberService";
import styles from "../../../styles/pages/my/MyPage.module.scss";

function UpdateComponent({
  handler,
  member,
}: {
  member: { name: string; email: string };
  handler: (b: boolean) => void;
}) {
  const { pathname } = useLocation();
  const updateMember = useUpdateMember();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitted, errors },
  } = useForm<{ name: string }>({
    mode: "onBlur",
  });

  useEffect(() => {
    setValue("name", member.name);
  }, [setValue, member.name]);

  const update = (data: { name: string }) => {
    updateMember(data).then((b) => {
      handler(!b);
      navigate(pathname, {});
    });
  };

  return (
    <div className={styles.main}>
      <h3>계정 수정 페이지</h3>
      <form id="my-page-form">
        <table>
          <colgroup>
            <col style={{ width: "135px" }} />
            <col style={{ width: "230px" }} />
          </colgroup>
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
        </table>
      </form>
      <div className={styles.buttons}>
        <button
          onClick={handleSubmit(update)}
          type="submit"
          form="my-page-form"
        >
          수정
        </button>
      </div>
    </div>
  );
}

export default UpdateComponent;
