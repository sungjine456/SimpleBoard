import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useLeaveMember,
  useVerifyIdentity,
} from "../../services/MemberService";
import { AuthContext } from "../contexts/AuthContext";

interface CheckForm {
  password: string;
}

function PasswordCheckComponent() {
  const navigate = useNavigate();
  const verifyIdentity = useVerifyIdentity();
  const leaveMember = useLeaveMember();

  const { state } = useLocation();
  const { signOut } = useContext(AuthContext);

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
    verifyIdentity(data.password).then((b) => {
      if (b) {
        if (state.url === "update") {
          navigate("/my", { state: { success: true } });
        } else if (state.url === "leave") {
          leaveMember(data.password).then((b) => {
            if (b) {
              alert("탈퇴되었습니다.");
              signOut();
            }
          });
        }
      }
    });
  };

  return (
    <div className="m-auto">
      <h3>비밀번호 재확인</h3>
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
            type="submit"
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
