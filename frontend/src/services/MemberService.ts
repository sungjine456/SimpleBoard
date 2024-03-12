import { useContext } from "react";
import { AuthContext } from "../components/contexts/AuthContext";
import MemberToEmailRequest from "../models/requests/MemberToEmailRequest";
import SignUpRequest from "../models/requests/SignUpRequest";
import MemberResponse from "../models/responses/MemberResponse";
import SignInResponse from "../models/responses/SignInResponse";
import { getOrElse, isError, post, postOrElse } from "./AxiosWrapper";

export function useSignIn(): (
  member: MemberToEmailRequest
) => Promise<boolean> {
  const { signIn } = useContext(AuthContext);

  return (member: MemberToEmailRequest) => {
    return post<SignInResponse>("/sign-in", member, {}).then((r) => {
      if (isError(r)) {
        alert(r.errorMessage);
        return false;
      }

      signIn(r);

      return true;
    });
  };
}

export function useSignUp(): (member: SignUpRequest) => Promise<string> {
  const { signIn } = useContext(AuthContext);

  return (member: SignUpRequest) => {
    return post<SignInResponse>("/sign-up", member, {}).then((r) => {
      if (isError(r)) {
        if (r.errorMessage === "중복") {
          return r.errorMessage;
        } else {
          return "실패";
        }
      }

      signIn(r);

      return "";
    });
  };
}

export function useFindMember(): (id: number) => Promise<MemberResponse> {
  return (id: number) => {
    return getOrElse<MemberResponse>(
      `/mem/${id}`,
      {},
      {
        name: "-",
        email: "-",
        message: "",
      }
    );
  };
}

export function useCheckEmail(): (email: string) => Promise<boolean> {
  return (email: string) => {
    return postOrElse<boolean>("/checkEmail", { email: email }, {}, false);
  };
}

export function useVerifyIdentity(): (psasword: string) => Promise<boolean> {
  return (password: string) => {
    return postOrElse<boolean>("/my/check", password, {}, false);
  };
}

export function useGetMember(): () => Promise<MemberResponse> {
  return () => {
    return getOrElse<MemberResponse>(
      "/my",
      {},
      {
        name: "-",
        email: "-",
        message: "",
      }
    );
  };
}

export function useUpdateMember(): (req: { name: string }) => Promise<boolean> {
  return (req: { name: string }) => {
    return postOrElse<boolean>("/my", req, {}, false);
  };
}

export function useLeaveMember(): (password: string) => Promise<boolean> {
  return (password: string) => {
    return postOrElse<boolean>("/my/leave", password, {}, false);
  };
}
