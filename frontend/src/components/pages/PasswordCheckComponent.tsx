import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useVerifyIdentity } from "../../services/MemberService";
import "../../styles/common.css";
import "../../styles/components/form.css";
import { AuthContext } from "../contexts/AuthContext";

interface CheckForm {
  password: string;
}

function PasswordCheckComponent() {
  const navigate = useNavigate();
  const verifyIdentity = useVerifyIdentity();
  const { member } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { isSubmitted, errors },
  } = useForm<CheckForm>({
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (data: CheckForm) => {
    verifyIdentity({
      id: member.id,
      password: data.password,
    }).then((b) => {
      if (b) {
        navigate("/my", { state: { success: true } });
      }
    });
  };

  return (
    <div>
      <div className="title">비밀번호 재확인</div>
      <form>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호"
            aria-invalid={
              isSubmitted ? (errors.password ? "true" : "false") : undefined
            }
            {...register("password", {
              required: "비밀번호를 입력해주세요.",
              minLength: {
                value: 8,
                message: "8자리 이상 비밀번호를 사용하세요.",
              },
            })}
          ></input>
        </div>
        {errors.password && (
          <small role="alert">{errors.password.message}</small>
        )}
        <div className="buttons">
          <button
            className="btn btn-light"
            type="button"
            onClick={handleSubmit(onSubmit)}
          >
            확인
          </button>
        </div>
      </form>
    </div>
  );
}

export default PasswordCheckComponent;
