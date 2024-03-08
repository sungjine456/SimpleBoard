import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../components/contexts/AuthContext";
import MemberToEmailRequest from "../models/requests/MemberToEmailRequest";
import SignUpRequest from "../models/requests/SignUpRequest";
import MemberResponse from "../models/responses/MemberResponse";
import SignInResponse from "../models/responses/SignInResponse";

export function useSignIn(): (
  member: MemberToEmailRequest
) => Promise<boolean> {
  const { signIn } = useContext(AuthContext);

  return (member: MemberToEmailRequest) => {
    return axios
      .post<SignInResponse>("http://localhost:8080/sign-in", member)
      .then((r) => {
        signIn(r.data);
        return true;
      })
      .catch((e) => {
        alert(e.response.data.message);
        return false;
      });
  };
}

export function useSignUp(): (member: SignUpRequest) => Promise<string> {
  const { signIn } = useContext(AuthContext);

  return (member: SignUpRequest) => {
    return axios
      .post<SignInResponse>("http://localhost:8080/sign-up", member)
      .then((r) => {
        signIn(r.data);
        return;
      })
      .catch((e) => {
        if (e.response?.data?.message === "중복") {
          return e.response.data.message;
        } else {
          return "실패";
        }
      });
  };
}

export function useFindMember(): (id: number) => Promise<MemberResponse> {
  return (id: number) => {
    return axios
      .get<MemberResponse>(`http://localhost:8080/mem/${id}`)
      .then((r) => r.data)
      .catch((_) => {
        return {
          name: "-",
          email: "-",
          message: "",
        };
      });
  };
}

export function useCheckEmail(): (email: string) => Promise<boolean> {
  return (email: string) => {
    return axios
      .post("http://localhost:8080/checkEmail", {
        email: email,
      })
      .then((b) => b.data);
  };
}

export function useVerifyIdentity(): (psasword: string) => Promise<boolean> {
  return (password: string) => {
    return axios
      .post("http://localhost:8080/my/check", password)
      .then((b) => b.data);
  };
}

export function useGetMember(): () => Promise<MemberResponse> {
  return () => {
    return axios
      .get<MemberResponse>(`http://localhost:8080/my`)
      .then((r) => r.data)
      .catch((_) => {
        return {
          name: "-",
          email: "-",
          message: "",
        };
      });
  };
}

export function useUpdateMember(): (req: { name: string }) => Promise<boolean> {
  return (req: { name: string }) => {
    return axios.post("http://localhost:8080/my", req).then((b) => {
      return b.data;
    });
  };
}

export function useLeaveMember(): (password: string) => Promise<boolean> {
  return (password: string) => {
    return axios
      .post("http://localhost:8080/my/leave", password)
      .then((b) => b.data);
  };
}
