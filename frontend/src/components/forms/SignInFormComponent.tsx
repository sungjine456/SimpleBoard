import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MemberToEmailRequest from "../../models/requests/MemberToEmailRequest";
import { useSignIn } from "../../services/MemberService";
import "../../styles/common.css";
import "../../styles/components/form.css";

interface ISignInForm {
  handler: () => void;
}

function SignInFormComponent({ handler }: ISignInForm) {
  const navigate = useNavigate();
  const signIn = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { isSubmitted, errors },
  } = useForm<MemberToEmailRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: MemberToEmailRequest) => {
    signIn(data).then((b) => {
      if (b) handler();
    });
  };

  return (
    <div className="form">
      <div>
        <label>이메일</label>
        <input
          type="email"
          placeholder="이메일"
          aria-invalid={
            isSubmitted ? (errors.email ? "true" : "false") : undefined
          }
          {...register("email", {
            required: "이메일을 입력해주세요.",
            pattern: {
              value:
                /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
              message: "이메일 형식에 맞지 않습니다.",
            },
          })}
        ></input>
      </div>
      {errors.email && <small role="alert">{errors.email.message}</small>}
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
      {errors.password && <small role="alert">{errors.password.message}</small>}
      <div className="buttons">
        <button
          className="btn btn-light"
          type="button"
          onClick={handleSubmit(onSubmit)}
        >
          로그인
        </button>
        <button className="btn btn-light" onClick={() => navigate("/signUp")}>
          가입하기
        </button>
      </div>
    </div>
  );
}

export default SignInFormComponent;
