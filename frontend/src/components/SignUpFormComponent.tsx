import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import memberService from "../services/MemberService";
import "../styles/Common.css";
import "../styles/Form.css";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  passwordCheck: string;
}

function SignUpFormComponent() {
  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitted, errors },
  } = useForm<SignUpForm>({
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
  });

  const onSubmit = (data: SignUpForm) => {
    memberService
      .signUp({ name: data.name, email: data.email, password: data.password })
      .then(() => navigate("/"));
  };

  return (
    <div className="form">
      <div>
        <label>이름</label>
        <input
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
      </div>
      {errors.name && <small role="alert">{errors.name.message}</small>}
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
          maxLength={15}
        ></input>
      </div>
      {errors.password && <small role="alert">{errors.password.message}</small>}
      <div>
        <label>비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호 확인"
          aria-invalid={
            isSubmitted ? (errors.passwordCheck ? "true" : "false") : undefined
          }
          {...register("passwordCheck", {
            required: "비밀번호를 확인해주세요.",
            minLength: {
              value: 8,
              message: "8자리 이상 비밀번호를 사용하세요.",
            },
            validate: (pw, values) => {
              console.log(values.password);
              return pw === values.password || "비밀번호가 일치하지 않습니다.";
            },
          })}
          maxLength={15}
        ></input>
      </div>
      {errors.passwordCheck && (
        <small role="alert">{errors.passwordCheck.message}</small>
      )}
      <button
        className="btn btn-light align-self-end"
        type="button"
        onClick={handleSubmit(onSubmit)}
      >
        가입하기
      </button>
    </div>
  );
}

export default SignUpFormComponent;
